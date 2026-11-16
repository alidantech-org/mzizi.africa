"""The Brave Search adapter."""

from __future__ import annotations

import httpx

from mzizi_search.features.brave.parse import parse_page
from mzizi_search.features.brave.protocol import MAX_PAGES, PAGE_SIZE, URL
from mzizi_search.features.brave.settings import BraveSettings
from mzizi_search.shared.contracts import ProviderName, SearchPage
from mzizi_search.shared.http import get_body


class BraveProvider:
    name = ProviderName.BRAVE
    page_size = PAGE_SIZE

    def __init__(self, settings: BraveSettings, client: httpx.Client) -> None:
        self._settings, self._client = settings, client

    def search(self, query: str, offset: int) -> SearchPage:
        page = offset // PAGE_SIZE
        if page >= MAX_PAGES:
            return SearchPage(results=(), total=None, has_more=False)
        body = get_body(
            self._client,
            URL,
            {"q": query, "count": PAGE_SIZE, "offset": page},
            {"X-Subscription-Token": self._settings.api_key, "Accept": "application/json"},
            self._settings.timeout_seconds,
            "brave",
        )
        return parse_page(body, offset, page)
