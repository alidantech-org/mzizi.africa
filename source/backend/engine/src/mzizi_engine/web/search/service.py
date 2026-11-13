"""Collects results across pages from any provider and returns normalised, de-duplicated results."""

from __future__ import annotations

from mzizi_engine.web.search.models import SearchProvider, SearchResult
from mzizi_fetch.web.urls import normalize

MAX_RESULTS = 100


def search(provider: SearchProvider, query: str, count: int, offset: int = 0) -> list[SearchResult]:
    wanted = max(1, min(count, MAX_RESULTS))
    found: list[SearchResult] = []
    seen: set[str] = set()
    position = offset
    while len(found) < wanted:
        page = provider.search(query, position)
        for result in page.results:
            key = normalize(result.url) if result.url.startswith("http") else result.url
            if key not in seen:
                seen.add(key)
                found.append(result)
        position += provider.page_size
        if not page.has_more or not page.results:
            break
    return found[:wanted]
