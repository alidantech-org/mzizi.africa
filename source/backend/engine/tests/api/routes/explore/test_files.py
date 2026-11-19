"""Contract test: the Files router serves exactly the contract's methods, paths and statuses."""

from __future__ import annotations

from unittest.mock import create_autospec

from fastapi.routing import APIRoute

from mzizi_engine.api.routes.explore.files import ExploreFilesService, build_explore_files_router


def test_routes_match_contract() -> None:
    router = build_explore_files_router(create_autospec(ExploreFilesService, instance=True))
    served = {
        (method, route.path, route.status_code)
        for route in router.routes
        if isinstance(route, APIRoute)
        for method in route.methods
    }
    assert served == {
        ("GET", "/v1/explore/file", 200),
        ("GET", "/v1/explore/file/data", 200),
        ("GET", "/v1/explore/roots", 200),
        ("GET", "/v1/explore/files", 200),
        ("PUT", "/v1/explore/file", 200),
    }
