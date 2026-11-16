"""Brave's JSON reply, validated into the neutral page contract. This is the only place Brave's shape is read."""

from __future__ import annotations

from pydantic import Field

from mzizi_search.features.brave.protocol import MAX_PAGES, PAGE_SIZE
from mzizi_search.shared.contracts import External, ProviderName, SearchPage, SearchResult
from mzizi_search.shared.http import host_of


class _Item(External):
    title: str = ""
    url: str = ""
    description: str = ""
    page_age: str = ""
    age: str = ""


class _Web(External):
    results: tuple[_Item, ...] = ()


class _Reply(External):
    web: _Web = Field(default_factory=_Web)


def parse_page(body: bytes, offset: int, page: int) -> SearchPage:
    items = _Reply.model_validate_json(body).web.results
    results = tuple(
        SearchResult(
            provider=ProviderName.BRAVE,
            rank=offset + i,
            title=item.title,
            url=item.url,
            description=item.description,
            published=item.page_age or item.age,
            source=host_of(item.url),
        )
        for i, item in enumerate(items, start=1)
    )
    return SearchPage(results=results, total=None, has_more=len(items) == PAGE_SIZE and page + 1 < MAX_PAGES)
