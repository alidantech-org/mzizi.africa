"""Provider-independent search contracts: what is asked, what a page holds and what comes back."""

from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class Frozen(BaseModel):
    model_config = ConfigDict(frozen=True, strict=True, extra="forbid")


class External(BaseModel):
    """A provider's response shape, validated at the parse edge: unknown fields are ignored, the provider owns them."""

    model_config = ConfigDict(frozen=True, extra="ignore", populate_by_name=True)


class ProviderName(StrEnum):
    BRAVE = "brave"
    GOOGLE = "google"


class SearchResult(Frozen):
    provider: ProviderName
    rank: int
    title: str
    url: str
    description: str
    published: str
    #: The result's host.
    source: str


class SearchPage(Frozen):
    results: tuple[SearchResult, ...]
    total: int | None
    has_more: bool


class SearchQuery(Frozen):
    provider: ProviderName
    query: str
    count: int = Field(ge=1)
    offset: int = Field(ge=0)


class SearchOutcome(Frozen):
    query: str
    provider: ProviderName
    results: tuple[SearchResult, ...]
