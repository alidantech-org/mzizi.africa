"""Crawl, one-page Markdown and export capabilities."""

from __future__ import annotations
from mzizi_extraction.document import format_markdown

import json
from collections.abc import Callable
from contextlib import nullcontext
from pathlib import Path
from tempfile import TemporaryDirectory

from pydantic import BaseModel

from mzizi_browser.shared.adapter import BrowserSession, open_session
from mzizi_browser.shared.challenge import ManualChallengeHandler
from mzizi_browser.shared.media import MediaInventory, RenderedMediaSession, save_inventory
from mzizi_crawler.shared.common import browser_config, out_dir, site_of
from mzizi_crawler.shared.engine.backends import (
    BrowserBackend,
    CachedBackend,
    HttpBackend,
    HybridBackend,
    PageBackend,
)
from mzizi_crawler.shared.engine.evidence import CrawlEvidence
from mzizi_crawler.shared.engine.inventory import CrawlSummary
from mzizi_crawler.shared.engine.service import client_for, run_crawl
from mzizi_crawler.shared.export import read_csv, write_table
from mzizi_crawler.shared.identity import user_agent
from mzizi_crawler.shared.records import ErrorRecord, LinkRecord, PageRecord, ResourceRecord
from mzizi_crawler.shared.requests import (
    CrawlRequest,
    ExportRequest,
    MarkdownRequest,
    Render,
)
from mzizi_crawler.shared.tables import save_tables
from mzizi_extraction import extract_html_document, render_markdown
from mzizi_fetch.web.client import WebClient, WebResponse
from mzizi_fetch.web.policy import SourcePolicy
from mzizi_fetch.web.urls import host_of


def _ask_person(url: str, detail: str) -> bool:
    input(f"\nAccess check at {url} ({detail}). Complete it in the browser window, then press Enter to continue… ")
    return True


def crawl_site(
    request: CrawlRequest,
    on_page: Callable[[PageRecord, bytes], None] | None = None,
    lookup: Callable[[str], WebResponse | None] | None = None,
    on_reference: Callable[[LinkRecord], None] | None = None,
) -> CrawlSummary:
    if request.rendered_media and request.render is Render.HTTP:
        raise ValueError("rendered media requires browser or auto rendering")
    if request.resume_from:
        request = request.model_copy(update={"out_dir": request.resume_from, "resume": True})
    agent = user_agent()
    client = client_for(request, agent)
    sessions: list[BrowserSession] = []
    evidence = CrawlEvidence()
    site = site_of(request.starts[0] if request.starts else "")

    def browser_backend() -> BrowserBackend:
        config = browser_config(request, headed=request.headed, agent=agent, site=site)
        session = open_session(config.model_copy(update={"accept_downloads": False}))
        sessions.append(session)
        handler = ManualChallengeHandler(_ask_person) if request.headed else None
        return BrowserBackend(
            client,
            session,
            handler,
            request.screenshots,
            request.max_list_pages if request.paginate else 0,
            rendered_media=request.rendered_media,
            listing_selector=request.listing_selector,
            item_selector=request.item_selector,
            evidence=evidence,
        )

    try:
        backend: PageBackend = HttpBackend(client)
        if request.render is Render.BROWSER:
            backend = browser_backend()
        elif request.render is Render.AUTO:  # a browser opens only when a page turns out to need one
            backend = HybridBackend(
                backend,
                browser_backend,
                media=request.rendered_media,
                item_selector=request.item_selector,
                evidence=evidence,
            )
        if lookup is not None:
            backend = CachedBackend(backend, lookup)
        return run_crawl(request, client, backend, on_page, on_reference, evidence)
    finally:
        for session in sessions:
            session.close()
        client.close()


class MarkdownResult(BaseModel):
    url: str
    ok: bool
    reason: str = ""
    title: str = ""
    status: int = 0
    chrome_removed: int = 0
    markdown_chars: int = 0
    files: tuple[str, ...] = ()


