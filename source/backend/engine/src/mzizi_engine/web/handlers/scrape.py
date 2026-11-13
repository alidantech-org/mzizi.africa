"""Apply a validated site module to saved, fetched or rendered HTML."""

from __future__ import annotations

import base64
import hashlib
from datetime import UTC, datetime

import yaml
from bs4 import Tag
from pydantic import BaseModel, TypeAdapter

from mzizi_engine.web.browser.adapter import open_session
from mzizi_engine.web.crawl.backends import BrowserBackend
from mzizi_engine.web.handlers.common import browser_config, out_dir
from mzizi_engine.web.identity import user_agent
from mzizi_engine.web.requests import Render, ScrapeFileRequest, ScrapeUrlRequest, SelectRequest
from mzizi_fetch.web.blocks import BlockDecision, BlockPolicy
from mzizi_fetch.web.client import WebClient
from mzizi_fetch.web.policy import Decision, SourcePolicy
from mzizi_fetch.web.urls import host_of, validate
from mzizi_manifest.validate import module_errors
from mzizi_scraping import parse_module
from mzizi_scraping.core import JsonValue
from mzizi_scraping.extract import ModuleSpec, discover_items, extract_item
from mzizi_scraping.selectors import CssSelector, select

JSON_VALUE = TypeAdapter[JsonValue](JsonValue)


class Recipe(BaseModel):
    module: ModuleSpec
    sha256: str


class ScrapedRecord(BaseModel):
    fields: dict[str, JsonValue]
    errors: tuple[str, ...]


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
    records: tuple[ScrapedRecord, ...] = ()
    policy_audit: tuple[Decision, ...] = ()
    block_decisions: tuple[BlockDecision, ...] = ()


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


def scrape_url(request: ScrapeUrlRequest) -> ScrapeResult:
    recipe = _recipe(request.module_yaml, request.module_source)
    validate(request.url)
    host = host_of(request.url)
    client = WebClient(
        user_agent(), SourcePolicy(allowed_hosts=(host,), max_requests=20), (host,), blocks=BlockPolicy(max_retries=0)
    )
    try:
        if request.render is Render.BROWSER:
            session = open_session(browser_config(request, headed=request.headed, agent=client.user_agent))
            try:
                response = BrowserBackend(client, session).get(request.url)
            finally:
                session.close()
        else:
            response = client.get(request.url)
    finally:
        client.close()
    result = ScrapeResult(
        source=request.url,
        module_sha256=recipe.sha256,
        final_url=response.final_url,
        status=response.status,
        observed_at=datetime.now(UTC),
        render=request.render,
        adapter=request.adapter if request.render is Render.BROWSER else "",
        policy_audit=tuple(client.audit),
        block_decisions=tuple(client.blocks.decisions),
    )
    if not response.usable or not response.is_html:
        reason = response.error or f"HTTP {response.status}: expected a usable HTML page"
        if response.refused is not None:
            reason = response.refused.reason
        elif response.block is not None:
            reason = f"{response.block.kind.value}: {response.block.detail}"
        return result.model_copy(update={"ok": False, "reason": reason})
    capture = out_dir(request) / "page.html"
    capture.write_bytes(response.body)
    result = result.model_copy(update={"capture": str(capture), "sha256": hashlib.sha256(response.body).hexdigest()})
    return _extract(response.body, recipe, result)


def select_file(request: SelectRequest) -> Selection:
    result = select(base64.b64decode(request.html_base64, validate=True), CssSelector(css=request.css))
    return Selection(
        selector_index=result.selector_index,
        matches=tuple(item.get_text(" ", strip=True) if isinstance(item, Tag) else item for item in result.items),
    )
