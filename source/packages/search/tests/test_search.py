"""Search providers and the orchestrator against mocked APIs; no credentials, no network."""

from __future__ import annotations

import httpx
import pytest

from mzizi_search import ProviderName, SearchError, SearchOrchestrator, SearchQuery, SearchSettings
from mzizi_search.features.brave.settings import BraveSettings
from mzizi_search.features.google.settings import GoogleSettings


def settings(*, brave: bool = True, google: bool = True, ceiling: int = 100) -> SearchSettings:
    return SearchSettings(
        max_results=ceiling,
        brave=BraveSettings(api_key="secret", timeout_seconds=5.0) if brave else None,
        google=GoogleSettings(api_key="key", engine_id="cx", timeout_seconds=5.0) if google else None,
    )


def orchestrator(
    handler: httpx.MockTransport, *, brave: bool = True, google: bool = True, ceiling: int = 100
) -> SearchOrchestrator:
    return SearchOrchestrator(settings(brave=brave, google=google, ceiling=ceiling), httpx.Client(transport=handler))


def ask(provider: ProviderName, count: int, offset: int = 0) -> SearchQuery:
    return SearchQuery(provider=provider, query="budget", count=count, offset=offset)


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

    outcome = orchestrator(httpx.MockTransport(handler)).search(ask(ProviderName.BRAVE, 25))
    results = outcome.results
    assert len(results) == 25 and results[0].provider is ProviderName.BRAVE
    assert results[0].published.startswith("2026") and results[0].source == "site0.org"
    assert [s["offset"] for s in seen] == ["0", "1"] and seen[0]["token"] == "secret" and results[20].rank == 21


def test_google_pagination_and_totals() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        start = int(request.url.params["start"])
        items = [{"title": f"G{start}-{i}", "link": f"https://g{start}{i}.org/", "snippet": "s"} for i in range(10)]
        return httpx.Response(200, json={"items": items, "searchInformation": {"totalResults": "1234"}})

    from mzizi_search.features.google.provider import GoogleProvider

    client = httpx.Client(transport=httpx.MockTransport(handler))
    page = GoogleProvider(GoogleSettings(api_key="key", engine_id="cx", timeout_seconds=5.0), client).search("q", 0)
    assert page.total == 1234 and page.has_more
    assert len(orchestrator(httpx.MockTransport(handler)).search(ask(ProviderName.GOOGLE, 15)).results) == 15


def test_duplicate_urls_are_removed_across_pages() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        item = {"title": "same", "url": "https://a.org/x?utm_source=z", "description": ""}
        return httpx.Response(200, json={"web": {"results": [item] * 20}})

    assert len(orchestrator(httpx.MockTransport(handler)).search(ask(ProviderName.BRAVE, 5)).results) == 1


def test_the_ceiling_caps_what_a_caller_may_ask_for() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(200, json=brave_reply(int(request.url.params["offset"])))

    outcome = orchestrator(httpx.MockTransport(handler), ceiling=3).search(ask(ProviderName.BRAVE, 50))
    assert len(outcome.results) == 3


def test_an_unconfigured_provider_and_api_errors_are_clear() -> None:
    quiet = orchestrator(httpx.MockTransport(lambda r: httpx.Response(200, json={})), brave=False)
    assert quiet.available() == (ProviderName.GOOGLE,)
    with pytest.raises(SearchError, match="brave search is not configured"):
        quiet.search(ask(ProviderName.BRAVE, 1))
    failing = orchestrator(httpx.MockTransport(lambda r: httpx.Response(401, text="bad key")))
    with pytest.raises(SearchError, match="HTTP 401"):
        failing.search(ask(ProviderName.BRAVE, 1))
