"""The engine's search binding: environment to settings, errors, and the package orchestrator under the runtime."""

from __future__ import annotations

import httpx
import pytest

from mzizi_engine.runtime import CapabilityConfig, EngineRuntime, ExecutionPlan, Exposure, RuntimeConfig
from mzizi_engine.web.search.environment import MAX_RESULTS, orchestrator_for, search_settings
from mzizi_search import ProviderName, SearchError, SearchOrchestrator, SearchQuery

ALL = {"BRAVE_API_KEY": "b", "GOOGLE_CSE_API_KEY": "g", "GOOGLE_CSE_ID": "cx"}


def test_settings_include_only_fully_configured_providers() -> None:
    assert search_settings({}).brave is None and search_settings({}).google is None
    only_key = search_settings({"GOOGLE_CSE_API_KEY": "g"})
    assert only_key.google is None
    full = search_settings(ALL)
    assert full.max_results == MAX_RESULTS and full.brave is not None and full.google is not None


def test_missing_credentials_and_unknown_providers_are_clear() -> None:
    with httpx.Client() as client:
        with pytest.raises(SearchError, match="BRAVE_API_KEY"):
            orchestrator_for("brave", client, {})
        with pytest.raises(SearchError, match="GOOGLE_CSE_API_KEY, GOOGLE_CSE_ID"):
            orchestrator_for("google", client, {})
        with pytest.raises(SearchError, match="unknown"):
            orchestrator_for("bing", client, ALL)


class SearchRuntimeConfig(CapabilityConfig):
    label: str


def test_the_orchestrator_runs_as_a_runtime_capability() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(
            200, json={"web": {"results": [{"title": "t", "url": "https://a.org/", "description": ""}]}}
        )

    client = httpx.Client(transport=httpx.MockTransport(handler))
    orchestrator = orchestrator_for("brave", client, ALL)
    assert isinstance(orchestrator, SearchOrchestrator)
    runtime = EngineRuntime(RuntimeConfig(drain_timeout_seconds=1.0))
    ref = runtime.register(
        "search",
        orchestrator,
        SearchRuntimeConfig(label="pilot"),
        ExecutionPlan(exposure=Exposure.EXPOSED, max_concurrency=2, queue_timeout_seconds=1.0),
    )
    runtime.start()
    query = SearchQuery(provider=ProviderName.BRAVE, query="q", count=1, offset=0)
    outcome = runtime.run(ref, lambda _: orchestrator.search(query), front_door=True)
    runtime.stop()
    assert [result.url for result in outcome.results] == ["https://a.org/"]
