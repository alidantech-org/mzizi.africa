"""The `search.web` operation: official provider search, settings from the environment, results written beside the run."""

from __future__ import annotations

from pydantic import BaseModel

from mzizi_crawler.shared.common import out_dir
from mzizi_crawler.shared.export import write_table
from mzizi_crawler.shared.requests import SearchRequest
from mzizi_engine.runtime.assembly.search_settings import orchestrator_for, provider_name
from mzizi_engine.runtime.operations import Operation, OperationRegistry, operation
from mzizi_search import SearchQuery, SearchResult


class SearchResults(BaseModel):
    query: str
    provider: str
    results: tuple[SearchResult, ...]
    files: tuple[str, ...]


def web_search(request: SearchRequest) -> SearchResults:
    import httpx

    query = SearchQuery(
        provider=provider_name(request.engine),
        query=request.query,
        count=max(1, request.count),
        offset=max(0, request.offset),
    )
    with httpx.Client() as http:
        outcome = orchestrator_for(request.engine, http).search(query)
    files = write_table(
        out_dir(request),
        "results",
        list(outcome.results),
        list(SearchResult.model_fields),
        request.formats,
        ordered=True,
    )
    return SearchResults(query=request.query, provider=request.engine, results=outcome.results, files=tuple(files))


def register_search(registry: OperationRegistry) -> None:
    spec = operation("search.web", "Web search through the official Brave or Google API", SearchRequest, web_search, 1)
    registry.register(
        Operation(spec.name, "0.2.0", "mzizi-search", spec.description, spec.run, {"type": "object"}, concurrency=1)
    )
