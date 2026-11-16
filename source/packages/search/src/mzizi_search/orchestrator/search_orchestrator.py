"""SearchOrchestrator: the package's single public class. The engine registers it as a runtime capability."""

from __future__ import annotations

import httpx

from mzizi_search.features.brave.provider import BraveProvider
from mzizi_search.features.collect.collect import collect
from mzizi_search.features.google.provider import GoogleProvider
from mzizi_search.orchestrator.settings import SearchSettings
from mzizi_search.shared.contracts import ProviderName, SearchOutcome, SearchQuery
from mzizi_search.shared.errors import SearchError
from mzizi_search.shared.ports import SearchProvider


class SearchOrchestrator:
    def __init__(self, settings: SearchSettings, client: httpx.Client) -> None:
        self._settings = settings
        self._providers: dict[ProviderName, SearchProvider] = {}
        if settings.brave is not None:
            self._providers[ProviderName.BRAVE] = BraveProvider(settings.brave, client)
        if settings.google is not None:
            self._providers[ProviderName.GOOGLE] = GoogleProvider(settings.google, client)

    def available(self) -> tuple[ProviderName, ...]:
        return tuple(self._providers)

    def search(self, query: SearchQuery) -> SearchOutcome:
        provider = self._providers.get(query.provider)
        if provider is None:
            raise SearchError(f"{query.provider.value} search is not configured")
        results = collect(provider, query.query, query.count, query.offset, self._settings.max_results)
        return SearchOutcome(query=query.query, provider=query.provider, results=results)

    def start(self) -> None:
        """Nothing to open: the HTTP client belongs to the caller."""

    def stop(self) -> None:
        """Nothing to close."""
