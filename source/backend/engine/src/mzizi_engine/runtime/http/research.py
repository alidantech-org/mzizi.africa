"""Authenticated research endpoints over verified engine run artifacts."""

import asyncio
from collections.abc import Callable

from fastapi import APIRouter, HTTPException, Request
from pydantic import ValidationError

from mzizi_engine.api.schemas.api.research.models.artifact_metadata import ArtifactMetadata as WireArtifactMetadata
from mzizi_engine.api.schemas.api.research.models.artifact_ref import ArtifactRef as WireArtifactRef
from mzizi_engine.config import ConfigError
from mzizi_engine.runtime.assembly.artifact_replay import replay_artifact
from mzizi_engine.runtime.assembly.table_draft import table_draft
from mzizi_engine.runtime.contracts.artifact_replay import ArtifactReplayReport, ArtifactReplayRequest
from mzizi_engine.runtime.contracts.table_draft import TableDraftReport, TableDraftRequest
from mzizi_engine.runtime.http.auth import Principal, require
from mzizi_engine.runtime.runs.artifacts import (
    ArtifactAccess,
    ArtifactReader,
    ArtifactReadError,
    ArtifactRef,
)


def _access(request: Request, principal: Principal) -> ArtifactAccess:
    service = request.app.state.settings.auth == "service"
    if principal.account_id is None and not service:
        raise HTTPException(401, "Artifact access requires an authenticated service or account")
    return ArtifactAccess(account_id=principal.account_id, service=service)


async def _call[R](action: Callable[[], R]) -> R:
    try:
        return await asyncio.to_thread(action)
    except ArtifactReadError as error:
        raise HTTPException(error.status, str(error)) from error
    except ConfigError as error:
        raise HTTPException(503, str(error)) from error


def research_router(reader: ArtifactReader) -> APIRouter:
    router = APIRouter(prefix="/v1/research", tags=["Research artifacts"])

    @router.post("/inspect")
    async def inspect_artifact(
        ref: WireArtifactRef, request: Request, principal: Principal = require("engine.read")
    ) -> WireArtifactMetadata:
        access = _access(request, principal)
        try:
            reference = ArtifactRef.model_validate(ref.model_dump())
        except ValidationError as error:
            raise HTTPException(422, "Invalid run artifact reference") from error
        metadata = await _call(lambda: reader.read(reference, access)[0])
        return WireArtifactMetadata.model_validate(metadata.model_dump(mode="json"))

    @router.post("/replay")
    async def run_replay(
        body: ArtifactReplayRequest, request: Request, principal: Principal = require("engine.edit")
    ) -> ArtifactReplayReport:
        access = _access(request, principal)
        return await _call(lambda: replay_artifact(reader, access, body))

    @router.post("/table-draft")
    async def draft_pdf_table(
        body: TableDraftRequest, request: Request, principal: Principal = require("engine.edit")
    ) -> TableDraftReport:
        access = _access(request, principal)
        return await _call(lambda: table_draft(reader, access, body))

    return router
