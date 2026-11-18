"""Contract test: the Database router serves exactly the contract's methods, paths and statuses."""

from __future__ import annotations

from unittest.mock import create_autospec

from fastapi.routing import APIRoute

from mzizi_engine.api.routes.explore.database import ExploreDatabaseService, build_explore_database_router


def test_routes_match_contract() -> None:
    router = build_explore_database_router(create_autospec(ExploreDatabaseService, instance=True))
    served = {
        (method, route.path, route.status_code)
        for route in router.routes
        if isinstance(route, APIRoute)
        for method in route.methods
    }
    assert served == {
        ("GET", "/v1/explore/db/lists/{domain}/{code}", 200),
        ("GET", "/v1/explore/db/tables/{domain}/{table}", 200),
        ("GET", "/v1/explore/db/lists", 200),
        ("GET", "/v1/explore/db/domains", 200),
    }
