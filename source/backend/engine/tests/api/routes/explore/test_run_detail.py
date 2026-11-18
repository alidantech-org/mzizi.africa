"""Contract test: the Run Detail router serves exactly the contract's methods, paths and statuses."""

from __future__ import annotations

from unittest.mock import create_autospec

from fastapi.routing import APIRoute

from mzizi_engine.api.routes.explore.run_detail import ExploreRunDetailService, build_explore_run_detail_router


def test_routes_match_contract() -> None:
    router = build_explore_run_detail_router(create_autospec(ExploreRunDetailService, instance=True))
    served = {
        (method, route.path, route.status_code)
        for route in router.routes
        if isinstance(route, APIRoute)
        for method in route.methods
    }
    assert served == {
        ("GET", "/v1/explore/jobs/{jobId}", 200),
    }
