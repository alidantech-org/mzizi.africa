"""Contract test: the Runs router serves exactly the contract's methods, paths and statuses."""

from __future__ import annotations

from unittest.mock import create_autospec

from fastapi.routing import APIRoute

from mzizi_engine.api.routes.runtime.runs import RuntimeRunsService, build_runtime_runs_router


def test_routes_match_contract() -> None:
    router = build_runtime_runs_router(create_autospec(RuntimeRunsService, instance=True))
    served = {
        (method, route.path, route.status_code)
        for route in router.routes
        if isinstance(route, APIRoute)
        for method in route.methods
    }
    assert served == {
        ("GET", "/v1/runs/{runId}", 200),
        ("GET", "/v1/run-events", 200),
        ("GET", "/v1/runs", 200),
    }
