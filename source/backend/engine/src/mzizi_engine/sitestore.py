"""One site's saved pages: hashed, versioned only when something meaningful changes, tracked in MongoDB.

Every page is saved the moment it is fetched, so an interrupted crawl keeps what it got. Files are written to a
temporary name and renamed into place; archived versions are named by content hash, so no write can overwrite
different content. A visit that finds the same content writes nothing but counters. A meaningful change moves the previous files into
`versions/` and writes the new ones, with a note of what changed. Page state lives in MongoDB (`sites`, `pages`,
`page_versions`, `generated_files`); without MongoDB it lives in `state.json` beside the pages.
"""

from __future__ import annotations

import gzip
import hashlib
import json
import os
import queue
import threading
from collections.abc import Callable
from datetime import UTC, datetime
from pathlib import Path

from pydantic import BaseModel, ConfigDict

from mzizi_engine.activity import Activity
from mzizi_engine.layout import SiteFolder
from mzizi_scraping.change import Change, Fingerprint, compare, fingerprint

GENERATOR = "mzizi-engine site store 1"
VOLATILE_AFTER = 2  # a block that differed on this many visits in a row is treated as changing by itself
VISITED_EVERY = 25  # rewrite visited.txt this often while pages arrive
GONE_AFTER = 3  # misses in a complete crawl before a page is marked gone
STATE_FILE = "state.json"


class PageState(BaseModel):
    model_config = ConfigDict(frozen=True, extra="ignore")

    host: str
    path: str
    url: str
    status: int
    version: int = 1
    first_seen: str
    last_seen: str
    last_changed: str
    visits: int = 1
    raw_changes: int = 0  # bytes differed, nothing meaningful did
    fingerprint: Fingerprint
    flux: dict[str, int] = {}
    etag: str = ""
    last_modified: str = ""
    title: str = ""
    html_file: str = ""
    md_file: str = ""
    png_file: str = ""
    visual_hash: str = ""
    misses: int = 0
    gone: bool = False

    @property
    def volatile(self) -> frozenset[str]:
        return frozenset(name for name, count in self.flux.items() if count >= VOLATILE_AFTER)


