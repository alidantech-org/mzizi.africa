"""Apply a validated site module to saved, fetched or rendered HTML."""

from __future__ import annotations

import base64
import hashlib
from collections.abc import Callable
from contextlib import ExitStack
from datetime import UTC, datetime
from pathlib import Path

import yaml
from bs4 import Tag
from pydantic import BaseModel, TypeAdapter

from mzizi_browser.shared.adapter import BrowserUnavailable, open_session
from mzizi_crawler.shared.bundles.validate import module_errors
from mzizi_crawler.shared.common import browser_config, out_dir, site_of
from mzizi_crawler.shared.engine.backends import BrowserBackend
from mzizi_crawler.shared.identity import user_agent
from mzizi_crawler.shared.records import Record
from mzizi_crawler.shared.requests import (
    Render,
    ScrapeFileRequest,
    ScrapeUrlRequest,
    SelectRequest,
)
from mzizi_crawler.shared.scraping import (
    CssSelector,
    JsonValue,
    ModuleSpec,
    discover_items,
    extract_item,
    next_page_url,
    parse_module,
    select,
)
from mzizi_fetch.web.blocks import BlockDecision, BlockPolicy
from mzizi_fetch.web.client import WebClient, WebResponse
from mzizi_fetch.web.policy import Decision, SourcePolicy
from mzizi_fetch.web.urls import host_of, validate

JSON_VALUE = TypeAdapter[JsonValue](JsonValue)


class Recipe(BaseModel):
    module: ModuleSpec
    sha256: str


class ScrapedRecord(BaseModel):
    fields: dict[str, JsonValue]
    errors: tuple[str, ...]


class CaptureAttempt(Record):
    url: str
    capture: str = ""
    sha256: str = ""
    method: Render
    records: int = 0
    valid_records: int = 0
    meets_expectations: bool = False
    selected: bool = False
    reason: str = ""


class ScrapeResult(BaseModel):
    source: str
    module_sha256: str
    ok: bool = True
    reason: str = ""
    final_url: str = ""
    status: int = 0
    capture: str = ""
    sha256: str = ""
    observed_at: datetime | None = None
    render: Render | None = None
    adapter: str = ""
    selector_index: int = -1
    pages: int = 0
    captures: tuple[str, ...] = ()
    records: tuple[ScrapedRecord, ...] = ()
    policy_audit: tuple[Decision, ...] = ()
    block_decisions: tuple[BlockDecision, ...] = ()
    attempts: tuple[CaptureAttempt, ...] = ()
    coverage_complete: bool | None = None


class PageCapture(BaseModel):
    response: WebResponse
    path: str
    empty: bool = False


class Selection(BaseModel):
    selector_index: int
    matches: tuple[JsonValue, ...]


def _recipe(text: str, source: str) -> Recipe:
    content = text.encode("utf-8")
    document = JSON_VALUE.validate_python(yaml.safe_load(content))
    if problems := module_errors(document, source):
        raise ValueError("\n".join(problems))
    spec = parse_module(document)
    if spec.discover.listing is None:
        raise ValueError(f"{source}: single-page HTML extraction requires discover.listing.items")
    return Recipe(module=spec, sha256=hashlib.sha256(content).hexdigest())


def _extract(capture: bytes, recipe: Recipe, result: ScrapeResult) -> ScrapeResult:
    try:
        html: str | bytes = capture.decode("utf-8-sig")
    except UnicodeDecodeError:
        html = capture
    match = discover_items(html, recipe.module)
    records: list[ScrapedRecord] = []
    for item in match.items:
        extracted = extract_item(item, recipe.module.extract.fields)
        records.append(ScrapedRecord(fields=extracted.record, errors=extracted.errors))
    return result.model_copy(update={"selector_index": match.selector_index, "records": tuple(records)})


def scrape_file(request: ScrapeFileRequest) -> ScrapeResult:
    recipe = _recipe(request.module_yaml, request.module_source)
    content = base64.b64decode(request.html_base64, validate=True)
    result = ScrapeResult(
        source=request.source, module_sha256=recipe.sha256, sha256=hashlib.sha256(content).hexdigest()
    )
    return _extract(content, recipe, result)


def _failure(response: WebResponse) -> str:
    if response.refused is not None:
        return response.refused.reason
    if response.block is not None:
        return f"{response.block.kind.value}: {response.block.detail}"
    return response.error or f"HTTP {response.status}: expected a usable HTML page"


def _fetch_pages(
    recipe: Recipe, request: ScrapeUrlRequest, get: Callable[[str], WebResponse], folder: Path
) -> tuple[list[PageCapture], str]:
    """Follows the listing's pagination rule from the requested URL; returns the captures and why it stopped early."""
    listing = recipe.module.discover.listing
    paginate = listing.paginate if listing is not None else None
    pages: list[PageCapture] = []
    url, number = request.url, paginate.start if paginate else 1
    seen: set[str] = set()
    while url not in seen:
        seen.add(url)
        response = get(url)
        if not response.usable or not response.is_html:
            return pages, _failure(response) if not pages else ""
        name = "page.html" if not pages else f"page-{len(pages) + 1}.html"
        (folder / name).write_bytes(response.body)
        pages.append(PageCapture(response=response, path=str(folder / name)))
        if paginate is None or len(pages) >= paginate.page_limit:
            break
        html = response.body.decode("utf-8", errors="replace")
        if paginate.stops_on_empty() and not discover_items(html, recipe.module).items:
            pages[-1] = pages[-1].model_copy(update={"empty": True})
            break
        following = next_page_url(paginate, response.final_url, number, html)
        if following is None:
            break
        url, number = following, number + 1
    return pages, ""


