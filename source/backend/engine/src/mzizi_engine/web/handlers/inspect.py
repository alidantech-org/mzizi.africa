"""Fetch, robots, browser and search capabilities (single-URL operations)."""

from __future__ import annotations

from pathlib import Path

from pydantic import BaseModel

from mzizi_engine.web.browser.actions import Click, Fill, Screenshot, parse_actions, run_actions
from mzizi_engine.web.browser.adapter import open_session
from mzizi_engine.web.browser.challenge import detect_challenge
from mzizi_engine.web.browser.models import RenderedPage, StepResult
from mzizi_engine.web.export import write_table
from mzizi_engine.web.handlers.common import browser_config, out_dir
from mzizi_engine.web.identity import user_agent
from mzizi_engine.web.requests import SearchRequest, UrlRequest
from mzizi_engine.web.search.models import SearchResult
from mzizi_engine.web.search.providers import make_provider
from mzizi_engine.web.search.service import search
from mzizi_extraction import extract_html_document
from mzizi_extraction.document import render_markdown
from mzizi_fetch.web.blocks import detect_block
from mzizi_fetch.web.client import WebClient
from mzizi_fetch.web.policy import Decision, SourcePolicy
from mzizi_fetch.web.urls import classify, host_of, same_site
from mzizi_scraping import extract_links, extract_references


def _client(url: str, delay: float) -> WebClient:
    host = host_of(url)
    return WebClient(
        user_agent(),
        SourcePolicy(allowed_hosts=(host,), max_requests=20, requests_per_second=1 / delay if delay > 0 else 100.0),
        (host,),
    )


class FetchResult(BaseModel):
    url: str
    ok: bool
    status: int
    final_url: str
    content_type: str
    bytes: int
    redirects: tuple[str, ...]
    block: str
    refused: str
    error: str
    user_agent: str


def fetch_one(request: UrlRequest) -> FetchResult:
    folder, client = out_dir(request), _client(request.url, request.delay)
    try:
        response = client.get(request.url)
        (folder / "body.bin").write_bytes(response.body)
    finally:
        client.close()
    block = f"{response.block.kind.value}: {response.block.detail}" if response.block else ""
    return FetchResult(
        url=request.url,
        ok=response.usable,
        status=response.status,
        final_url=response.final_url,
        content_type=response.content_type,
        bytes=len(response.body),
        redirects=response.redirects,
        block=block,
        refused=response.refused.reason if response.refused else "",
        error=response.error,
        user_agent=client.user_agent,
    )


class RobotsResult(BaseModel):
    url: str
    decision: Decision
    crawl_delay: float | None
    user_agent: str


def robots_policy(request: UrlRequest) -> RobotsResult:
    client = _client(request.url, request.delay)
    try:
        decision = client.robots_for(request.url)
        return RobotsResult(
            url=request.url,
            decision=decision,
            crawl_delay=client.crawl_delay(request.url),
            user_agent=client.user_agent,
        )
    finally:
        client.close()


class PageInfo(BaseModel):
    page: RenderedPage
    challenge: str
    links: int
    images: int
    screenshot: str


def browser_open(request: UrlRequest) -> PageInfo:
    session = open_session(browser_config(request, headed=not request.headless))
    try:
        page = session.goto(request.url)
        block = detect_challenge(page)
        shot = session.screenshot("page", True).name if not page.error else ""
        info = PageInfo(
            page=page.model_copy(update={"html": "", "text": page.text[:2000]}),
            challenge=f"{block.kind.value}: {block.detail}" if block else "",
            links=len(session.links()),
            images=len(session.images()),
            screenshot=shot,
        )
        if request.hold:
            input("Browser is open. Press Enter here to close it… ")
        return info
    finally:
        session.close()


class ScriptResult(BaseModel):
    ok: bool
    steps: tuple[StepResult, ...]


def browser_script(request: UrlRequest) -> ScriptResult:
    steps = parse_actions(Path(request.actions).read_text(encoding="utf-8"))
    session = open_session(browser_config(request, headed=not request.headless))
    try:
        if request.url:
            session.goto(request.url)
        results = run_actions(session, steps, out_dir(request))
    finally:
        session.close()
    return ScriptResult(ok=all(r.ok for r in results), steps=tuple(results))


class Side(BaseModel):
    status: int
    links: int
    markdown_chars: int


class Comparison(BaseModel):
    url: str
    http: Side
    browser: Side
    links_only_after_javascript: tuple[str, ...]
    needs_browser: bool


