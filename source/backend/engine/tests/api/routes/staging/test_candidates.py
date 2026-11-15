"""Contract test: the Candidates router serves exactly the contract's methods, paths and statuses."""

from __future__ import annotations

from unittest.mock import create_autospec

from fastapi.routing import APIRoute

from mzizi_engine.api.routes.staging.candidates import StagingCandidatesService, build_staging_candidates_router


def test_routes_match_contract() -> None:
    router = build_staging_candidates_router(create_autospec(StagingCandidatesService, instance=True))
    served = {
        (method, route.path, route.status_code)
        for route in router.routes
        if isinstance(route, APIRoute)
        for method in route.methods
    }
    assert served == {
        ("POST", "/v1/candidates/{candidateId}/decision", 200),
        ("GET", "/v1/candidates/{candidateId}", 200),
        ("GET", "/v1/candidates", 200),
    }
