"""Derivation-relation routes: link, register-with-relation, and lineage reads."""

from __future__ import annotations

import asyncio
import base64
from typing import Any

import httpx
from fastapi import Depends, HTTPException, Request

from mzizi_engine.auth import DatabaseServiceFilesystemClient, Principal, authenticated
from mzizi_engine.filesystem import (
    FilesystemService,
    PermissionDenied,
    Repository,
    ancestry,
    derivatives,
    register_derived,
    relate,
)
from mzizi_engine.filesystem_api._shared import DerivedIn, RelationIn, call, router


@router.post("/relations", status_code=201)
async def add_relation(body: RelationIn, request: Request, principal: Principal = Depends(authenticated)) -> dict:
    test_client = getattr(request.app.state, "filesystem_database_client", None)
    settings = request.app.state.settings
    try:
        if test_client is not None:
            return await asyncio.to_thread(
                call,
                request,
                principal,
                lambda service, repo, actor: {
                    "created": relate(
                        service,
                        body.source_version_id,
                        body.derived_version_id,
                        relation=body.relation,
                        actor=actor,
                        engine_job_id=body.engine_job_id,
                    )
                },
            )
        if not settings.database_service_url or not settings.database_service_token:
            raise HTTPException(503, "DATABASE_SERVICE_URL and DATABASE_SERVICE_TOKEN are required for file relations")
        client = DatabaseServiceFilesystemClient(settings.database_service_url, settings.database_service_token)
        created = await client.link_relation(
            principal.account_id, body.source_version_id, body.derived_version_id, body.relation, body.engine_job_id
        )
        return {"created": created}
    except PermissionDenied as error:
        raise HTTPException(403, str(error)) from None
    except httpx.HTTPStatusError as error:
        if error.response.status_code == 403:
            raise HTTPException(403, error.response.text) from None
        if error.response.status_code == 404:
            raise HTTPException(404, error.response.text) from None
        if error.response.status_code == 400:
            raise HTTPException(422, error.response.text) from None
        raise HTTPException(503, "database service rejected file relation") from None
    except httpx.HTTPError as error:
        raise HTTPException(503, f"database service unavailable: {type(error).__name__}") from None


@router.post("/derived", status_code=201)
async def add_derived(body: DerivedIn, request: Request, principal: Principal = Depends(authenticated)) -> dict:
    def work(service: FilesystemService, repo: Repository, actor: Any) -> Any:
        reg = register_derived(
            service,
            body.sources,
            body.folder_id,
            body.name,
            base64.b64decode(body.content_base64),
            relation=body.relation,
            actor=actor,
            engine_job_id=body.engine_job_id,
            code=body.code,
            retention=body.retention,
        )
        if reg.outcome in ("failed", "conflict", "denied", "blocked"):
            raise HTTPException(403 if reg.outcome == "denied" else 409, reg.detail or reg.outcome)
        return {"outcome": reg.outcome, "file_id": reg.file_id, "version_id": reg.version_id, "revision": reg.revision}

    return await asyncio.to_thread(call, request, principal, work)


@router.get("/versions/{version_id}/lineage")
async def lineage(version_id: str, request: Request, principal: Principal = Depends(authenticated)) -> dict:
    test_client = getattr(request.app.state, "filesystem_database_client", None)
    settings = request.app.state.settings
    try:
        if test_client is not None:

            def test_work(service: FilesystemService, repo: Repository, actor: Any) -> Any:
                version = repo.get_version(version_id)
                if version is None:
                    raise LookupError("no such version")
                service.authorizer.for_record(actor, "filesystem.read", "filesystem.files", version["file_id"])
                return {"ancestry": ancestry(service, version_id), "derived": derivatives(service, version_id)}

            return await asyncio.to_thread(call, request, principal, test_work)
        if not settings.database_service_url or not settings.database_service_token:
            raise HTTPException(503, "DATABASE_SERVICE_URL and DATABASE_SERVICE_TOKEN are required for lineage reads")
        client = DatabaseServiceFilesystemClient(settings.database_service_url, settings.database_service_token)
        return await client.get_lineage(principal.account_id, version_id)
    except httpx.HTTPStatusError as error:
        if error.response.status_code == 403:
            raise HTTPException(403, error.response.text) from None
        if error.response.status_code == 404:
            raise HTTPException(404, "no such version") from None
        if error.response.status_code == 400:
            raise HTTPException(422, error.response.text) from None
        raise HTTPException(503, "database service rejected lineage read") from None
    except httpx.HTTPError as error:
        raise HTTPException(503, f"database service unavailable: {type(error).__name__}") from None