def _markdown_browser(
    request: MarkdownRequest, client: WebClient, agent: str
) -> tuple[WebResponse, MediaInventory | None]:
    # Keep the rendered-media browser cache and any incidental downloads out of the evidence folder.
    with TemporaryDirectory(prefix="mzizi-media-") if request.rendered_media else nullcontext() as scratch:
        if scratch:
            request = request.model_copy(
                update={"reuse_browser": False, "profile_dir": scratch, "downloads_dir": scratch}
            )
        config = browser_config(request, headed=request.headed, agent=agent, site=site_of(request.url))
        session = open_session(config.model_copy(update={"accept_downloads": False}) if scratch else config)
        try:
            response = BrowserBackend(client, session).get(request.url)
            if not request.rendered_media or not response.usable or not response.is_html:
                return response, None
            if not isinstance(session, RenderedMediaSession):
                raise ValueError(f"browser adapter {request.adapter!r} does not support rendered media")
            capture = session.capture_media(scan_lazy=True)
            if capture.inventory.source_url != response.final_url:
                raise ValueError("page navigated during rendered media capture")
            return response.model_copy(update={"body": capture.html.encode("utf-8")}), capture.inventory
        finally:
            session.close()


def page_markdown(request: MarkdownRequest) -> MarkdownResult:
    if request.rendered_media and request.render is not Render.BROWSER:
        return MarkdownResult(url=request.url, ok=False, reason="rendered media requires browser rendering")
    folder, agent = out_dir(request), user_agent()
    client = WebClient(
        agent, SourcePolicy(allowed_hosts=(host_of(request.url),), max_requests=20), (host_of(request.url),)
    )
    media = None
    try:
        if request.render is Render.BROWSER:
            response, media = _markdown_browser(request, client, agent)
        else:
            response = client.get(request.url)
    finally:
        client.close()
    if response.refused is not None:
        return MarkdownResult(url=request.url, ok=False, reason=response.refused.reason)
    block = response.block
    if block is not None:
        return MarkdownResult(
            url=request.url, ok=False, reason=f"{block.kind.value}: {block.detail}", status=response.status
        )
    if not response.usable:
        return MarkdownResult(url=request.url, ok=False, reason=response.error or f"HTTP {response.status}")
    output, title, removed = extract_html_document(
        response.text, response.final_url, include_css_images=request.css_images
    )
    markdown = render_markdown(output.pages).replace("<!-- page 1 -->\n\n", "", 1)
    files: tuple[str, ...] = ("page.html", "page.md")
    if save_tables(output, folder / "tables.json"):
        files += ("tables.json",)
    if media is not None:
        markdown += save_inventory(folder, media)
        files += ("rendered-media.json",)
    (folder / "page.html").write_bytes(response.body)
    (folder / "page.md").write_text(
        f"---\nurl: {response.final_url}\ntitle: {json.dumps(title, ensure_ascii=False)}\n---\n\n{format_markdown(markdown)}",
        encoding="utf-8",
    )
    return MarkdownResult(
        url=request.url,
        ok=True,
        title=title,
        status=response.status,
        chrome_removed=removed,
        markdown_chars=len(markdown),
        files=files,
    )


class ExportResult(BaseModel):
    source: str
    files: tuple[str, ...]


_TABLES: dict[str, type[PageRecord] | type[LinkRecord] | type[ResourceRecord] | type[ErrorRecord]] = {
    "pages": PageRecord,
    "links": LinkRecord,
    "internal_urls": LinkRecord,
    "external_urls": LinkRecord,
    "images": ResourceRecord,
    "documents": ResourceRecord,
    "files": ResourceRecord,
    "media": ResourceRecord,
    "errors": ErrorRecord,
}


def export_results(request: ExportRequest) -> ExportResult:
    """Re-exports the inventories of a finished crawl (a crawl output folder) in other formats."""
    source, target = Path(request.source), out_dir(request)
    written: list[str] = []
    for name, model in _TABLES.items():
        data = source / f"{name}.json"
        table = source / f"{name}.csv"
        if data.exists():
            records = [model.model_validate(row) for row in json.loads(data.read_text(encoding="utf-8"))]
        elif table.exists():
            records = [model.model_validate(row, strict=False) for row in read_csv(table)]
        else:
            continue
        written.extend(
            write_table(target, name, records, list(model.model_fields), request.formats, ordered=name == "pages")
        )
    return ExportResult(source=str(source), files=tuple(written))
