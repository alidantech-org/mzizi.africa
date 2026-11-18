"""Collect a documented public JSON API: raw pages kept as received, fields extracted by a module, one row per item."""

from __future__ import annotations

import csv
import json
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

import yaml
from pydantic import BaseModel, ConfigDict

from mzizi_crawler.shared.common import out_dir
from mzizi_crawler.shared.identity import user_agent
from mzizi_crawler.shared.requests import ApiCollectRequest
from mzizi_crawler.shared.scraping import JsonValue, discover_items, extract_item, next_page_url, parse_module
from mzizi_fetch.web.client import WebClient
from mzizi_fetch.web.policy import SourcePolicy
from mzizi_fetch.web.urls import host_of


class ApiEndpoint(BaseModel):
    model_config = ConfigDict(extra="ignore")

    path: str
    query: dict[str, str | int | float | bool] = {}


class ApiBlock(BaseModel):
    model_config = ConfigDict(extra="ignore")

    base_url: str
    headers: dict[str, str] = {}
    endpoints: dict[str, ApiEndpoint]


class ApiSource(BaseModel):
    model_config = ConfigDict(extra="ignore")

    code: str
    api: ApiBlock


class PageReport(BaseModel):
    number: int
    url: str
    status: int
    bytes: int
    items: int
    rows_with_errors: int


class ApiCollectResult(BaseModel):
    source: str
    endpoint: str
    pages: tuple[PageReport, ...]
    rows: int
    fields: tuple[str, ...]
    stopped: str
    errors: tuple[str, ...]
    user_agent: str


def _first_url(source: ApiSource, endpoint: str) -> str:
    spec = source.api.endpoints[endpoint]
    parts = urlparse(source.api.base_url.rstrip("/") + spec.path)
    query = parse_qsl(parts.query) + [(key, str(value)) for key, value in spec.query.items()]
    return urlunparse(parts._replace(query=urlencode(query)))


def collect_api(request: ApiCollectRequest) -> ApiCollectResult:
    source = ApiSource.model_validate(yaml.safe_load(request.source_yaml))
    if request.endpoint not in source.api.endpoints:
        raise ValueError(f"unknown endpoint {request.endpoint!r}; the source declares {sorted(source.api.endpoints)}")
    module = parse_module(yaml.safe_load(request.module_yaml))
    listing = module.discover.api
    if listing is None:
        raise ValueError("the module has no discover.api section")
    pagination = listing.paginate
    folder = out_dir(request)
    (folder / "raw").mkdir(exist_ok=True)
    url = _first_url(source, request.endpoint)
    host = host_of(url)
    client = WebClient(
        user_agent(),
        SourcePolicy(allowed_hosts=(host,), max_requests=request.max_pages + 2, requests_per_second=1 / request.delay),
        (host,),
    )
    rows: list[dict[str, JsonValue]] = []
    reports: list[PageReport] = []
    errors: list[str] = []
    stopped, number = "max_pages", 1
    limit = min(request.max_pages, pagination.page_limit if pagination else 1)
    try:
        while True:
            response = client.get(url, conditional=False)
            if response.refused or response.block or response.status != 200:
                stopped = response.refused.reason if response.refused else f"status {response.status}"
                errors.append(f"page {number}: {stopped}")
                break
            (folder / "raw" / f"page-{number:04d}.json").write_bytes(response.body)
            document: JsonValue = json.loads(response.body)
            items = discover_items(document, module).items
            failed = 0
            for item in items:
                extraction = extract_item(item, module.extract.fields)
                rows.append(extraction.record)
                failed += bool(extraction.errors)
                errors.extend(extraction.errors[:1])
            reports.append(
                PageReport(
                    number=number,
                    url=url,
                    status=200,
                    bytes=len(response.body),
                    items=len(items),
                    rows_with_errors=failed,
                )
            )
            if not items and (pagination is None or pagination.stops_on_empty()):
                stopped = "empty_items"
                break
            following = next_page_url(pagination, url, number, document) if pagination else None
            if following is None or number >= limit:
                stopped = "max_pages" if following else "no_next"
                break
            url, number = following, number + 1
    finally:
        client.close()
    names = tuple(module.extract.fields)
    with (folder / "records.jsonl").open("w", encoding="utf-8") as stream:
        stream.writelines(json.dumps(row, ensure_ascii=False) + "\n" for row in rows)
    with (folder / "records.csv").open("w", encoding="utf-8", newline="") as stream:
        writer = csv.writer(stream)
        writer.writerow(names)
        writer.writerows([[row.get(name) for name in names] for row in rows])
    result = ApiCollectResult(
        source=source.code,
        endpoint=request.endpoint,
        pages=tuple(reports),
        rows=len(rows),
        fields=names,
        stopped=stopped,
        errors=tuple(errors[:50]),
        user_agent=client.user_agent,
    )
    (folder / "summary.json").write_text(result.model_dump_json(indent=2), encoding="utf-8")
    return result
