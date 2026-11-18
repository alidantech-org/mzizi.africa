"""Contract test: the Csv Preparation router serves exactly the contract's methods, paths and statuses."""

from __future__ import annotations

from unittest.mock import create_autospec

from fastapi.routing import APIRoute

from mzizi_engine.api.routes.explore.csv_preparation import (
    ExploreCsvPreparationService,
    build_explore_csv_preparation_router,
)


def test_routes_match_contract() -> None:
    router = build_explore_csv_preparation_router(create_autospec(ExploreCsvPreparationService, instance=True))
    served = {
        (method, route.path, route.status_code)
        for route in router.routes
        if isinstance(route, APIRoute)
        for method in route.methods
    }
    assert served == {
        ("POST", "/v1/explore/csv/prepare", 200),
    }
