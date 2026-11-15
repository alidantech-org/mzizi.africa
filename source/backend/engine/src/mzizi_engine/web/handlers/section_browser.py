"""Bounded, same-document browser traversal for tabs, disclosures and listing controls."""

from __future__ import annotations

from dataclasses import dataclass
from enum import StrEnum
from time import monotonic, sleep
from urllib.parse import urldefrag

from mzizi_engine.web.browser.adapter import BrowserSession
from mzizi_engine.web.browser.challenge import detect_challenge
from mzizi_engine.web.browser.media import MediaInventory, RenderedMediaSession
from mzizi_engine.web.browser.traversal import READ_ONLY_CONTROL
from mzizi_scraping.pagination.models import Control
from mzizi_scraping.pagination.panels import PanelControl, PanelView, read_panel

OBSERVE_SECONDS = 6
POLL_INTERVAL_SECONDS = 0.25


class StopReason(StrEnum):
    STATIC = "captured_from_initial_html"
    NO_NEXT = "no_next_control"
    DISABLED = "continuation_disabled"
    NEEDS_BROWSER = "browser_required"
    MISSING = "panel_missing_or_empty"
    AMBIGUOUS = "ambiguous_control"
    LINK = "follow_url_with_scoped_crawl"
    SCROLL = "scroll_navigation_needs_configuration"
    NUMBERED = "numbered_navigation_without_next"
    REPEATED = "repeated_content"
    TIMEOUT = "no_content_change_before_timeout"
    LIMIT = "view_limit_reached"
    TIME_BUDGET = "browser_time_budget_reached"
    CLICK_FAILED = "click_failed"
    LEFT_DOCUMENT = "left_initial_document"
    BLOCKED = "access_challenge"
    UNEXPECTED_DOWNLOAD = "unexpected_browser_download"
    BROWSER_UNAVAILABLE = "browser_unavailable"
    MEDIA_UNAVAILABLE = "rendered_media_unavailable"
    COVERAGE_MISMATCH = "browser_missing_initial_items"

    @property
    def complete(self) -> bool:
        return self in (self.STATIC, self.NO_NEXT, self.DISABLED)


@dataclass(frozen=True)
class WalkResult:
    views: tuple[PanelView, ...]
    reason: StopReason
    continuation: str = ""
    error: str = ""
    media: tuple[MediaInventory | None, ...] = ()


def listing_continuation(view: PanelView) -> tuple[Control | None, StopReason]:
    found = view.pagination
    controls = (found.load_more, found.next)
    for control in controls:
        if control is None or not control.enabled:
            continue
        if control.url:
            return control, StopReason.LINK
        return control, StopReason.NEEDS_BROWSER
    if found.infinite_scroll:
        return None, StopReason.SCROLL
    if any(controls):
        return None, StopReason.DISABLED
    if any(control.enabled for control in found.numbered):
        return None, StopReason.NUMBERED
    return None, StopReason.NO_NEXT


class PanelWalker:
    def __init__(self, session: BrowserSession, url: str, deadline: float, include_media: bool = False) -> None:
        self.session = session
        self.url = urldefrag(url).url
        self.deadline = deadline
        self.include_media = include_media
        self.downloads = session.page_state().downloads

    def _observe(self, control: PanelControl) -> tuple[PanelView | None, StopReason | None]:
        try:
            page = self.session.page_state()
        except Exception:
            return None, StopReason.BROWSER_UNAVAILABLE
        if urldefrag(page.final_url).url != self.url:
            return None, StopReason.LEFT_DOCUMENT
        if page.downloads != self.downloads:
            return None, StopReason.UNEXPECTED_DOWNLOAD
        if detect_challenge(page) is not None:
            return None, StopReason.BLOCKED
        return read_panel(page.html, control, self.url), None

    def _after_click(
        self, control: PanelControl, selector: str, previous: PanelView | None
    ) -> tuple[PanelView | None, StopReason | None]:
        if monotonic() >= self.deadline:
            return None, StopReason.TIME_BUDGET
        try:
            self.session.click(selector)
        except Exception:
            return None, StopReason.CLICK_FAILED
        until = min(self.deadline, monotonic() + OBSERVE_SECONDS)
        while monotonic() < until:
            view, failure = self._observe(control)
            if failure is not None:
                return None, failure
            if view and view.readable and view.active and (previous is None or view.signature != previous.signature):
                return view, None
            sleep(POLL_INTERVAL_SECONDS)
        return None, StopReason.TIME_BUDGET if monotonic() >= self.deadline else StopReason.TIMEOUT

    def media_for(self, control: PanelControl) -> MediaInventory | None:
        if self.include_media and isinstance(self.session, RenderedMediaSession):
            try:
                capture = self.session.capture_media(control.panel_selector)
            except Exception:
                return None
            if urldefrag(capture.inventory.source_url).url == self.url:
                return capture.inventory
        return None

    def walk(self, control: PanelControl, max_views: int) -> WalkResult:
        view, failure = self._observe(control)
        if failure is not None:
            return WalkResult((), failure)
        if view is None or not view.active or not view.readable:
            if not control.selector:
                return WalkResult((), StopReason.AMBIGUOUS if control.target else StopReason.MISSING)
            view, failure = self._after_click(control, control.selector + READ_ONLY_CONTROL, None)
            if view is None:
                return WalkResult((), failure or StopReason.MISSING)
        views = [view]
        media = [self.media_for(control)]
        seen = {view.signature}
        while True:
            next_control, reason = listing_continuation(view)
            if reason is not StopReason.NEEDS_BROWSER or next_control is None:
                return WalkResult(tuple(views), reason, next_control.url if next_control else "", media=tuple(media))
            if len(views) >= max_views:
                return WalkResult(tuple(views), StopReason.LIMIT, media=tuple(media))
            selector = f"{control.panel_selector} >> {next_control.selector}{READ_ONLY_CONTROL}"
            changed, failure = self._after_click(control, selector, view)
            if changed is None:
                return WalkResult(tuple(views), failure or StopReason.TIMEOUT, media=tuple(media))
            if changed.signature in seen:
                return WalkResult(tuple(views), StopReason.REPEATED, media=tuple(media))
            seen.add(changed.signature)
            views.append(changed)
            media.append(self.media_for(control))
            view = changed
