"""Collects results across pages from any provider and returns normalised, de-duplicated results."""

from __future__ import annotations

from mzizi_fetch.web.urls import normalize
from mzizi_search.shared.contracts import SearchResult
from mzizi_search.shared.ports import SearchProvider


def collect(provider: SearchProvider, query: str, count: int, offset: int, ceiling: int) -> tuple[SearchResult, ...]:
    """Up to `count` results (never more than `ceiling`), starting at result index `offset`."""
    wanted = max(1, min(count, ceiling))
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
    return tuple(found[:wanted])
