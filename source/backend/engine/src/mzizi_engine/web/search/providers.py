"""Brave Search API and Google Programmable Search (Custom Search JSON API) behind one interface."""

from __future__ import annotations

import os
from urllib.parse import urlparse

import httpx

from mzizi_engine.web.search.models import Loose, SearchError, SearchPage, SearchProvider, SearchResult

BRAVE_URL = "https://api.search.brave.com/res/v1/web/search"
BRAVE_KEY = "BRAVE_API_KEY"
BRAVE_PAGE, BRAVE_MAX_PAGES = 20, 10
GOOGLE_URL = "https://www.googleapis.com/customsearch/v1"
GOOGLE_KEY, GOOGLE_CX = "GOOGLE_CSE_API_KEY", "GOOGLE_CSE_ID"
GOOGLE_PAGE, GOOGLE_MAX_START = 10, 91
TIMEOUT = 30.0


class _BraveItem(Loose):
    title: str = ""
    url: str = ""
    description: str = ""
    page_age: str = ""
    age: str = ""


class _BraveWeb(Loose):
    results: tuple[_BraveItem, ...] = ()


class _BraveReply(Loose):
    web: _BraveWeb = _BraveWeb()


class _GoogleItem(Loose):
    title: str = ""
    link: str = ""
    snippet: str = ""


class _GoogleInfo(Loose):
    totalResults: str = "0"


class _GoogleReply(Loose):
    items: tuple[_GoogleItem, ...] = ()
    searchInformation: _GoogleInfo = _GoogleInfo()


def _host(url: str) -> str:
    return (urlparse(url).hostname or "").lower()


def _get(client: httpx.Client, url: str, params: dict[str, str | int], headers: dict[str, str], provider: str) -> bytes:
    try:
        response = client.get(url, params=params, headers=headers, timeout=TIMEOUT)
    except httpx.HTTPError as problem:
        raise SearchError(f"{provider}: {type(problem).__name__}: {str(problem)[:150]}") from problem
    if response.status_code >= 400:
        raise SearchError(f"{provider}: HTTP {response.status_code}: {response.text[:200]}")
    return response.content


class BraveProvider:
    name = "brave"
    page_size = BRAVE_PAGE

    def __init__(self, api_key: str, client: httpx.Client) -> None:
        self.api_key, self.client = api_key, client

    def search(self, query: str, offset: int) -> SearchPage:
        page = offset // BRAVE_PAGE
        if page >= BRAVE_MAX_PAGES:
            return SearchPage(results=(), total=None, has_more=False)
        body = _get(
            self.client,
            BRAVE_URL,
            {"q": query, "count": BRAVE_PAGE, "offset": page},
            {"X-Subscription-Token": self.api_key, "Accept": "application/json"},
            "brave",
        )
        items = _BraveReply.model_validate_json(body).web.results
        results = tuple(
            SearchResult(
                provider="brave",
                rank=offset + i,
                title=r.title,
                url=r.url,
                description=r.description,
                published=r.page_age or r.age,
                source=_host(r.url),
            )
            for i, r in enumerate(items, start=1)
        )
        return SearchPage(results=results, total=None, has_more=len(items) == BRAVE_PAGE and page + 1 < BRAVE_MAX_PAGES)


class GoogleProvider:
    name = "google"
    page_size = GOOGLE_PAGE

    def __init__(self, api_key: str, cx: str, client: httpx.Client) -> None:
        self.api_key, self.cx, self.client = api_key, cx, client

    def search(self, query: str, offset: int) -> SearchPage:
        start = offset + 1
        if start > GOOGLE_MAX_START:
            return SearchPage(results=(), total=None, has_more=False)
        body = _get(
            self.client,
            GOOGLE_URL,
            {"key": self.api_key, "cx": self.cx, "q": query, "num": GOOGLE_PAGE, "start": start},
            {},
            "google",
        )
        reply = _GoogleReply.model_validate_json(body)
        results = tuple(
            SearchResult(
                provider="google",
                rank=offset + i,
                title=r.title,
                url=r.link,
                description=r.snippet,
                published="",
                source=_host(r.link),
            )
            for i, r in enumerate(reply.items, start=1)
        )
        total = int(reply.searchInformation.totalResults) if reply.searchInformation.totalResults.isdigit() else None
        return SearchPage(
            results=results,
            total=total,
            has_more=len(results) == GOOGLE_PAGE and start + GOOGLE_PAGE <= GOOGLE_MAX_START,
        )


def required_settings(provider: str) -> tuple[str, ...]:
    return (BRAVE_KEY,) if provider == "brave" else (GOOGLE_KEY, GOOGLE_CX)


def configured(provider: str) -> bool:
    return all(os.environ.get(name) for name in required_settings(provider))


def make_provider(name: str, client: httpx.Client) -> SearchProvider:
    if name not in ("brave", "google"):
        raise SearchError(f"unknown search provider {name!r}; available: brave, google")
    missing = [setting for setting in required_settings(name) if not os.environ.get(setting)]
    if missing:
        raise SearchError(f"{name} search is not configured: set {', '.join(missing)}")
    if name == "brave":
        return BraveProvider(os.environ[BRAVE_KEY], client)
    return GoogleProvider(os.environ[GOOGLE_KEY], os.environ[GOOGLE_CX], client)
