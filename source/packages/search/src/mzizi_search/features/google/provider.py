"""The Google Programmable Search adapter."""

from __future__ import annotations

import httpx

from mzizi_search.features.google.parse import parse_page
from mzizi_search.features.google.protocol import MAX_START, PAGE_SIZE, URL
from mzizi_search.features.google.settings import GoogleSettings
from mzizi_search.shared.contracts import ProviderName, SearchPage
from mzizi_search.shared.http import get_body


class GoogleProvider:
    name = ProviderName.GOOGLE
    page_size = PAGE_SIZE

    def __init__(self, settings: GoogleSettings, client: httpx.Client) -> None:
        self._settings, self._client = settings, client

    def search(self, query: str, offset: int) -> SearchPage:
        start = offset + 1
        if start > MAX_START:
            return SearchPage(results=(), total=None, has_more=False)
        body = get_body(
            self._client,
            URL,
            {
                "key": self._settings.api_key,
                "cx": self._settings.engine_id,
                "q": query,
                "num": PAGE_SIZE,
                "start": start,
            },
            {},
            self._settings.timeout_seconds,
            "google",
        )
        return parse_page(body, offset, start)
