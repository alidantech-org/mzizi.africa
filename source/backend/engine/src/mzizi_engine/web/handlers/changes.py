"""Change detection between two crawls of the same site: what appeared, vanished or changed."""

from __future__ import annotations

import hashlib
from pathlib import Path

from pydantic import BaseModel

from mzizi_engine.web.export import read_csv
from mzizi_engine.web.requests import DiffRequest


class PageChange(BaseModel):
    url: str
    before_sha256: str = ""
    after_sha256: str = ""


class DiffResult(BaseModel):
    baseline: str
    current: str
    added: tuple[PageChange, ...] = ()
    removed: tuple[PageChange, ...] = ()
    changed: tuple[PageChange, ...] = ()
    unchanged: int = 0


class _Row(BaseModel):
    normalized_url: str
    raw_file: str


def _hashes(folder: Path) -> dict[str, str]:
    rows = read_csv(folder / "pages.csv")
    found: dict[str, str] = {}
    for item in rows:
        row = _Row.model_validate(item, strict=False)
        raw = folder / row.raw_file
        if raw.is_file():
            found[row.normalized_url] = hashlib.sha256(raw.read_bytes()).hexdigest()
    return found


def diff_crawls(request: DiffRequest) -> DiffResult:
    before, after = _hashes(Path(request.baseline)), _hashes(Path(request.current))
    return DiffResult(
        baseline=request.baseline,
        current=request.current,
        added=tuple(PageChange(url=u, after_sha256=after[u]) for u in sorted(after.keys() - before.keys())),
        removed=tuple(PageChange(url=u, before_sha256=before[u]) for u in sorted(before.keys() - after.keys())),
        changed=tuple(
            PageChange(url=u, before_sha256=before[u], after_sha256=after[u])
            for u in sorted(before.keys() & after.keys())
            if before[u] != after[u]
        ),
        unchanged=sum(1 for u in before.keys() & after.keys() if before[u] == after[u]),
    )
