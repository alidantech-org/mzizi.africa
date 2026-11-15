"""Contract test: the Health router serves exactly the contract's methods, paths and statuses."""

from __future__ import annotations

from unittest.mock import create_autospec

from fastapi.routing import APIRoute

from mzizi_engine.api.routes.system.health import SystemHealthService, build_system_health_router


def test_routes_match_contract() -> None:
    router = build_system_health_router(create_autospec(SystemHealthService, instance=True))
    served = {
        (method, route.path, route.status_code)
        for route in router.routes
        if isinstance(route, APIRoute)
        for method in route.methods
    }
    assert served == {
        ("GET", "/health", 200),
        ("GET", "/ready", 200),
    }
