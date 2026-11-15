"""Contract test: the Jobs router serves exactly the contract's methods, paths and statuses."""

from __future__ import annotations

from unittest.mock import create_autospec

from fastapi.routing import APIRoute

from mzizi_engine.api.routes.engine.jobs import EngineJobsService, build_engine_jobs_router


def test_routes_match_contract() -> None:
    router = build_engine_jobs_router(create_autospec(EngineJobsService, instance=True))
    served = {
        (method, route.path, route.status_code)
        for route in router.routes
        if isinstance(route, APIRoute)
        for method in route.methods
    }
    assert served == {
        ("POST", "/v1/jobs/{jobId}/cancel", 200),
        ("GET", "/v1/jobs/{jobId}", 200),
        ("GET", "/capabilities", 200),
        ("GET", "/v1/jobs", 200),
        ("POST", "/v1/jobs", 202),
    }
