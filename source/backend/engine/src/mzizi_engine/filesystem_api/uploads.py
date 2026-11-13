"""Direct-upload routes: reservation, completion and bounded cleanup of lapsed sessions."""

from __future__ import annotations

import asyncio
from typing import Any

import httpx
from fastapi import Depends, HTTPException, Request

from mzizi_engine.auth import DatabaseServiceFilesystemClient, Principal, authenticated
from mzizi_engine.filesystem import FilesystemService, PermissionDenied, Repository, cleanup_uploads, complete_upload
from mzizi_engine.filesystem_api._shared import CompleteIn, UploadIn, call, router, store_for


@router.post("/uploads", status_code=201)
async def start_upload(body: UploadIn, request: Request, principal: Principal = Depends(authenticated)) -> dict:
    test_client = getattr(request.app.state, "filesystem_database_client", None)
    settings = request.app.state.settings
    if test_client is None and (not settings.database_service_url or not settings.database_service_token):
        raise HTTPException(503, "DATABASE_SERVICE_URL and DATABASE_SERVICE_TOKEN are required for upload reservation")
    store = store_for(request)
    try:
        if test_client is not None:
            upload = await test_client.create_upload(
                principal.account_id,
                body.folder_id,
                body.filename,
                body.size,
                body.sha256,
                body.lease_seconds,
                body.ttl_seconds,
            )
        else:
            client = DatabaseServiceFilesystemClient(settings.database_service_url, settings.database_service_token)
            upload = await client.create_upload(
                principal.account_id,
                body.folder_id,
                body.filename,
                body.size,
                body.sha256,
                body.lease_seconds,
                body.ttl_seconds,
            )
        upload["put_url"] = store.presign_put(upload["temp_key"], body.content_type, min(body.lease_seconds, 3600))
        return {
            "upload_id": str(upload["id"]),
            "put_url": upload["put_url"],
            "lease_expires_at": upload["lease_expires_at"],
            "expires_at": upload["expires_at"],
        }
    except PermissionDenied as error:
        raise HTTPException(403, str(error)) from None
    except httpx.HTTPStatusError as error:
        if error.response.status_code == 403:
            raise HTTPException(403, error.response.text) from None
        if error.response.status_code == 404:
            raise HTTPException(404, "destination folder was not found") from None
        if error.response.status_code == 400:
            raise HTTPException(422, error.response.text) from None
        raise HTTPException(503, "database service rejected upload reservation") from None
    except httpx.HTTPError as error:
        raise HTTPException(503, f"database service unavailable: {type(error).__name__}") from None


@router.post("/uploads/{upload_id}/complete")
async def finish_upload(
    upload_id: str, body: CompleteIn, request: Request, principal: Principal = Depends(authenticated)
) -> dict:
    def work(service: FilesystemService, repo: Repository, actor: Any) -> Any:
        reg = complete_upload(service, upload_id, actor=actor, code=body.code, retention=body.retention)
        if reg.outcome in ("failed", "conflict", "denied", "blocked"):
            raise HTTPException(409 if reg.outcome != "denied" else 403, reg.detail or reg.outcome)
        return {
            "outcome": reg.outcome,
            "file_id": reg.file_id,
            "version_id": reg.version_id,
            "revision": reg.revision,
            "verified": reg.verified,
        }

    return await asyncio.to_thread(call, request, principal, work)


@router.post("/uploads/cleanup")
async def cleanup(request: Request, apply: bool = False, principal: Principal = Depends(authenticated)) -> dict:
    """Bounded cleanup of lapsed upload sessions (dry run by default). Requires filesystem.delete at platform scope unless auth is off."""
    test_client = getattr(request.app.state, "filesystem_database_client", None)
    settings = request.app.state.settings
    if test_client is not None:

        def test_work(service: FilesystemService, repo: Repository, actor: Any) -> Any:
            if settings.auth != "off":
                service.authorizer.for_platform(actor, "filesystem.delete")
            rep = cleanup_uploads(service, dry_run=not apply)
            return {
                "dry_run": rep.dry_run,
                "abandoned": len(rep.abandoned),
                "multipart_aborted": len(rep.aborted_multipart),
                "temp_objects_removed": len(rep.temp_objects_removed),
                "sessions_trimmed": rep.sessions_trimmed,
                "errors": rep.errors,
            }

        return await asyncio.to_thread(call, request, principal, test_work)

    if not settings.database_service_url or not settings.database_service_token:
        raise HTTPException(503, "DATABASE_SERVICE_URL and DATABASE_SERVICE_TOKEN are required for upload cleanup")
    client = DatabaseServiceFilesystemClient(settings.database_service_url, settings.database_service_token)
    store = store_for(request)
    try:
        candidates = await client.cleanup_uploads(principal.account_id, apply, 100)
        multipart_aborted = 0
        temp_objects_removed = 0
        errors: list[str] = []
        cleaned_ids: list[str] = []
        for upload in candidates:
            try:
                temp_key = str(upload["temp_key"])
                if upload.get("multipart_id"):
                    multipart_aborted += 1
                    if apply:
                        store.abort_multipart(temp_key, str(upload["multipart_id"]))
                if (
                    temp_key.startswith("private/tmp/uploads/")
                    and not upload.get("referenced")
                    and store.head(temp_key) is not None
                ):
                    temp_objects_removed += 1
                    if apply:
                        store.delete(temp_key)
                if apply:
                    cleaned_ids.append(str(upload["id"]))
            except Exception as error:
                errors.append(f"{upload.get('id')}: {error}")
        sessions_trimmed = 0
        if apply:
            if cleaned_ids:
                await client.mark_uploads_cleaned(principal.account_id, cleaned_ids)
            if not errors:
                sessions_trimmed = await client.trim_uploads(principal.account_id, 30, 500)
        return {
            "dry_run": not apply,
            "abandoned": len(candidates),
            "multipart_aborted": multipart_aborted,
            "temp_objects_removed": temp_objects_removed,
            "sessions_trimmed": sessions_trimmed,
            "errors": errors,
        }
    except PermissionDenied as error:
        raise HTTPException(403, str(error)) from None
    except httpx.HTTPStatusError as error:
        if error.response.status_code == 403:
            raise HTTPException(403, error.response.text) from None
        if error.response.status_code == 400:
            raise HTTPException(422, error.response.text) from None
        raise HTTPException(503, "database service rejected upload cleanup") from None
    except httpx.HTTPError as error:
        raise HTTPException(503, f"database service unavailable: {type(error).__name__}") from None
