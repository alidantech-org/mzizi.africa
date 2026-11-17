"""Contract test: the Artifacts router serves exactly the contract's methods, paths and statuses."""

from __future__ import annotations

from unittest.mock import create_autospec

from fastapi.routing import APIRoute

from mzizi_engine.api.routes.research.artifacts import ResearchArtifactsService, build_research_artifacts_router


def test_routes_match_contract() -> None:
    router = build_research_artifacts_router(create_autospec(ResearchArtifactsService, instance=True))
    served = {
        (method, route.path, route.status_code)
        for route in router.routes
        if isinstance(route, APIRoute)
        for method in route.methods
    }
    assert served == {
        ("POST", "/v1/research/inspect", 200),
    }
