"""Folder and file routes: read, create, access transitions, and downloads."""

from __future__ import annotations

import asyncio
import os
from typing import Any

import httpx
from fastapi import Depends, HTTPException, Request

from mzizi_filesystem import is_anonymously_readable

from ..auth import DatabaseServiceFilesystemClient, Principal, authenticated
from ..filesystem import FilesystemService, PermissionDenied, Repository, download_url, transition_folder_access
from ._shared import AccessIn, FolderIn, call, router, store_for


@router.get("/folders/{folder_id}")
async def get_folder(folder_id: str, request: Request, principal: Principal = Depends(authenticated)) -> dict:
    test_client = getattr(request.app.state, "filesystem_database_client", None)
    settings = request.app.state.settings
    if test_client is None and (not settings.database_service_url or not settings.database_service_token):
        raise HTTPException(503, "DATABASE_SERVICE_URL and DATABASE_SERVICE_TOKEN are required for filesystem reads")
    try:
        if test_client is not None:
            return await test_client.get_folder(principal.account_id, folder_id)
        client = DatabaseServiceFilesystemClient(settings.database_service_url, settings.database_service_token)
        return await client.get_folder(principal.account_id, folder_id)
    except PermissionDenied as error:
        raise HTTPException(403, str(error)) from None
    except LookupError:
        raise HTTPException(404, "no such folder") from None
    except httpx.HTTPStatusError as error:
        status = error.response.status_code
        if status == 403:
            raise HTTPException(403, error.response.text) from None
        if status == 404:
            raise HTTPException(404, "no such folder") from None
        if status == 400:
            raise HTTPException(422, error.response.text) from None
        raise HTTPException(503, "database service rejected folder read") from None
    except httpx.HTTPError as error:
        raise HTTPException(503, f"database service unavailable: {type(error).__name__}") from None


@router.post("/folders", status_code=201)
async def create_folder(body: FolderIn, request: Request, principal: Principal = Depends(authenticated)) -> dict:
    fields = body.model_dump(exclude={"parent_id", "name"})
    test_client = getattr(request.app.state, "filesystem_database_client", None)
    settings = request.app.state.settings
    if test_client is None and (not settings.database_service_url or not settings.database_service_token):
        raise HTTPException(
            503, "DATABASE_SERVICE_URL and DATABASE_SERVICE_TOKEN are required for filesystem metadata writes"
        )
    try:
        if test_client is not None:
            return await test_client.create_folder(principal.account_id, body.parent_id, body.name, fields)
        client = DatabaseServiceFilesystemClient(settings.database_service_url, settings.database_service_token)
        return await client.create_folder(principal.account_id, body.parent_id, body.name, fields)
    except PermissionDenied as error:
        # Test-only database-owner seams raise the same domain error as the service's 403 response.
        raise HTTPException(403, str(error)) from None
    except httpx.HTTPStatusError as error:
        status = error.response.status_code
        if status in (400, 422):
            raise HTTPException(422, error.response.text) from None
        if status == 403:
            raise HTTPException(403, error.response.text) from None
        if status == 409:
            raise HTTPException(409, error.response.text) from None
        raise HTTPException(503, "database service rejected folder creation") from None
    except httpx.HTTPError as error:
        raise HTTPException(503, f"database service unavailable: {type(error).__name__}") from None


@router.post("/folders/{folder_id}/access")
async def change_access(
    folder_id: str, body: AccessIn, request: Request, principal: Principal = Depends(authenticated)
) -> dict:
    """Preview (default) or apply an access transition: content moves between S3 prefixes and the registry changes in one commit."""

    def work(service: FilesystemService, repo: Repository, actor: Any) -> Any:
        report = transition_folder_access(
            service, folder_id, body.access, actor=actor, authorization=body.authorization, dry_run=not body.apply
        )
        if report.error:
            raise HTTPException(409, report.error)
        return {
            "dry_run": report.dry_run,
            "versions_relocated": report.versions_relocated,
            "superseded_keys_pending_cleanup": len(report.superseded_keys),
        }

    return await asyncio.to_thread(call, request, principal, work)


@router.get("/files/{file_id}")
async def get_file(file_id: str, request: Request, principal: Principal = Depends(authenticated)) -> dict:
    test_client = getattr(request.app.state, "filesystem_database_client", None)
    settings = request.app.state.settings
    if test_client is None and (not settings.database_service_url or not settings.database_service_token):
        raise HTTPException(503, "DATABASE_SERVICE_URL and DATABASE_SERVICE_TOKEN are required for filesystem reads")
    try:
        if test_client is not None:
            return await test_client.get_file(principal.account_id, file_id)
        client = DatabaseServiceFilesystemClient(settings.database_service_url, settings.database_service_token)
        return await client.get_file(principal.account_id, file_id)
    except PermissionDenied as error:
        raise HTTPException(403, str(error)) from None
    except LookupError:
        raise HTTPException(404, "no such file") from None
    except httpx.HTTPStatusError as error:
        if error.response.status_code == 403:
            raise HTTPException(403, error.response.text) from None
        if error.response.status_code == 404:
            raise HTTPException(404, "no such file") from None
        if error.response.status_code == 400:
            raise HTTPException(422, error.response.text) from None
        raise HTTPException(503, "database service rejected file read") from None
    except httpx.HTTPError as error:
        raise HTTPException(503, f"database service unavailable: {type(error).__name__}") from None


@router.get("/versions/{version_id}/download")
async def download(version_id: str, request: Request, principal: Principal = Depends(authenticated)) -> dict:
    test_client = getattr(request.app.state, "filesystem_database_client", None)
    settings = request.app.state.settings
    if test_client is not None:
        return await asyncio.to_thread(
            call, request, principal, lambda service, repo, actor: download_url(service, version_id, actor=actor)
        )
    if not settings.database_service_url or not settings.database_service_token:
        raise HTTPException(
            503, "DATABASE_SERVICE_URL and DATABASE_SERVICE_TOKEN are required for filesystem downloads"
        )
    try:
        client = DatabaseServiceFilesystemClient(settings.database_service_url, settings.database_service_token)
        key = await client.get_download_key(principal.account_id, version_id)
        if is_anonymously_readable(key):
            origin = os.environ.get("S3_PUBLIC_ORIGIN", "https://res.alidantech.org/mzizi").rstrip("/")
            return {"kind": "public", "url": f"{origin}/{key}", "expires_in": None}
        store = store_for(request)
        return {"kind": "presigned", "url": store.presign_get(key), "expires_in": 900}
    except httpx.HTTPStatusError as error:
        if error.response.status_code == 403:
            raise HTTPException(403, error.response.text) from None
        if error.response.status_code == 404:
            raise HTTPException(404, "no such version") from None
        raise HTTPException(503, "database service rejected file download") from None
    except httpx.HTTPError as error:
        raise HTTPException(503, f"database service unavailable: {type(error).__name__}") from None
