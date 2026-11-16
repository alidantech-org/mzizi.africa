"""The one place a provider's HTTP call is made and its failures are turned into `SearchError`."""

from __future__ import annotations

from urllib.parse import urlparse

import httpx

from mzizi_search.shared.errors import SearchError


def host_of(url: str) -> str:
    return (urlparse(url).hostname or "").lower()


def get_body(
    client: httpx.Client,
    url: str,
    params: dict[str, str | int],
    headers: dict[str, str],
    timeout_seconds: float,
    provider: str,
) -> bytes:
    try:
        response = client.get(url, params=params, headers=headers, timeout=timeout_seconds)
    except httpx.HTTPError as problem:
        raise SearchError(f"{provider}: {type(problem).__name__}: {str(problem)[:150]}") from problem
    if response.status_code >= 400:
        raise SearchError(f"{provider}: HTTP {response.status_code}: {response.text[:200]}")
    return response.content
