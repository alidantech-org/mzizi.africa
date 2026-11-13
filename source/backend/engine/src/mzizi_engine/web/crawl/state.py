"""Crawl state: everything needed to resume, saved as JSON next to the results."""

from __future__ import annotations

import hashlib
from pathlib import Path

from mzizi_engine.web.records import (
    ErrorRecord,
    FrontierItem,
    LinkRecord,
    PageRecord,
    Record,
    ResourceRecord,
)
from mzizi_engine.web.requests import CrawlRequest
from mzizi_fetch.web.blocks import BlockDecision
from mzizi_fetch.web.policy import Decision

STATE_FILE = "state.json"


class CrawlState(Record):
    digest: str
    complete: bool
    frontier: tuple[FrontierItem, ...]
    seen: tuple[str, ...]
    pages: tuple[PageRecord, ...]
    links: tuple[LinkRecord, ...]
    resources: tuple[ResourceRecord, ...]
    errors: tuple[ErrorRecord, ...]
    decisions: tuple[BlockDecision, ...]
    policy_audit: tuple[Decision, ...]


def digest_of(request: CrawlRequest) -> str:
    """Identifies a crawl by what defines its scope, so a resume cannot mix two different crawls."""
    scope = request.model_copy(update={"max_pages": 0, "resume": False, "out_dir": "", "headed": False, "formats": ()})
    return hashlib.sha256(scope.model_dump_json().encode()).hexdigest()[:16]


def load_state(folder: Path, digest: str) -> CrawlState | None:
    path = folder / STATE_FILE
    if not path.exists():
        return None
    state = CrawlState.model_validate_json(path.read_text(encoding="utf-8"))
    return state if state.digest == digest else None


def save_state(folder: Path, state: CrawlState) -> None:
    folder.mkdir(parents=True, exist_ok=True)
    (folder / STATE_FILE).write_text(state.model_dump_json(), encoding="utf-8")
