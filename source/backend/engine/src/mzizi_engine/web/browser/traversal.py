"""Evidence from bounded browser traversal and ordinary link continuations."""

from __future__ import annotations

from enum import StrEnum
from hashlib import sha256
from time import monotonic, sleep
from urllib.parse import urldefrag

from bs4 import BeautifulSoup

from mzizi_engine.web.browser.adapter import BrowserSession
from mzizi_engine.web.browser.challenge import detect_challenge
from mzizi_engine.web.browser.media import MediaInventory, RenderedMediaSession
from mzizi_engine.web.browser.models import Frozen, RenderedPage
from mzizi_scraping.pagination import detect_pagination
from mzizi_scraping.pagination.models import Control
from mzizi_scraping.pagination.panels import PanelControl, read_panel

READ_ONLY_CONTROL = (
    ':not([download]):not([type="submit"]):not([form]):not(form button:not([type="button"]))'
    ':not(a[href]:not([href^="#"]))'
)
DEFAULT_LISTING_SECONDS = 90
OBSERVE_DELAY = 0.25
CHANGE_WAIT_SECONDS = 3


class End(StrEnum):
    NO_NEXT = "no_next_control"
    DISABLED = "continuation_disabled"
    NUMBERED_END = "last_advertised_numbered_page"
    LINK = "follow_url_with_scoped_crawl"
    AMBIGUOUS = "ambiguous_control"
    SCROLL = "scroll_available"
    REPEATED = "repeated_content"
    TIMEOUT = "no_content_change_before_timeout"
    CAP = "view_limit_reached"
    TIME_BUDGET = "browser_time_budget_reached"
    CLICK_FAILED = "click_failed"
    LEFT_DOCUMENT = "left_initial_document"
    BLOCKED = "access_challenge"
    DOWNLOAD = "unexpected_browser_download"
    SCROLL_STABLE = "scroll_stabilized_without_terminal_control"
    DISABLED_BY_REQUEST = "traversal_disabled"
    BROWSER_REQUIRED = "browser_required"
    BROWSER_UNAVAILABLE = "browser_unavailable"


class Action(StrEnum):
    INITIAL = "initial"
    NEXT = "next"
    LOAD_MORE = "load_more"
    SCROLL = "scroll"


class ListingView(Frozen):
    url: str
    action: Action
    sha256: str
    signature: str
    table_rows: int
    list_items: int
    new_table_rows: int
    new_list_items: int
    row_hashes: tuple[str, ...] = ()
    item_hashes: tuple[str, ...] = ()


class ListingReport(Frozen):
    source_url: str
    stop_reason: End
    continuation_url: str = ""
    continuation_captured: bool | None = None
    views: tuple[ListingView, ...]


class BrowserWalk(Frozen):
    pages: tuple[RenderedPage, ...]
    report: ListingReport
    media: tuple[MediaInventory, ...] = ()


def _read(page: RenderedPage, scope: str, items: str) -> tuple[ListingView, frozenset[str], frozenset[str]]:
    panel = read_panel(
        page.html,
        PanelControl(target="", label="", kind="listing", selector="", scope=scope, items=items),
        page.final_url,
    )
    digest = sha256(page.html.encode()).hexdigest()
    rows = frozenset(panel.table_rows if panel else ())
    listing_items = frozenset(panel.list_items if panel else ())
    view = ListingView(
        url=page.final_url,
        action=Action.INITIAL,
        sha256=digest,
        signature=panel.signature if panel else digest,
        table_rows=len(panel.table_rows) if panel else 0,
        list_items=len(panel.list_items) if panel else 0,
        new_table_rows=len(rows),
        new_list_items=len(listing_items),
        row_hashes=tuple(sorted(rows)),
        item_hashes=tuple(sorted(listing_items)),
    )
    return view, rows, listing_items


def _control(page: RenderedPage, scope: str) -> tuple[Control | None, End]:
    html = page.html
    if scope:
        matches = BeautifulSoup(html, "lxml").select(scope, limit=2)
        if len(matches) != 1:
            return None, End.AMBIGUOUS
        html = str(matches[0])
    found = detect_pagination(html, page.final_url)
    controls = tuple(c for c in (found.load_more, found.next) if c is not None)
    for control in controls:
        if control.enabled:
            return control, End.LINK if control.url else End.NO_NEXT
    if found.infinite_scroll:
        return None, End.SCROLL
    if controls:
        return None, End.DISABLED
    if found.current is not None and found.current == found.last:
        return None, End.NUMBERED_END
    return None, End.AMBIGUOUS if found.numbered else End.NO_NEXT


