"""Builds the search package's typed settings from the engine configuration. The package itself never reads the environment."""

from __future__ import annotations

import httpx

from mzizi_engine.config import SEARCH_VARIABLES, EngineConfig
from mzizi_search import ProviderName, SearchError, SearchOrchestrator, SearchSettings
from mzizi_search.features.brave.settings import BraveSettings
from mzizi_search.features.google.settings import GoogleSettings

# Safety ceilings. They are policy and belong in a versioned policy manifest once the runtime reads one.
REQUEST_TIMEOUT_SECONDS = 30.0
MAX_RESULTS = 100


def required_settings(provider: ProviderName) -> tuple[str, ...]:
    """Names of the environment variables a provider needs (names only; values are never shown)."""
    return SEARCH_VARIABLES[provider.value]


def provider_name(engine: str) -> ProviderName:
    try:
        return ProviderName(engine)
    except ValueError:
        available = ", ".join(name.value for name in ProviderName)
        raise SearchError(f"unknown search provider {engine!r}; available: {available}") from None


def search_settings(config: EngineConfig) -> SearchSettings:
    """Settings for every provider whose variables are all set; the others stay unconfigured."""
    keys = config.search
    return SearchSettings(
        max_results=MAX_RESULTS,
        brave=BraveSettings(api_key=keys.brave_key, timeout_seconds=REQUEST_TIMEOUT_SECONDS)
        if keys.brave_key
        else None,
        google=GoogleSettings(
            api_key=keys.google_key, engine_id=keys.google_cx, timeout_seconds=REQUEST_TIMEOUT_SECONDS
        )
        if keys.google_key and keys.google_cx
        else None,
    )


def orchestrator_for(engine: str, client: httpx.Client, config: EngineConfig | None = None) -> SearchOrchestrator:
    """The orchestrator for one named provider, or a `SearchError` that says what to set."""
    config = config or EngineConfig.load()
    provider = provider_name(engine)
    missing = config.search_missing(provider.value)
    if missing:
        raise SearchError(f"{provider.value} search is not configured: set {', '.join(missing)}")
    return SearchOrchestrator(search_settings(config), client)