def browser_compare(request: UrlRequest) -> Comparison:
    client = _client(request.url, request.delay)
    try:
        raw = client.get(request.url)
    finally:
        client.close()
    session = open_session(browser_config(request, headed=request.headed))
    try:
        rendered = session.goto(request.url)
    finally:
        session.close()
    raw_links = {link.url for link in extract_links(raw.text, raw.final_url)}
    rendered_links = {link.url for link in extract_links(rendered.html, rendered.final_url)}
    raw_chars = len(render_markdown(extract_html_document(raw.text, raw.final_url)[0].pages))
    rendered_chars = len(render_markdown(extract_html_document(rendered.html, rendered.final_url)[0].pages))
    extra = sorted(rendered_links - raw_links)
    return Comparison(
        url=request.url,
        http=Side(status=raw.status, links=len(raw_links), markdown_chars=raw_chars),
        browser=Side(status=rendered.status, links=len(rendered_links), markdown_chars=rendered_chars),
        links_only_after_javascript=tuple(extra[:50]),
        needs_browser=rendered_chars > raw_chars * 1.3 or len(extra) > 3,
    )


class SearchResults(BaseModel):
    query: str
    provider: str
    results: tuple[SearchResult, ...]
    files: tuple[str, ...]


def web_search(request: SearchRequest) -> SearchResults:
    import httpx

    with httpx.Client() as http:
        found = search(make_provider(request.engine, http), request.query, request.count, request.offset)
    files = write_table(
        out_dir(request), "results", found, list(SearchResult.model_fields), request.formats, ordered=True
    )
    return SearchResults(query=request.query, provider=request.engine, results=tuple(found), files=tuple(files))


def browser_snapshot(request: UrlRequest) -> PageInfo:
    folder = out_dir(request)
    session = open_session(browser_config(request, headed=request.headed))
    try:
        page = session.goto(request.url)
        (folder / "rendered.html").write_text(page.html, encoding="utf-8")
        block = detect_challenge(page)
        shot = session.screenshot("page", True).name if not page.error else ""
        return PageInfo(
            page=page.model_copy(update={"html": "", "text": page.text[:2000]}),
            challenge=f"{block.kind.value}: {block.detail}" if block else "",
            links=len(session.links()),
            images=len(session.images()),
            screenshot=shot,
        )
    finally:
        session.close()


class Reference(BaseModel):
    url: str
    kind: str
    tag: str
    scope: str
    text: str


class LinksResult(BaseModel):
    url: str
    counts: dict[str, int]
    references: tuple[Reference, ...]


def web_links(request: UrlRequest) -> LinksResult:
    """Every link, image, media and embed URL on a page, classified; nothing it points at is requested."""
    client = _client(request.url, request.delay)
    try:
        response = client.get(request.url)
    finally:
        client.close()
    host = host_of(request.url)
    found = tuple(
        Reference(
            url=r.url,
            kind=classify(r.url, r.tag).value,
            tag=r.tag,
            scope="internal" if same_site(host, host_of(r.url)) else "external",
            text=r.text,
        )
        for r in extract_references(response.text, response.final_url)
    )
    counts: dict[str, int] = {}
    for item in found:
        counts[f"{item.scope}_{item.kind}"] = counts.get(f"{item.scope}_{item.kind}", 0) + 1
    return LinksResult(url=request.url, counts=counts, references=found)


class ChallengeReport(BaseModel):
    source: str
    challenge: bool
    kind: str
    detail: str
    status: int


def inspect_challenge(request: UrlRequest) -> ChallengeReport:
    """What a page shows: an access challenge, a CAPTCHA, a block notice or nothing. Detection only."""
    if request.actions:  # an HTML file
        body = Path(request.actions).read_bytes()
        block = detect_block(200, {}, body)
        return ChallengeReport(
            source=request.actions,
            challenge=block is not None,
            kind=block.kind.value if block else "",
            detail=block.detail if block else "",
            status=200,
        )
    client = _client(request.url, request.delay)
    try:
        response = client.get(request.url)
    finally:
        client.close()
    block = response.block or detect_block(response.status, response.headers, response.body, response.error)
    return ChallengeReport(
        source=request.url,
        challenge=block is not None,
        kind=block.kind.value if block else "",
        detail=block.detail if block else "",
        status=response.status,
    )


def _act(request: UrlRequest, step: str) -> ScriptResult:
    """One interaction on a freshly opened page, then a screenshot and the page's state."""
    folder = out_dir(request)
    session = open_session(browser_config(request, headed=not request.headless))
    try:
        session.goto(request.url)
        steps = (
            [Click(do="click", target=request.target)]
            if step == "click"
            else [Fill(do="fill", target=request.target, text=request.text)]
        )
        results = run_actions(session, [*steps, Screenshot(do="screenshot", name="after")], folder)
        (folder / "after.html").write_text(session.page_state().html, encoding="utf-8")
    finally:
        session.close()
    return ScriptResult(ok=all(r.ok for r in results), steps=tuple(results))


def browser_click(request: UrlRequest) -> ScriptResult:
    return _act(request, "click")


def browser_fill(request: UrlRequest) -> ScriptResult:
    return _act(request, "fill")