def _advance(session: BrowserSession, control: Control | None, scope: str) -> Action:
    if control is None:
        session.scroll(to_bottom=True, until_stable=False)
        return Action.SCROLL
    selector = control.selector + READ_ONLY_CONTROL
    session.wait_for(f"{scope} >> {selector}" if scope else selector, 3_000)
    session.click(f"{scope} >> {selector}" if scope else selector)
    return Action.LOAD_MORE if control.kind.value == "load_more" else Action.NEXT


def _observe_action(
    session: BrowserSession,
    source: RenderedPage,
    previous: ListingView,
    deadline: float,
    scope: str,
    items: str,
) -> tuple[RenderedPage, End | None]:
    limit = min(deadline, monotonic() + CHANGE_WAIT_SECONDS)
    base = urldefrag(source.final_url).url
    while True:
        observed = session.page_state()
        if urldefrag(observed.final_url).url != base:
            return observed, End.LEFT_DOCUMENT
        if observed.downloads != source.downloads:
            return observed, End.DOWNLOAD
        if detect_challenge(observed):
            return observed, End.BLOCKED
        view, _, _ = _read(observed, scope, items)
        if view.signature != previous.signature or monotonic() >= limit:
            return observed, None
        sleep(OBSERVE_DELAY)


def walk_listing(
    session: BrowserSession,
    first: RenderedPage,
    max_views: int,
    *,
    include_media: bool = False,
    scope: str = "",
    items: str = "",
) -> BrowserWalk:
    base = urldefrag(first.final_url).url
    deadline = monotonic() + DEFAULT_LISTING_SECONDS
    pages = [first]
    reports: list[ListingView] = []
    media: list[MediaInventory] = []
    all_rows: set[str] = set()
    all_items: set[str] = set()
    signatures: set[str] = set()
    action = Action.INITIAL
    observed = first
    next_url = ""
    while True:
        inventory: MediaInventory | None = None
        if include_media and isinstance(session, RenderedMediaSession):
            # The inventory and saved DOM are taken in one browser evaluation.
            try:
                capture = session.capture_media(scope, scan_lazy=True)
            except Exception:
                pass  # The saved HTML still establishes listing coverage.
            else:
                if urldefrag(capture.inventory.source_url).url != base:
                    reason = End.LEFT_DOCUMENT
                    break
                observed = observed.model_copy(update={"html": capture.html})
                inventory = capture.inventory
        view, rows, listing_items = _read(observed, scope, items)
        if view.signature in signatures:
            reason = (
                End.SCROLL_STABLE
                if action is Action.SCROLL
                else End.TIMEOUT
                if reports[-1].signature == view.signature
                else End.REPEATED
            )
            break
        observed_url = first.final_url if not reports else f"{base}#page-{len(reports) + 1}"
        observed = observed.model_copy(update={"final_url": observed_url, "status": first.status})
        if reports:
            pages.append(observed)
        else:
            pages[0] = observed
        if inventory is not None:
            media.append(inventory.model_copy(update={"source_url": observed_url}))
        reports.append(
            view.model_copy(
                update={
                    "url": observed_url,
                    "action": action,
                    "new_table_rows": len(rows - all_rows),
                    "new_list_items": len(listing_items - all_items),
                }
            )
        )
        all_rows.update(rows)
        all_items.update(listing_items)
        signatures.add(view.signature)
        if max_views == 0:
            reason = End.DISABLED_BY_REQUEST
            break
        control, reason = _control(observed, scope)
        if reason is End.LINK:
            next_url = control.url if control else ""
            break
        if control is None and reason is not End.SCROLL:
            break
        if len(reports) >= max_views:
            reason = End.CAP
            break
        if monotonic() >= deadline:
            reason = End.TIME_BUDGET
            break
        try:
            action = _advance(session, control, scope)
            observed, stop = _observe_action(session, first, reports[-1], deadline, scope, items)
        except Exception:
            reason = End.CLICK_FAILED
            break
        if stop is not None:
            reason = stop
            break
    return BrowserWalk(
        pages=tuple(pages),
        media=tuple(media),
        report=ListingReport(
            source_url=first.final_url, stop_reason=reason, continuation_url=next_url, views=tuple(reports)
        ),
    )


def static_listing(url: str, html: str, *, paginate: bool, scope: str, items: str) -> ListingReport:
    page = RenderedPage(url=url, final_url=url, status=200, title="", html=html, text="", headers={})
    view, _, _ = _read(page, scope, items)
    control, reason = _control(page, scope) if paginate else (None, End.DISABLED_BY_REQUEST)
    if control and not control.url:
        reason = End.BROWSER_REQUIRED
    return ListingReport(
        source_url=url, stop_reason=reason, continuation_url=control.url if control else "", views=(view,)
    )
