"""Capture a listing's same-document sections, with Markdown and per-view source evidence."""

from __future__ import annotations

import hashlib
from contextlib import ExitStack
from enum import StrEnum
from pathlib import Path
from time import monotonic
from urllib.parse import quote, urldefrag

from pydantic import BaseModel, ConfigDict

from mzizi_browser.shared.adapter import BrowserUnavailable, open_session
from mzizi_browser.shared.media import MediaInventory, render_media
from mzizi_browser.shared.pagination.panels import PanelControl, PanelView, discover_panels, listing_control, read_panel
from mzizi_crawler.features.sections.section_browser import (
    PanelWalker,
    StopReason,
    WalkResult,
    listing_continuation,
)
from mzizi_crawler.shared.common import browser_config, out_dir, site_of
from mzizi_crawler.shared.engine.backends import BrowserBackend
from mzizi_crawler.shared.identity import user_agent
from mzizi_crawler.shared.requests import Render, SectionsRequest
from mzizi_crawler.shared.scraping import extract_references
from mzizi_crawler.shared.tables import save_tables
from mzizi_extraction import extract_html_document, format_markdown, render_markdown
from mzizi_fetch.web.client import WebClient, WebResponse
from mzizi_fetch.web.policy import SourcePolicy
from mzizi_fetch.web.urls import UrlKind, classify, host_of

MAX_INITIAL_REQUESTS = 12


class Method(StrEnum):
    HTML = "html"
    BROWSER = "browser"


class Evidence(BaseModel):
    model_config = ConfigDict(frozen=True)

    url: str
    text: str
    kind: UrlKind


class CapturedView(BaseModel):
    model_config = ConfigDict(frozen=True)

    method: Method
    source_url: str
    path_html: str
    path_markdown: str
    path_tables: str = ""
    path_media: str = ""
    sha256: str
    listing_signature: str
    table_rows: int
    list_items: int
    status_text: tuple[str, ...]
    references: tuple[Evidence, ...]


class CapturedSection(BaseModel):
    model_config = ConfigDict(frozen=True)

    target: str
    label: str
    kind: str
    source_url: str
    complete: bool
    stop_reason: StopReason
    continuation_url: str = ""
    browser_error: str = ""
    preferred_markdown: tuple[str, ...] = ()
    initial_table_rows: int
    browser_distinct_table_rows: int
    browser_covers_initial_items: bool | None = None
    captured_distinct_table_rows: int
    captured_distinct_list_items: int
    views: tuple[CapturedView, ...]


class SectionsReport(BaseModel):
    model_config = ConfigDict(frozen=True)

    url: str
    status: int
    complete: bool = False
    reason: str = ""
    discovered_sections: int = 0
    sections: tuple[CapturedSection, ...] = ()
    files: tuple[str, ...] = ()


def _controls(html: str, url: str) -> tuple[PanelControl, ...]:
    panels = discover_panels(html, url)
    if panels:
        return panels
    listing = listing_control(html, url)
    return (listing,) if listing else ()


def _failure(response: WebResponse) -> str:
    if response.refused:
        return response.refused.reason
    if response.block:
        return f"{response.block.kind.value}: {response.block.detail}"
    return response.error or f"HTTP {response.status}: expected usable HTML"


def _save_view(
    view: PanelView,
    method: Method,
    url: str,
    request: SectionsRequest,
    out: Path,
    stem: str,
    media: MediaInventory | None = None,
) -> CapturedView:
    folder = out / stem
    folder.parent.mkdir(parents=True, exist_ok=True)
    html = f"<main>{view.html}</main>"
    document, _, _ = extract_html_document(html, url, include_css_images=request.css_images)
    markdown = render_markdown(document.pages).removeprefix("<!-- page 1 -->\n\n")
    html_path = folder.with_suffix(".html")
    md_path = folder.with_suffix(".md")
    tables = folder.with_suffix(".tables.json")
    has_tables = save_tables(document, tables)
    media_path = folder.with_suffix(".media.json")
    refs = [
        Evidence(url=ref.url, text=ref.text, kind=classify(ref.url, ref.tag))
        for ref in extract_references(view.html, url)
        if ref.url != urldefrag(url).url
    ]
    if media is not None:
        media = media.model_copy(update={"source_url": url})
        media_path.write_text(media.model_dump_json(indent=2) + "\n", encoding="utf-8")
        markdown += render_media(media)
        seen = {(ref.url, ref.kind) for ref in refs}
        for ref in media.references:
            if (ref.url, UrlKind.IMAGE) not in seen:
                refs.append(Evidence(url=ref.url, text=ref.label, kind=UrlKind.IMAGE))
                seen.add((ref.url, UrlKind.IMAGE))
    captured = view.html.encode("utf-8")
    html_path.write_bytes(captured)
    md_path.write_text(format_markdown(markdown), encoding="utf-8")
    return CapturedView(
        method=method,
        source_url=url,
        path_html=html_path.relative_to(out).as_posix(),
        path_markdown=md_path.relative_to(out).as_posix(),
        sha256=hashlib.sha256(captured).hexdigest(),
        listing_signature=view.signature,
        table_rows=len(view.table_rows),
        list_items=len(view.list_items),
        status_text=view.status_text,
        path_tables=tables.relative_to(out).as_posix() if has_tables else "",
        path_media=media_path.relative_to(out).as_posix() if media is not None else "",
        references=tuple(refs),
    )


