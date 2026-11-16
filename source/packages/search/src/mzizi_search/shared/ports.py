"""The port every provider adapter implements; the collector and orchestrator depend on this, not on a provider."""

from __future__ import annotations

from typing import Protocol

from mzizi_search.shared.contracts import ProviderName, SearchPage


class SearchProvider(Protocol):
    name: ProviderName
    page_size: int

    def search(self, query: str, offset: int) -> SearchPage:
        """One page of results starting at result index `offset`."""
        ...
