"""Authenticated submission, cancellation and inspection of isolated script jobs."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, HTTPException, Path, Request

from mzizi_engine.runtime.contracts.script_job import ScriptJob, ScriptRequest
from mzizi_engine.runtime.http.auth import Principal, require
from mzizi_engine.runtime.http.research_access import call_research, research_access
from mzizi_engine.runtime.scripts.workspace import ScriptWorkspace


def scripts_router() -> APIRouter:
    router = APIRouter(prefix="/v1/research/scripts", tags=["Script workspace"])

    def workspace(request: Request) -> ScriptWorkspace:
        service = request.app.state.script_workspace
        if not isinstance(service, ScriptWorkspace):
            raise HTTPException(503, "Set ENGINE_SCRIPT_IMAGE_ID to enable isolated scripts")
        return service

    @router.post("", status_code=202)
    async def submit(body: ScriptRequest, request: Request, principal: Principal = require("engine.edit")) -> ScriptJob:
        access = research_access(request, principal)
        return await call_research(lambda: workspace(request).submit(body, access))

    @router.get("/{jobId}")
    async def get(
        job_id: Annotated[UUID, Path(alias="jobId")], request: Request, principal: Principal = require("engine.read")
    ) -> ScriptJob:
        access = research_access(request, principal)
        return await call_research(lambda: workspace(request).get(job_id, access))

    @router.post("/{jobId}/cancel")
    async def cancel(
        job_id: Annotated[UUID, Path(alias="jobId")], request: Request, principal: Principal = require("engine.edit")
    ) -> ScriptJob:
        access = research_access(request, principal)
        return await call_research(lambda: workspace(request).cancel(job_id, access))

    return router
