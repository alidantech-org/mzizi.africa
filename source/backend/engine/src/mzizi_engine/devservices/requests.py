"""Typed capability requests for the dev services: the parsing boundary for their payloads."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict

DEFAULT_LIMIT = 10


class Request(BaseModel):
    model_config = ConfigDict(frozen=True, extra="ignore")


class RunRequest(Request):
    """A run folder (a crawl or PDF output folder) to load or index."""

    source: str


class FindRequest(Request):
    collection: str
    query: str = "{}"
    limit: int = DEFAULT_LIMIT


class SearchRequest(Request):
    query: str
    limit: int = DEFAULT_LIMIT
    run_id: str = ""


class ClassifyRequest(Request):
    input: str
    labels: str


class NoRequest(Request):
    """Capabilities that take nothing."""
