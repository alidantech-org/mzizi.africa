"""Google's JSON reply, validated into the neutral page contract. This is the only place Google's shape is read."""

from __future__ import annotations

from pydantic import Field

from mzizi_search.features.google.protocol import MAX_START, PAGE_SIZE
from mzizi_search.shared.contracts import External, ProviderName, SearchPage, SearchResult
from mzizi_search.shared.http import host_of


class _Item(External):
    title: str = ""
    link: str = ""
    snippet: str = ""


class _Info(External):
    total_results: str = Field(default="0", alias="totalResults")


class _Reply(External):
    items: tuple[_Item, ...] = ()
    search_information: _Info = Field(default_factory=_Info, alias="searchInformation")


def parse_page(body: bytes, offset: int, start: int) -> SearchPage:
    reply = _Reply.model_validate_json(body)
    results = tuple(
        SearchResult(
            provider=ProviderName.GOOGLE,
            rank=offset + i,
            title=item.title,
            url=item.link,
            description=item.snippet,
            published="",
            source=host_of(item.link),
        )
        for i, item in enumerate(reply.items, start=1)
    )
    count = reply.search_information.total_results
    return SearchPage(
        results=results,
        total=int(count) if count.isdigit() else None,
        has_more=len(results) == PAGE_SIZE and start + PAGE_SIZE <= MAX_START,
    )