class Visit(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    url: str
    final_url: str
    path: str
    query: str = ""
    status: int
    title: str = ""
    html: bytes
    markdown_body: str = ""
    screenshot: bytes | None = None
    etag: str = ""
    last_modified: str = ""
    slug: str


class Outcome(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    path: str
    result: str  # new | changed | unchanged | noise
    version: int
    change: Change | None = None


def _now() -> str:
    return datetime.now(UTC).isoformat(timespec="seconds")


def _sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def atomic_write(path: Path, data: bytes) -> None:
    """Write beside the target, then rename: a reader or a crash never sees half a file."""
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.tmp")
    temporary.write_bytes(data)
    os.replace(temporary, path)


def _visual_hash(png: bytes | None) -> str:
    """A small perceptual hash (8x8 difference hash) of a screenshot; empty when imaging is unavailable."""
    if not png:
        return ""
    try:
        import io

        from PIL import Image
    except ImportError:
        return ""
    image = Image.open(io.BytesIO(png)).convert("L").resize((9, 8))
    pixels = list(image.getdata())
    bits = "".join("1" if pixels[r * 9 + c] > pixels[r * 9 + c + 1] else "0" for r in range(8) for c in range(8))
    return f"{int(bits, 2):016x}"


def front_matter(visit: Visit, state: PageState, html_rel: str, text_sha: str) -> str:
    title = json.dumps(state.title or visit.title, ensure_ascii=False)
    return (
        "---\n"
        f"source_url: {visit.url}\n"
        f"final_url: {visit.final_url}\n"
        f"path: {visit.path}\n"
        f"title: {title}\n"
        f"html_file: {html_rel}\n"
        f"html_sha256: {state.fingerprint.raw}\n"
        f"text_sha256: {text_sha}\n"
        f"fetched_at: {state.last_seen}\n"
        f"version: {state.version}\n"
        f"generator: {GENERATOR}\n"
        "---\n\n"
    )


def _change_note(old: PageState, new: PageState, change: Change) -> str:
    lines = [f"# {new.path}: version {old.version} to {new.version}", "", f"- detected: {new.last_seen}"]
    for label, items in (
        ("blocks changed", change.changed_blocks),
        ("blocks added", change.added_blocks),
        ("blocks removed", change.removed_blocks),
        ("links added", change.links_added),
        ("links removed", change.links_removed),
        ("volatile blocks ignored", change.ignored_volatile),
    ):
        if items:
            lines.append(f"- {label}: " + "; ".join(items[:20]) + (" …" if len(items) > 20 else ""))
    return "\n".join(lines) + "\n"


class SiteStore:
    def __init__(self, site: SiteFolder, activity: Activity | None, root: Path) -> None:
        self.site, self.activity, self.root = site, activity, root
        self.host = site.address.host
        self.states: dict[str, PageState] = self._load()
        self.seen: set[str] = set()
        self._pending: list[PageState] = []
        self.recorded = 0

    # -- state ---------------------------------------------------------------------------------------------------
    def _key(self, path: str) -> str:
        return f"{self.host}{path}"

    def _load(self) -> dict[str, PageState]:
        if self.activity is not None:
            rows = self.activity.get("pages", {"host": self.host})
            return {r["path"]: PageState.model_validate(r, strict=False) for r in rows}
        file = self.site.root / STATE_FILE
        if not file.is_file():
            return {}
        return {p: PageState.model_validate(s, strict=False) for p, s in json.loads(file.read_text(encoding="utf-8")).items()}

    def _save(self, states: list[PageState]) -> None:
        if self.activity is not None:
            self.activity.put("pages", [{"_id": self._key(s.path), **s.model_dump(mode="json")} for s in states])
            return
        merged = {p: s.model_dump(mode="json") for p, s in self.states.items()}
        atomic_write(self.site.root / STATE_FILE, json.dumps(merged).encode("utf-8"))

    def _rel(self, path: Path) -> str:
        return str(path.relative_to(self.root))

    # -- visits --------------------------------------------------------------------------------------------------
    def record(self, visit: Visit) -> Outcome:
        now = _now()
        self.seen.add(visit.path)
        print_ = fingerprint(visit.html, visit.final_url)
        visual = _visual_hash(visit.screenshot)
        previous = self.states.get(visit.path)
        if previous is not None and not (self.root / previous.html_file).is_file():
            previous = None  # the saved file was deleted behind our back: treat the page as new, not unchanged
        folder = self.site.page(visit.path)
        stem = visit.slug
        if previous is None or previous.gone:
            state = self._new_state(visit, print_, visual, folder, stem, now, previous)
            self._write_current(visit, state, folder, stem)
            result = Outcome(path=visit.path, result="new", version=state.version)
        else:
            change = compare(previous.fingerprint, print_, previous.volatile)
            flux = {
                name: (previous.flux.get(name, 0) + 1 if previous.fingerprint.blocks.get(name) != sha else 0)
                for name, sha in print_.blocks.items()
                if name in previous.fingerprint.blocks
            }
            if change.meaningful:
                state = self._new_state(visit, print_, visual, folder, stem, now, previous, version=previous.version + 1)
                state = state.model_copy(update={"flux": flux, "visits": previous.visits + 1, "first_seen": previous.first_seen})
                self._archive(previous, folder, stem, change, state)
                self._write_current(visit, state, folder, stem)
                result = Outcome(path=visit.path, result="changed", version=state.version, change=change)
            else:
                state = previous.model_copy(
                    update={
                        "last_seen": now,
                        "visits": previous.visits + 1,
                        "status": visit.status,
                        "flux": flux,
                        "raw_changes": previous.raw_changes + int(change.raw_only),
                        "etag": visit.etag or previous.etag,
                        "last_modified": visit.last_modified or previous.last_modified,
                        "visual_hash": visual or previous.visual_hash,
                        "misses": 0,
                        "gone": False,
                    }
                )
                if visit.screenshot and not previous.png_file:  # the first screenshot of an already-known page
                    png = folder / f"{stem}.png"
                    atomic_write(png, visit.screenshot)
                    state = state.model_copy(update={"png_file": self._rel(png)})
                    if self.activity is not None:
                        self.activity.put("generated_files", [self._generated(png, "screenshot", state.html_file, state.fingerprint.raw)])
                result = Outcome(path=visit.path, result="noise" if change.raw_only else "unchanged", version=state.version)
        self.states[visit.path] = state
        self._save([state])  # the files are in place; now the state that describes them
        self.recorded += 1
        if self.recorded % VISITED_EVERY == 0:
            self.write_visited()
        return result

    def _new_state(
        self,
        visit: Visit,
        print_: Fingerprint,
        visual: str,
        folder: Path,
        stem: str,
        now: str,
        previous: PageState | None,
        version: int = 1,
    ) -> PageState:
        return PageState(
            host=self.host,
            path=visit.path,
            url=visit.final_url,
            status=visit.status,
            version=version,
            first_seen=previous.first_seen if previous else now,
            last_seen=now,
            last_changed=now,
            visits=(previous.visits + 1) if previous else 1,
            fingerprint=print_,
            etag=visit.etag,
            last_modified=visit.last_modified,
            title=visit.title,
            html_file=self._rel(folder / f"{stem}.html"),
            md_file=self._rel(folder / f"{stem}.md"),
            png_file=self._rel(folder / f"{stem}.png") if visit.screenshot else "",
            visual_hash=visual,
        )

    def _write_current(self, visit: Visit, state: PageState, folder: Path, stem: str) -> None:
        html_path, md_path = folder / f"{stem}.html", folder / f"{stem}.md"
        atomic_write(html_path, visit.html)
        generated: list[dict[str, str]] = []
        if visit.markdown_body:
            self.write_markdown(visit, state, visit.markdown_body)
        else:  # the Markdown of the old content must not outlive it; it is rebuilt from the new HTML later
            md_path.unlink(missing_ok=True)
        if visit.screenshot:
            atomic_write(folder / f"{stem}.png", visit.screenshot)
            generated.append(self._generated(folder / f"{stem}.png", "screenshot", state.html_file, state.fingerprint.raw))
        if self.activity is not None and generated:
            self.activity.put("generated_files", generated)

    def write_markdown_for(self, path: str, body: str, raw_sha: str) -> bool:
        """Saves the Markdown of a page, unless the page has changed since the conversion was started."""
        state = self.states.get(path)
        if state is None or state.fingerprint.raw != raw_sha:
            return False
        visit = Visit(
            url=state.url, final_url=state.url, path=state.path, status=state.status, title=state.title, html=b"", slug=""
        )
        self.write_markdown(visit, state, body)
        return True

    def write_markdown(self, visit: Visit, state: PageState, body: str) -> None:
        md_path = self.root / state.md_file
        atomic_write(md_path, (front_matter(visit, state, state.html_file, state.fingerprint.text) + body).encode("utf-8"))
        if self.activity is not None:
            self.activity.put("generated_files", [self._generated(md_path, "markdown", state.html_file, state.fingerprint.raw)])

    def _generated(self, path: Path, kind: str, source: str, source_sha: str) -> dict[str, str]:
        return {
            "_id": self._rel(path),
            "path": self._rel(path),
            "kind": kind,
            "sha256": _sha(path.read_bytes()),
            "source": source,
            "source_sha256": source_sha,
            "generator": GENERATOR,
        }

    def _archive(self, old: PageState, folder: Path, stem: str, change: Change, new: PageState) -> None:
        """Moves what is on disk into `versions/`, named by its own content hash, so it can never overwrite anything."""
        versions = folder / "versions"
        versions.mkdir(parents=True, exist_ok=True)
        html = folder / f"{stem}.html"
        tag = f"v{old.version}"
        if html.is_file():
            data = html.read_bytes()
            target = versions / f"{stem}.{tag}-{_sha(data)[:8]}.html.gz"
            if not target.exists():
                atomic_write(target, gzip.compress(data))
        for suffix in ("md", "png"):
            current = folder / f"{stem}.{suffix}"
            if current.is_file():
                data = current.read_bytes()
                target = versions / f"{stem}.{tag}-{_sha(data)[:8]}.{suffix}"
                if not target.exists():
                    atomic_write(target, data)
        note = versions / f"{stem}.{tag}-to-v{new.version}.change.md"
        atomic_write(note, _change_note(old, new, change).encode("utf-8"))
        if self.activity is not None:
            self.activity.put(
                "page_versions",
                [
                    {
                        "_id": f"{self._key(old.path)}#{old.version}",
                        "host": self.host,
                        "path": old.path,
                        "version": old.version,
                        "superseded_at": new.last_seen,
                        "fingerprint": old.fingerprint.model_dump(mode="json"),
                        "change_to_next": change.model_dump(mode="json"),
                        "note": self._rel(note),
                    }
                ],
            )

    def record_cached(self, path: str) -> Outcome:
        """A page served from what is saved (still fresh): nothing is written and its counters are not touched."""
        self.seen.add(path)
        for key in self.states:  # its further pages (`#page-N`) were walked when it was fetched: they are not missing
            if key.startswith(f"{path}#"):
                self.seen.add(key)
        state = self.states.get(path)
        return Outcome(path=path, result="fresh", version=state.version if state else 0)

    def is_fresh(self, path: str, max_age_hours: float) -> PageState | None:
        """The saved state of a page fetched less than `max_age_hours` ago whose file is still on disk."""
        state = self.states.get(path)
        if state is None or state.gone or max_age_hours <= 0 or not (self.root / state.html_file).is_file():
            return None
        age = (datetime.now(UTC) - datetime.fromisoformat(state.last_seen)).total_seconds() / 3600
        return state if age < max_age_hours else None

    # -- end of a visit session ------------------------------------------------------------------------------------
    def finish(self, complete: bool) -> dict[str, int]:
        """Counts misses for known pages not seen (only after a complete crawl), saves state, rewrites visited.txt."""
        gone = 0
        if complete:
            for path, state in list(self.states.items()):
                if path in self.seen or state.gone:
                    continue
                misses = state.misses + 1
                updated = state.model_copy(update={"misses": misses, "gone": misses >= GONE_AFTER})
                gone += int(updated.gone)
                self.states[path] = updated
                self._pending.append(updated)
        self._save(self._pending)
        if self.activity is not None:
            self.activity.put(
                "sites",
                [
                    {
                        "_id": self.host,
                        "host": self.host,
                        "folder": self._rel(self.site.root),
                        "group": list(self.site.address.group),
                        "last_visit": _now(),
                        "pages": len(self.states),
                    }
                ],
            )
        self.write_visited()
        return {"pages": len(self.states), "gone": gone}

    def write_visited(self) -> None:
        lines = ["# path | status | last_visited | last_changed | version | text_hash | volatile"]
        for path in sorted(self.states):
            s = self.states[path]
            status = "gone" if s.gone else str(s.status)
            lines.append(
                f"{path} | {status} | {s.last_seen[:10]} | {s.last_changed[:10]} | {s.version} | "
                f"{s.fingerprint.text[:8]} | {','.join(sorted(s.volatile))}"
            )
        atomic_write(self.site.visited_file, ("\n".join(lines) + "\n").encode("utf-8"))


class SiteWriter:
    """Saves pages on a worker thread while the crawler keeps fetching: IO overlaps fetching, a bounded queue stops the
    crawler running far ahead of the disk, and one worker keeps every page's state consistent."""

    _STOP = object()

    def __init__(self, store: SiteStore, depth: int = 64, on_saved: Callable[[Outcome, Visit], None] | None = None) -> None:
        self.store = store
        self.on_saved = on_saved
        self.outcomes: list[Outcome] = []
        self._queue: queue.Queue[object] = queue.Queue(maxsize=depth)
        self._error: BaseException | None = None
        self._thread = threading.Thread(target=self._work, name="site-writer", daemon=True)
        self._thread.start()

    def submit_cached(self, path: str) -> None:
        self._queue.put(path)

    def submit(self, visit: Visit) -> None:
        if self._error is not None:
            raise self._error
        self._queue.put(visit)  # blocks while the queue is full

    def _work(self) -> None:
        while True:
            item = self._queue.get()
            if item is self._STOP:
                return
            try:
                if self._error is None and isinstance(item, Visit):
                    outcome = self.store.record(item)
                    self.outcomes.append(outcome)
                    if self.on_saved is not None:
                        self.on_saved(outcome, item)
                elif self._error is None and isinstance(item, str):
                    self.outcomes.append(self.store.record_cached(item))
            except BaseException as problem:  # reported to the caller at close; later pages are dropped, not half-saved
                self._error = problem

    def close(self) -> list[Outcome]:
        """Waits for every queued page to be saved; raises the first error the worker hit."""
        self._queue.put(self._STOP)
        self._thread.join()
        if self._error is not None:
            raise self._error
        return self.outcomes
