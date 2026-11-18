"""API collection: pages are kept raw, fields come from the module, personal fields are never read, paging stops cleanly."""

import json
from pathlib import Path

import pytest

from mzizi_crawler.features.api_collect import api_collect
from mzizi_crawler.shared.requests import ApiCollectRequest
from mzizi_fetch.web.client import WebResponse

SOURCE = """
code: test.api
kind: api
api:
  base_url: https://example.test
  endpoints:
    items: { path: /api/items, items: { jsonpath: "$.data[*]" } }
"""
MODULE = """
discover:
  api:
    items: { jsonpath: "$.data[*]" }
    paginate: { type: query, param: page, start: 1, max_pages: 10, stop_when: empty_items }
extract:
  fields:
    id:    { from: { jsonpath: "$.id" } }
    title: { from: { jsonpath: "$.title" }, parse: [trim, collapse_whitespace] }
    when:  { from: { jsonpath: "$.at" }, parse: { date: "%Y-%m-%d %H:%M:%S" } }
"""
PAGES = {
    "https://example.test/api/items": {
        "data": [{"id": 1, "title": "  Road   works ", "at": "2026-01-02 00:00:00", "created_by": {"phone": "0700"}}]
    },
    "https://example.test/api/items?page=2": {"data": [{"id": 2, "title": "School", "at": "2026-02-03 00:00:00"}]},
    "https://example.test/api/items?page=3": {"data": []},
}


class FakeClient:
    user_agent = "test-agent"

    def __init__(self, *_: object, **__: object) -> None:
        self.requested: list[str] = []

    def get(self, url: str, *, conditional: bool = True) -> WebResponse:
        self.requested.append(url)
        body = json.dumps(PAGES[url]).encode()
        return WebResponse(url=url, final_url=url, status=200, headers={}, body=body)

    def close(self) -> None:
        return None


def test_collects_pages_until_empty_and_keeps_raw(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    monkeypatch.setattr(api_collect, "WebClient", FakeClient)
    monkeypatch.setattr(api_collect, "user_agent", lambda: "test-agent")
    result = api_collect.collect_api(
        ApiCollectRequest(
            out_dir=str(tmp_path), source_yaml=SOURCE, module_yaml=MODULE, endpoint="items", max_pages=10, delay=1
        )
    )
    assert result.rows == 2 and result.stopped == "empty_items" and result.errors == ()
    assert sorted(p.name for p in (tmp_path / "raw").iterdir()) == [
        "page-0001.json",
        "page-0002.json",
        "page-0003.json",
    ]
    rows = [json.loads(line) for line in (tmp_path / "records.jsonl").read_text().splitlines()]
    assert rows[0] == {"id": 1, "title": "Road works", "when": "2026-01-02"}
    assert (
        "phone" not in (tmp_path / "records.csv").read_text() and "0700" not in (tmp_path / "records.jsonl").read_text()
    )


def test_the_page_limit_wins_over_more_pages(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    monkeypatch.setattr(api_collect, "WebClient", FakeClient)
    monkeypatch.setattr(api_collect, "user_agent", lambda: "test-agent")
    result = api_collect.collect_api(
        ApiCollectRequest(
            out_dir=str(tmp_path), source_yaml=SOURCE, module_yaml=MODULE, endpoint="items", max_pages=1, delay=1
        )
    )
    assert len(result.pages) == 1 and result.stopped == "max_pages"


def test_unknown_endpoint_is_named(tmp_path: Path) -> None:
    with pytest.raises(ValueError, match="unknown endpoint"):
        api_collect.collect_api(
            ApiCollectRequest(out_dir=str(tmp_path), source_yaml=SOURCE, module_yaml=MODULE, endpoint="nope")
        )
