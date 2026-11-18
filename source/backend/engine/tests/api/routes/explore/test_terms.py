"""Contract test: the Terms router serves exactly the contract's methods, paths and statuses."""

from __future__ import annotations

from unittest.mock import create_autospec

from fastapi.routing import APIRoute

from mzizi_engine.api.routes.explore.terms import ExploreTermsService, build_explore_terms_router


def test_routes_match_contract() -> None:
    router = build_explore_terms_router(create_autospec(ExploreTermsService, instance=True))
    served = {
        (method, route.path, route.status_code)
        for route in router.routes
        if isinstance(route, APIRoute)
        for method in route.methods
    }
    assert served == {
        ("GET", "/v1/explore/terms", 200),
        ("POST", "/v1/explore/terms/tag", 200),
    }