class _AutoCapture:
    def __init__(
        self, recipe: Recipe, request: ScrapeUrlRequest, client: WebClient, folder: Path, stack: ExitStack
    ) -> None:
        self.recipe, self.request, self.client, self.folder, self.stack = recipe, request, client, folder, stack
        self.browser: BrowserBackend | None = None
        self.attempts: list[CaptureAttempt] = []

    def _attempt(self, url: str, response: WebResponse, method: Render) -> CaptureAttempt:
        attempt = CaptureAttempt(url=url, method=method)
        if not response.usable or not response.is_html:
            return attempt.model_copy(update={"reason": _failure(response)})
        name = f"alternatives/{hashlib.sha256(url.encode()).hexdigest()[:16]}-{method.value}.html"
        capture = self.folder / name
        capture.parent.mkdir(parents=True, exist_ok=True)
        capture.write_bytes(response.body)
        result = _extract(response.body, self.recipe, ScrapeResult(source=url, module_sha256=self.recipe.sha256))
        expect = self.recipe.module.expect
        accepted = sum(
            not record.errors
            and all(record.fields.get(field) not in (None, "", [], ()) for field in expect.required_fields)
            for record in result.records
        )
        meets = (
            bool(result.records)
            and accepted == len(result.records)
            and accepted >= expect.min_items
            and (expect.max_items is None or accepted <= expect.max_items)
        )
        return attempt.model_copy(
            update={
                "capture": name,
                "sha256": hashlib.sha256(response.body).hexdigest(),
                "records": len(result.records),
                "valid_records": accepted,
                "meets_expectations": meets,
            }
        )

    def get(self, url: str) -> WebResponse:
        initial = self.client.get(url)
        http = self._attempt(url, initial, Render.HTTP)
        if not initial.usable or not initial.is_html or http.meets_expectations:
            self.attempts.append(http.model_copy(update={"selected": True}))
            return initial
        try:
            if self.browser is None:
                config = browser_config(
                    self.request,
                    headed=self.request.headed,
                    agent=self.client.user_agent,
                    site=site_of(url),
                )
                session = open_session(config.model_copy(update={"accept_downloads": False}))
                self.stack.callback(session.close)
                self.browser = BrowserBackend(self.client, session)
            rendered = self.browser.get(url)
        except BrowserUnavailable as error:
            self.attempts.extend(
                (
                    http.model_copy(update={"selected": True}),
                    CaptureAttempt(url=url, method=Render.BROWSER, reason=str(error)),
                )
            )
            return initial
        browser = self._attempt(url, rendered, Render.BROWSER)
        better = bool(browser.capture) and (browser.meets_expectations, browser.valid_records, browser.records) > (
            http.meets_expectations,
            http.valid_records,
            http.records,
        )
        self.attempts.extend(
            (http.model_copy(update={"selected": not better}), browser.model_copy(update={"selected": better}))
        )
        return rendered if better else initial


def scrape_url(request: ScrapeUrlRequest) -> ScrapeResult:
    recipe = _recipe(request.module_yaml, request.module_source)
    validate(request.url)
    host = host_of(request.url)
    paginated = recipe.module.discover.listing is not None and recipe.module.discover.listing.paginate is not None
    client = WebClient(
        user_agent(),
        SourcePolicy(allowed_hosts=(host,), max_requests=1000 if paginated else 20),
        (host,),
        blocks=BlockPolicy(max_retries=0),
    )
    auto: _AutoCapture | None = None
    folder = out_dir(request)
    with ExitStack() as stack:
        stack.callback(client.close)
        if request.render is Render.BROWSER:
            config = browser_config(request, headed=request.headed, agent=client.user_agent, site=site_of(request.url))
            session = open_session(config.model_copy(update={"accept_downloads": False}))
            stack.callback(session.close)
            get = BrowserBackend(client, session).get
        elif request.render is Render.AUTO:
            auto = _AutoCapture(recipe, request, client, folder, stack)
            get = auto.get
        else:
            get = client.get
        pages, failure = _fetch_pages(recipe, request, get, folder)
    first = pages[0].response if pages else None
    result = ScrapeResult(
        source=request.url,
        module_sha256=recipe.sha256,
        final_url=first.final_url if first else "",
        status=first.status if first else 0,
        observed_at=datetime.now(UTC),
        render=request.render,
        adapter=request.adapter if request.render is Render.BROWSER or (auto and auto.browser) else "",
        attempts=tuple(auto.attempts) if auto else (),
        coverage_complete=bool(pages) and all(item.meets_expectations for item in auto.attempts if item.selected)
        if auto
        else None,
        policy_audit=tuple(client.audit),
        block_decisions=tuple(client.blocks.decisions),
        pages=len(pages),
        captures=tuple(page.path for page in pages),
    )
    if not pages:
        return result.model_copy(update={"ok": False, "reason": failure})
    result = result.model_copy(
        update={"capture": pages[0].path, "sha256": hashlib.sha256(pages[0].response.body).hexdigest()}
    )
    records: list[ScrapedRecord] = []
    for page in pages:
        extracted = _extract(page.response.body, recipe, result)
        if result.selector_index == -1 or extracted.selector_index != -1:
            result = result.model_copy(update={"selector_index": extracted.selector_index})
        records.extend(extracted.records)
    return result.model_copy(update={"records": tuple(records)})


def select_file(request: SelectRequest) -> Selection:
    result = select(base64.b64decode(request.html_base64, validate=True), CssSelector(css=request.css))
    return Selection(
        selector_index=result.selector_index,
        matches=tuple(item.get_text(" ", strip=True) if isinstance(item, Tag) else item for item in result.items),
    )
