"""Contract test: the Captures router serves exactly the contract's methods, paths and statuses."""

from __future__ import annotations

from unittest.mock import create_autospec

from fastapi.routing import APIRoute

from mzizi_engine.api.routes.staging.captures import StagingCapturesService, build_staging_captures_router


def test_routes_match_contract() -> None:
    router = build_staging_captures_router(create_autospec(StagingCapturesService, instance=True))
    served = {
        (method, route.path, route.status_code)
        for route in router.routes
        if isinstance(route, APIRoute)
        for method in route.methods
    }
    assert served == {
        ("GET", "/v1/captures/{captureId}", 200),
        ("GET", "/v1/captures", 200),
    }
