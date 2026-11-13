"""Search providers against mocked APIs; no credentials, no network."""

from __future__ import annotations

import httpx
import pytest

from mzizi_engine.web.search.models import SearchError
from mzizi_engine.web.search.providers import BraveProvider, GoogleProvider, make_provider
from mzizi_engine.web.search.service import search


def brave_reply(page: int) -> dict[str, object]:
    return {
        "web": {
            "results": [
                {
                    "title": f"T{page}-{i}",
                    "url": f"https://site{i}.org/p{page}",
                    "description": "d",
                    "page_age": "2026-01-02T00:00:00",
                }
                for i in range(20)
            ]
        }
    }


def test_brave_normalises_results_and_paginates() -> None:
    seen: list[dict[str, str]] = []

    def handler(request: httpx.Request) -> httpx.Response:
        seen.append({**request.url.params, "token": request.headers["x-subscription-token"]})
        return httpx.Response(200, json=brave_reply(int(request.url.params["offset"])))

    with httpx.Client(transport=httpx.MockTransport(handler)) as client:
        results = search(BraveProvider("secret", client), "budget", 25)
    assert (
        len(results) == 25
        and results[0].provider == "brave"
        and results[0].published.startswith("2026")
        and results[0].source == "site0.org"
    )
    assert [s["offset"] for s in seen] == ["0", "1"] and seen[0]["token"] == "secret" and results[20].rank == 21


def test_google_pagination_and_totals() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        start = int(request.url.params["start"])
        items = [{"title": f"G{start}-{i}", "link": f"https://g{start}{i}.org/", "snippet": "s"} for i in range(10)]
        return httpx.Response(200, json={"items": items, "searchInformation": {"totalResults": "1234"}})

    with httpx.Client(transport=httpx.MockTransport(handler)) as client:
        provider = GoogleProvider("key", "cx", client)
        assert provider.search("q", 0).total == 1234
        assert len(search(provider, "q", 15)) == 15


def test_duplicate_urls_are_removed_across_pages() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(
            200,
            json={
                "web": {"results": [{"title": "same", "url": "https://a.org/x?utm_source=z", "description": ""}] * 20}
            },
        )

    with httpx.Client(transport=httpx.MockTransport(handler)) as client:
        assert len(search(BraveProvider("k", client), "q", 5)) == 1


def test_missing_credentials_and_api_errors_are_clear(monkeypatch: pytest.MonkeyPatch) -> None:
    for name in ("BRAVE_API_KEY", "GOOGLE_CSE_API_KEY", "GOOGLE_CSE_ID"):
        monkeypatch.delenv(name, raising=False)
    with httpx.Client() as client:
        with pytest.raises(SearchError, match="BRAVE_API_KEY"):
            make_provider("brave", client)
        with pytest.raises(SearchError, match="GOOGLE_CSE_API_KEY, GOOGLE_CSE_ID"):
            make_provider("google", client)
        with pytest.raises(SearchError, match="unknown"):
            make_provider("bing", client)
    failing = httpx.Client(transport=httpx.MockTransport(lambda r: httpx.Response(401, text="bad key")))
    with pytest.raises(SearchError, match="HTTP 401"):
        BraveProvider("k", failing).search("q", 0)
