"""Crawl state: everything needed to resume, saved as JSON next to the results."""

from __future__ import annotations

import hashlib
from pathlib import Path

from mzizi_browser.shared.media import MediaInventory
from mzizi_browser.shared.traversal import ListingReport
from mzizi_crawler.shared.records import (
    ErrorRecord,
    FrontierItem,
    LinkRecord,
    PageRecord,
    Record,
    ResourceRecord,
)
from mzizi_crawler.shared.requests import CrawlRequest
from mzizi_crawler.shared.sitestore import atomic_write
from mzizi_fetch.web.blocks import BlockDecision, BlockKind
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
    listings: tuple[ListingReport, ...] = ()
    rendered_media: tuple[MediaInventory, ...] = ()
    deferred: tuple[FrontierItem, ...] = ()
    request: CrawlRequest | None = None


def digest_of(request: CrawlRequest) -> str:
    """Identifies a crawl by what defines its scope, so a resume cannot mix two different crawls."""
    scope = request.model_copy(
        update={"max_pages": 0, "resume": False, "resume_from": "", "out_dir": "", "headed": False, "formats": ()}
    )
    excluded = {"adapter"} if scope.adapter == "playwright" else set()
    for field in ("rendered_media", "references_only", "item_selector", "listing_selector"):
        if not getattr(scope, field):
            excluded.add(field)
    return hashlib.sha256(scope.model_dump_json(exclude=excluded).encode()).hexdigest()[:16]


def _legacy_deferred(state: CrawlState) -> CrawlState:
    if "deferred" in state.model_fields_set:
        return state
    saved = {page.original_url for page in state.pages} | {page.final_url for page in state.pages}
    queued = {item.url for item in state.frontier}
    pending: dict[str, FrontierItem] = {}
    for error in state.errors:
        transient = error.stage == "transport" or error.kind in {
            BlockKind.TIMEOUT.value,
            BlockKind.SERVER_ERROR.value,
            BlockKind.RATE_LIMITED.value,
        }
        if not transient or error.url in saved or error.url in queued:
            continue
        link = next((link for link in state.links if link.original_url == error.url), None)
        pending[error.url] = FrontierItem(
            url=error.url,
            depth=link.depth if link else 0,
            source_page=link.source_page if link else "",
            anchor_text=link.anchor_text if link else "",
            nearby_heading=link.nearby_heading if link else "",
        )
    return state.model_copy(
        update={
            "deferred": tuple(pending.values()),
            "complete": state.complete and not pending,
        }
    )


def load_state(folder: Path, digest: str) -> CrawlState | None:
    path = folder / STATE_FILE
    if not path.exists():
        return None
    state = CrawlState.model_validate_json(path.read_text(encoding="utf-8"))
    if state.digest != digest:
        raise ValueError("resume scope differs from the saved crawl; use its original request configuration")
    return _legacy_deferred(state)


def save_state(folder: Path, state: CrawlState) -> None:
    folder.mkdir(parents=True, exist_ok=True)
    atomic_write(folder / STATE_FILE, state.model_dump_json().encode("utf-8"))
