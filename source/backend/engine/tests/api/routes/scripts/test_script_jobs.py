"""Contract test: the Script Jobs router serves exactly the contract's methods, paths and statuses."""

from __future__ import annotations

from unittest.mock import create_autospec

from fastapi.routing import APIRoute

from mzizi_engine.api.routes.scripts.script_jobs import ScriptsScriptJobsService, build_scripts_script_jobs_router


def test_routes_match_contract() -> None:
    router = build_scripts_script_jobs_router(create_autospec(ScriptsScriptJobsService, instance=True))
    served = {
        (method, route.path, route.status_code)
        for route in router.routes
        if isinstance(route, APIRoute)
        for method in route.methods
    }
    assert served == {
        ("POST", "/v1/research/scripts/{jobId}/cancel", 200),
        ("GET", "/v1/research/scripts/{jobId}", 200),
        ("POST", "/v1/research/scripts", 202),
    }
