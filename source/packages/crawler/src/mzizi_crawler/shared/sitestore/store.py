"""The site store: one site's pages, hashed and versioned, state in the activity store or `state.json`."""

from __future__ import annotations

import gzip
import json
from datetime import UTC, datetime
from pathlib import Path

from mzizi_crawler.shared.activity import Activity, Document
from mzizi_crawler.shared.layout import SiteFolder
from mzizi_crawler.shared.scraping import Change, Fingerprint, compare, fingerprint
from mzizi_crawler.shared.sitestore.files import atomic_write, change_note, front_matter, sha, timestamp, visual_hash
from mzizi_crawler.shared.sitestore.models import (
    GENERATOR,
    GONE_AFTER,
    STATE_FILE,
    VISITED_EVERY,
    Outcome,
    PageState,
    Visit,
)
from mzizi_extraction import format_markdown


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
            return {str(r["path"]): PageState.model_validate(r, strict=False) for r in rows}
        file = self.site.root / STATE_FILE
        if not file.is_file():
            return {}
        return {
            p: PageState.model_validate(s, strict=False)
            for p, s in json.loads(file.read_text(encoding="utf-8")).items()
        }

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
        now = timestamp()
        self.seen.add(visit.path)
        print_ = fingerprint(visit.html, visit.final_url)
        visual = visual_hash(visit.screenshot)
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
                state = self._new_state(
                    visit, print_, visual, folder, stem, now, previous, version=previous.version + 1
                )
                state = state.model_copy(
                    update={"flux": flux, "visits": previous.visits + 1, "first_seen": previous.first_seen}
                )
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
                        self.activity.put(
                            "generated_files",
                            [self._generated(png, "screenshot", state.html_file, state.fingerprint.raw)],
                        )
                result = Outcome(
                    path=visit.path, result="noise" if change.raw_only else "unchanged", version=state.version
                )
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
        generated: list[Document] = []
        if visit.markdown_body:
            self.write_markdown(visit, state, visit.markdown_body)
        else:  # the Markdown of the old content must not outlive it; it is rebuilt from the new HTML later
            md_path.unlink(missing_ok=True)
        if visit.screenshot:
            atomic_write(folder / f"{stem}.png", visit.screenshot)
            generated.append(
                self._generated(folder / f"{stem}.png", "screenshot", state.html_file, state.fingerprint.raw)
            )
        if self.activity is not None and generated:
            self.activity.put("generated_files", generated)

    def write_markdown_for(self, path: str, body: str, raw_sha: str) -> bool:
        """Saves the Markdown of a page, unless the page has changed since the conversion was started."""
        state = self.states.get(path)
        if state is None or state.fingerprint.raw != raw_sha:
            return False
        visit = Visit(
            url=state.url,
            final_url=state.url,
            path=state.path,
            status=state.status,
            title=state.title,
            html=b"",
            slug="",
        )
        self.write_markdown(visit, state, body)
        return True

    def write_markdown(self, visit: Visit, state: PageState, body: str) -> None:
        md_path = self.root / state.md_file
        atomic_write(
            md_path,
            (front_matter(visit, state, state.html_file, state.fingerprint.text) + format_markdown(body)).encode(
                "utf-8"
            ),
        )
        if self.activity is not None:
            self.activity.put(
                "generated_files", [self._generated(md_path, "markdown", state.html_file, state.fingerprint.raw)]
            )

    def _generated(self, path: Path, kind: str, source: str, source_sha: str) -> Document:
        return {
            "_id": self._rel(path),
            "path": self._rel(path),
            "kind": kind,
            "sha256": sha(path.read_bytes()),
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
            target = versions / f"{stem}.{tag}-{sha(data)[:8]}.html.gz"
            if not target.exists():
                atomic_write(target, gzip.compress(data))
        for suffix in ("md", "png"):
            current = folder / f"{stem}.{suffix}"
            if current.is_file():
                data = current.read_bytes()
                target = versions / f"{stem}.{tag}-{sha(data)[:8]}.{suffix}"
                if not target.exists():
                    atomic_write(target, data)
        note = versions / f"{stem}.{tag}-to-v{new.version}.change.md"
        atomic_write(note, change_note(old, new, change).encode("utf-8"))
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
                        "last_visit": timestamp(),
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