def _preferred(static: PanelView | None, walked: WalkResult | None, views: list[CapturedView]) -> tuple[str, ...]:
    browser = walked.views if walked else ()
    if (
        static
        and not any(path.path_media for path in views)
        and (not browser or (_keys(static) and all(_keys(v) <= _keys(static) for v in browser)))
    ):
        return (views[0].path_markdown,)
    if not browser:
        return ()
    # Cumulative load-more states can be represented by the last capture when it contains all earlier rows.
    if _keys(browser[-1]) and all(_keys(v) <= _keys(browser[-1]) for v in browser):
        picked = [views[-1].path_markdown]
    else:
        picked = [v.path_markdown for v in views if v.method is Method.BROWSER]
    if static and (not _keys(static) or not _keys(static) <= {key for v in browser for key in _keys(v)}):
        picked.insert(0, views[0].path_markdown)
    return tuple(picked)


def _keys(view: PanelView) -> set[str]:
    return set(view.table_rows) | set(view.list_items)


def _capture(
    control: PanelControl,
    initial: PanelView | None,
    walked: WalkResult | None,
    request: SectionsRequest,
    out: Path,
    base_url: str,
    index: int,
) -> CapturedSection:
    target = quote(control.target, safe="")
    url = f"{urldefrag(base_url).url}#{target}" if target else base_url
    static = initial if initial and initial.readable else None
    views: list[CapturedView] = []
    if static:
        views.append(_save_view(static, Method.HTML, url, request, out, f"sections/{index:03d}/initial"))
    if walked:
        for number, view in enumerate(walked.views, start=1):
            media = walked.media[number - 1] if walked.media else None
            views.append(
                _save_view(
                    view,
                    Method.BROWSER,
                    url,
                    request,
                    out,
                    f"sections/{index:03d}/view-{number:02d}",
                    media,
                )
            )
    continuation = ""
    if walked:
        reason, continuation = walked.reason, walked.continuation
    elif static:
        next_control, reason = listing_continuation(static)
        if reason is StopReason.NO_NEXT:
            reason = StopReason.STATIC
        continuation = next_control.url if next_control else ""
    else:
        reason = StopReason.MISSING
    if request.rendered_media and walked and walked.views and any(media is None for media in walked.media):
        reason = StopReason.MEDIA_UNAVAILABLE
    initial_rows = set(static.table_rows) if static else set()
    browser_rows = {row for v in walked.views for row in v.table_rows} if walked else set()
    browser_items = {item for v in walked.views for item in v.list_items} if walked else set()
    initial_items = set(static.list_items) if static else set()
    browser_covers_initial = None
    if walked and walked.views and (initial_rows or initial_items):
        browser_covers_initial = initial_rows <= browser_rows and initial_items <= browser_items
        if reason.complete and not browser_covers_initial:
            reason = StopReason.COVERAGE_MISMATCH
    return CapturedSection(
        target=control.target,
        label=control.label,
        kind=control.kind,
        source_url=url,
        complete=bool(views) and reason.complete,
        stop_reason=reason,
        continuation_url=continuation,
        browser_error=walked.error if walked else "",
        preferred_markdown=_preferred(static, walked, views),
        initial_table_rows=len(static.table_rows) if static else 0,
        browser_distinct_table_rows=len(browser_rows),
        browser_covers_initial_items=browser_covers_initial,
        captured_distinct_table_rows=len(initial_rows | browser_rows),
        captured_distinct_list_items=len(initial_items | browser_items),
        views=tuple(views),
    )


