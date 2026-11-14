"""One site's saved pages: hashed, versioned only when something meaningful changes, tracked in MongoDB.

A visit that finds the same content writes nothing but counters. A meaningful change moves the previous files into
`versions/` and writes the new ones, with a note of what changed. Page state lives in MongoDB (`sites`, `pages`,
`page_versions`, `generated_files`); without MongoDB it lives in `state.json` beside the pages.
"""

from __future__ import annotations

import gzip
import hashlib
import json
import shutil
from datetime import UTC, datetime
from pathlib import Path

from pydantic import BaseModel, ConfigDict

from mzizi_engine.activity import Activity
from mzizi_engine.layout import SiteFolder
from mzizi_scraping.change import Change, Fingerprint, compare, fingerprint

GENERATOR = "mzizi-engine site store 1"
VOLATILE_AFTER = 2  # a block that differed on this many visits in a row is treated as changing by itself
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
        self.site.root.mkdir(parents=True, exist_ok=True)
        merged = {**{p: s.model_dump(mode="json") for p, s in self.states.items()}}
        (self.site.root / STATE_FILE).write_text(json.dumps(merged, indent=1), encoding="utf-8")

    def _rel(self, path: Path) -> str:
        return str(path.relative_to(self.root))

    # -- visits --------------------------------------------------------------------------------------------------
    def record(self, visit: Visit) -> Outcome:
        now = _now()
        self.seen.add(visit.path)
        print_ = fingerprint(visit.html, visit.final_url)
        visual = _visual_hash(visit.screenshot)
        previous = self.states.get(visit.path)
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
                    folder.mkdir(parents=True, exist_ok=True)
                    png.write_bytes(visit.screenshot)
                    state = state.model_copy(update={"png_file": self._rel(png)})
                    if self.activity is not None:
                        self.activity.put("generated_files", [self._generated(png, "screenshot", state.html_file, state.fingerprint.raw)])
                result = Outcome(path=visit.path, result="noise" if change.raw_only else "unchanged", version=state.version)
        self.states[visit.path] = state
        self._pending.append(state)
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
        folder.mkdir(parents=True, exist_ok=True)
        html_path, md_path = folder / f"{stem}.html", folder / f"{stem}.md"
        html_path.write_bytes(visit.html)
        md_path.write_text(
            front_matter(visit, state, state.html_file, state.fingerprint.text) + visit.markdown_body, encoding="utf-8"
        )
        generated = [self._generated(md_path, "markdown", state.html_file, state.fingerprint.raw)]
        if visit.screenshot:
            (folder / f"{stem}.png").write_bytes(visit.screenshot)
            generated.append(self._generated(folder / f"{stem}.png", "screenshot", state.html_file, state.fingerprint.raw))
        if self.activity is not None:
            self.activity.put("generated_files", generated)

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
        versions = folder / "versions"
        versions.mkdir(parents=True, exist_ok=True)
        tag = f"v{old.version}"
        html = folder / f"{stem}.html"
        if html.is_file():
            with gzip.open(versions / f"{stem}.{tag}.html.gz", "wb") as out:
                out.write(html.read_bytes())
        for suffix in ("md", "png"):
            current = folder / f"{stem}.{suffix}"
            if current.is_file():
                shutil.move(str(current), versions / f"{stem}.{tag}.{suffix}")
        note = versions / f"{stem}.{tag}-to-v{new.version}.change.md"
        note.write_text(_change_note(old, new, change), encoding="utf-8")
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
        self._write_visited()
        return {"pages": len(self.states), "gone": gone}

    def _write_visited(self) -> None:
        self.site.root.mkdir(parents=True, exist_ok=True)
        lines = ["# path | status | last_visited | last_changed | version | text_hash | volatile"]
        for path in sorted(self.states):
            s = self.states[path]
            status = "gone" if s.gone else str(s.status)
            lines.append(
                f"{path} | {status} | {s.last_seen[:10]} | {s.last_changed[:10]} | {s.version} | "
                f"{s.fingerprint.text[:8]} | {','.join(sorted(s.volatile))}"
            )
        (self.site.visited_file).write_text("\n".join(lines) + "\n", encoding="utf-8")
