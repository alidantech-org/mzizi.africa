"""Provider-independent search contracts."""

from __future__ import annotations

from typing import Protocol

from pydantic import BaseModel, ConfigDict


class Frozen(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")


class Loose(BaseModel):
    """Provider response shapes: unknown fields are ignored, the provider owns them."""

    model_config = ConfigDict(frozen=True, extra="ignore")


class SearchResult(Frozen):
    provider: str
    rank: int
    title: str
    url: str
    description: str
    published: str
    source: str  # the result's host


class SearchPage(Frozen):
    results: tuple[SearchResult, ...]
    total: int | None
    has_more: bool


class SearchError(RuntimeError):
    """A provider call failed or the provider is not configured."""


class SearchProvider(Protocol):
    name: str
    page_size: int

    def search(self, query: str, offset: int) -> SearchPage:
        """One page of results starting at result index `offset`."""
        ...
