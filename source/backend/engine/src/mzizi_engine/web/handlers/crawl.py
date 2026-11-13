"""Crawl, one-page Markdown and export capabilities."""

from __future__ import annotations

import json
from pathlib import Path

from pydantic import BaseModel

from mzizi_engine.web.browser.adapter import open_session
from mzizi_engine.web.browser.challenge import ManualChallengeHandler
from mzizi_engine.web.crawl.backends import BrowserBackend, HttpBackend, PageBackend
from mzizi_engine.web.crawl.inventory import CrawlSummary
from mzizi_engine.web.crawl.service import client_for, run_crawl
from mzizi_engine.web.export import write_table
from mzizi_engine.web.handlers.common import browser_config, out_dir
from mzizi_engine.web.identity import user_agent
from mzizi_engine.web.records import ErrorRecord, LinkRecord, PageRecord, ResourceRecord
from mzizi_engine.web.requests import CrawlRequest, ExportRequest, MarkdownRequest, Render
from mzizi_extraction import extract_html_document
from mzizi_extraction.document import render_markdown
from mzizi_fetch.web.client import WebClient
from mzizi_fetch.web.policy import SourcePolicy
from mzizi_fetch.web.urls import host_of


def _ask_person(url: str, detail: str) -> bool:
    input(f"\nAccess check at {url} ({detail}). Complete it in the browser window, then press Enter to continue… ")
    return True


def crawl_site(request: CrawlRequest) -> CrawlSummary:
    if request.resume_from:
        request = request.model_copy(update={"out_dir": request.resume_from, "resume": True})
    agent = user_agent()
    client = client_for(request, agent)
    session = None
    try:
        backend: PageBackend = HttpBackend(client)
        if request.render is Render.BROWSER:
            session = open_session(browser_config(request, headed=request.headed, agent=agent))
            backend = BrowserBackend(client, session, ManualChallengeHandler(_ask_person) if request.headed else None)
        return run_crawl(request, client, backend)
    finally:
        if session is not None:
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


def page_markdown(request: MarkdownRequest) -> MarkdownResult:
    folder, agent = out_dir(request), user_agent()
    client = WebClient(
        agent, SourcePolicy(allowed_hosts=(host_of(request.url),), max_requests=20), (host_of(request.url),)
    )
    try:
        if request.render is Render.BROWSER:
            session = open_session(browser_config(request, headed=request.headed, agent=agent))
            try:
                response = BrowserBackend(client, session).get(request.url)
            finally:
                session.close()
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
    output, title, removed = extract_html_document(response.text, response.final_url)
    markdown = render_markdown(output.pages).replace("<!-- page 1 -->\n\n", "", 1)
    (folder / "page.html").write_bytes(response.body)
    (folder / "page.md").write_text(
        f"---\nurl: {response.final_url}\ntitle: {json.dumps(title, ensure_ascii=False)}\n---\n\n{markdown}",
        encoding="utf-8",
    )
    return MarkdownResult(
        url=request.url,
        ok=True,
        title=title,
        status=response.status,
        chrome_removed=removed,
        markdown_chars=len(markdown),
        files=("page.html", "page.md"),
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
        if not data.exists():
            continue
        records = [model.model_validate(row) for row in json.loads(data.read_text(encoding="utf-8"))]
        written.extend(
            write_table(target, name, records, list(model.model_fields), request.formats, ordered=name == "pages")
        )
    return ExportResult(source=str(source), files=tuple(written))
