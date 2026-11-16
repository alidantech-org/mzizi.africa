"""Builds the search package's typed settings from the environment. The package itself never reads the environment."""

from __future__ import annotations

import os
from collections.abc import Mapping

import httpx

from mzizi_search import ProviderName, SearchError, SearchOrchestrator, SearchSettings
from mzizi_search.features.brave.settings import BraveSettings
from mzizi_search.features.google.settings import GoogleSettings

BRAVE_KEY = "BRAVE_API_KEY"
GOOGLE_KEY, GOOGLE_CX = "GOOGLE_CSE_API_KEY", "GOOGLE_CSE_ID"

# Safety ceilings. They are policy and belong in a versioned policy manifest once the runtime reads one.
REQUEST_TIMEOUT_SECONDS = 30.0
MAX_RESULTS = 100


def required_settings(provider: ProviderName) -> tuple[str, ...]:
    """Names of the environment variables a provider needs (names only; values are never shown)."""
    return (BRAVE_KEY,) if provider is ProviderName.BRAVE else (GOOGLE_KEY, GOOGLE_CX)


def provider_name(engine: str) -> ProviderName:
    try:
        return ProviderName(engine)
    except ValueError:
        available = ", ".join(name.value for name in ProviderName)
        raise SearchError(f"unknown search provider {engine!r}; available: {available}") from None


def search_settings(environ: Mapping[str, str]) -> SearchSettings:
    """Settings for every provider whose variables are all set; the others stay unconfigured."""
    brave = environ.get(BRAVE_KEY)
    google, cx = environ.get(GOOGLE_KEY), environ.get(GOOGLE_CX)
    return SearchSettings(
        max_results=MAX_RESULTS,
        brave=BraveSettings(api_key=brave, timeout_seconds=REQUEST_TIMEOUT_SECONDS) if brave else None,
        google=GoogleSettings(api_key=google, engine_id=cx, timeout_seconds=REQUEST_TIMEOUT_SECONDS)
        if google and cx
        else None,
    )


def orchestrator_for(engine: str, client: httpx.Client, environ: Mapping[str, str] | None = None) -> SearchOrchestrator:
    """The orchestrator for one named provider, or a `SearchError` that says what to set."""
    env = os.environ if environ is None else environ
    provider = provider_name(engine)
    missing = [name for name in required_settings(provider) if not env.get(name)]
    if missing:
        raise SearchError(f"{provider.value} search is not configured: set {', '.join(missing)}")
    return SearchOrchestrator(search_settings(env), client)