def _write_report(report: SectionsReport, out: Path) -> SectionsReport:
    names = ["sections.json"]
    lines: list[str] = ["# Listing sections"]
    for section in report.sections:
        lines.extend(("", f"## {section.label}", "", f"[Source view]({section.source_url})", ""))
        for name in section.preferred_markdown:
            lines.append((out / name).read_text(encoding="utf-8").strip())
            lines.append("")
    if report.sections:
        (out / "sections.md").write_text(format_markdown("\n".join(lines)), encoding="utf-8")
        names.append("sections.md")
    for name in ("initial.html", "rendered.html"):
        if (out / name).is_file():
            names.append(name)
    complete_report = report.model_copy(update={"files": tuple(names)})
    (out / "sections.json").write_text(complete_report.model_dump_json(indent=2) + "\n", encoding="utf-8")
    return complete_report


def _browser_needed(
    request: SectionsRequest, controls: tuple[PanelControl, ...], initial: dict[str, PanelView | None]
) -> bool:
    if request.render is not Render.AUTO:
        return request.render is Render.BROWSER
    return (
        request.rendered_media
        or not controls
        or any(
            view is None or not view.readable or listing_continuation(view)[1] is StopReason.NEEDS_BROWSER
            for view in initial.values()
        )
    )


def page_sections(request: SectionsRequest) -> SectionsReport:
    if request.rendered_media and request.render is Render.HTTP:
        raise ValueError("rendered media requires browser or auto rendering")
    folder, agent = out_dir(request), user_agent()
    host = host_of(request.url)
    policy = SourcePolicy(allowed_hosts=(host,), max_requests=MAX_INITIAL_REQUESTS)
    with ExitStack() as stack:
        client = WebClient(agent, policy, (host,))
        stack.callback(client.close)
        source = client.get(request.url)
        if not source.usable or not source.is_html:
            return _write_report(SectionsReport(url=request.url, status=source.status, reason=_failure(source)), folder)
        (folder / "initial.html").write_bytes(source.body)
        url = source.final_url
        controls = _controls(source.text, url)
        initial = {c.target: read_panel(source.text, c, url) for c in controls[: request.max_sections]}
        walker = None
        browser_error = ""
        wants_browser = _browser_needed(request, controls, initial)
        if wants_browser:
            isolated = request.model_copy(update={"reuse_browser": False})
            config = browser_config(isolated, headed=request.headed, agent=agent, site=site_of(url))
            try:
                session = open_session(config.model_copy(update={"accept_downloads": False}))
            except BrowserUnavailable as problem:
                browser_error = str(problem)
            else:
                stack.callback(session.close)
                rendered = BrowserBackend(client, session).get(url)
                if rendered.usable and rendered.is_html and urldefrag(rendered.final_url).url == urldefrag(url).url:
                    (folder / "rendered.html").write_bytes(rendered.body)
                    known = {control.target: control for control in controls}
                    known.update({control.target: control for control in _controls(rendered.text, url)})
                    controls = tuple(known.values())
                    walker = PanelWalker(session, url, monotonic() + request.browser_seconds, request.rendered_media)
                else:
                    browser_error = _failure(rendered)
        sections: list[CapturedSection] = []
        for index, control in enumerate(controls[: request.max_sections], start=1):
            view = initial.get(control.target)
            verify = (
                request.render is Render.BROWSER
                or (request.rendered_media and wants_browser)
                or (
                    wants_browser
                    and (view is None or not view.readable or listing_continuation(view)[1] is StopReason.NEEDS_BROWSER)
                )
            )
            walked = walker.walk(control, request.max_view_steps) if walker and verify else None
            if verify and browser_error:
                walked = WalkResult((), StopReason.BROWSER_UNAVAILABLE, error=browser_error)
            sections.append(_capture(control, view, walked, request, folder, url, index))
        complete = bool(sections) and len(sections) == len(controls) and all(section.complete for section in sections)
        reason = browser_error or ("no supported listing controls found" if not controls else "")
        if len(sections) < len(controls):
            reason = "section limit reached"
        return _write_report(
            SectionsReport(
                url=url,
                status=source.status,
                complete=complete,
                reason=reason,
                discovered_sections=len(controls),
                sections=tuple(sections),
            ),
            folder,
        )
