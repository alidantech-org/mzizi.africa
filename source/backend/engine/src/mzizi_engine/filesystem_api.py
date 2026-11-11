"""Authorized filesystem operations of the engine: folders, files, versions, uploads, derivation relations, access transitions, downloads and sync.

All behavior lives in the filesystem package; these routes only authenticate, open a database connection, and call it. Record-level
authorization is the package's `DatabaseAuthorizer` over the `auth` schema (scoped to folders), so the engine adds no access rules of its
own. Responses never expose whether bytes were physically shared with another artifact.
"""

from __future__ import annotations

import asyncio
import base64
from collections.abc import Callable
from pathlib import Path
from typing import Any

import psycopg
import httpx
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field

from mzizi_database import Connection
from mzizi_filesystem import (
    Authorizer,
    Conflict,
    FilesystemService,
    ManifestError,
    MemoryObjectStore,
    OperatorAuthorizer,
    PermissionDenied,
    Repository,
    S3ObjectStore,
    StoreError,
    ancestry,
    cleanup_uploads,
    complete_upload,
    derivatives,
    is_anonymously_readable,
    register_derived,
    relate,
    transition_folder_access,
)
from mzizi_filesystem.download import download_url
from mzizi_filesystem.store import ObjectStore
from mzizi_manifest.paths import SEED_ROOT

from .auth import DatabaseServiceFilesystemAuthorizer, DatabaseServiceFilesystemClient, Principal, authenticated

router = APIRouter(prefix="/v1/filesystem", tags=["filesystem"])


def _store() -> ObjectStore:
    import os

    if all(os.environ.get(k) for k in ("S3_ENDPOINT", "S3_ACCESS_KEY", "S3_SECRET_KEY")):
        return S3ObjectStore()
    if os.environ.get("ENGINE_STORE_MEMORY") == "1":
        return MemoryObjectStore()
    raise HTTPException(503, "object storage is not configured (S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY)")


def _open(request: Request, principal: Principal) -> tuple[Connection, FilesystemService]:
    from mzizi_database import connect

    url = request.app.state.settings.database_url
    if not url:
        raise HTTPException(503, "ENGINE_FILESYSTEM_LEGACY_DATABASE_URL is not configured; this filesystem operation is not migrated yet")
    conn = connect(url, autocommit=True)
    store = request.app.state.filesystem_store() if hasattr(request.app.state, "filesystem_store") else _store()
    factory = getattr(request.app.state, "filesystem_authorizer_factory", None)
    if factory is not None:
        authorizer: Authorizer = factory(conn)
    elif request.app.state.settings.auth == "off":
        authorizer = OperatorAuthorizer()
    else:
        service_url = request.app.state.settings.database_service_url
        service_token = request.app.state.settings.database_service_token
        if not service_url or not service_token:
            conn.close()
            raise HTTPException(503, "DATABASE_SERVICE_URL and DATABASE_SERVICE_TOKEN are required for filesystem authorization")
        authorizer = DatabaseServiceFilesystemAuthorizer(service_url, service_token)
    return conn, FilesystemService(Repository(conn), store, authorizer)


def _call[T](request: Request, principal: Principal, fn: Callable[[FilesystemService, Repository, Any], T]) -> T:
    """Runs fn(service, repo, actor) with a connection, mapping domain errors to HTTP statuses."""
    conn, service = _open(request, principal)
    try:
        return fn(service, service.repo, principal.account_id)
    except PermissionDenied as error:
        raise HTTPException(403, str(error)) from None
    except Conflict as error:
        raise HTTPException(409, str(error)) from None
    except (ManifestError, LookupError, ValueError) as error:
        raise HTTPException(422, str(error)) from None
    except StoreError as error:
        raise HTTPException(502, str(error)) from None
    except httpx.HTTPError as error:
        raise HTTPException(503, f"database authorization service unavailable: {type(error).__name__}") from None
    except (
        psycopg.errors.IntegrityError
    ) as error:  # unique/check/foreign-key violations and the schema's own guard rules
        raise HTTPException(409, str(error).splitlines()[0]) from None
    except psycopg.DatabaseError as error:
        if (getattr(error, "sqlstate", None) or "").startswith("MZ"):
            raise HTTPException(409, str(error).splitlines()[0]) from None
        raise
    finally:
        conn.close()


def _public(row: dict | None) -> dict | None:
    return (
        None
        if row is None
        else {
            k: (
                str(v)
                if hasattr(v, "hex") and not isinstance(v, (bytes, str))
                else (v.isoformat() if hasattr(v, "isoformat") else v)
            )
            for k, v in row.items()
        }
    )


class FolderIn(BaseModel):
    parent_id: str | None = None
    name: str
    description: str | None = None
    access: str | None = None
    access_authorization: dict | None = None
    allow_weaker_children: bool = False
    artifact_role: str | None = None
    acquisition_class: str | None = None
    preparation: str | None = None
    is_seed: bool | None = None
    jurisdiction_code: str | None = None


class AccessIn(BaseModel):
    access: str
    authorization: dict | None = None
    apply: bool = False


class UploadIn(BaseModel):
    folder_id: str
    filename: str
    size: int | None = None
    sha256: str | None = None
    content_type: str = "application/octet-stream"
    lease_seconds: int = Field(900, ge=30, le=3600)
    ttl_seconds: int = Field(86400, ge=60, le=7 * 86400)


class CompleteIn(BaseModel):
    code: str | None = None
    retention: str = "preserve_history"


class RelationIn(BaseModel):
    source_version_id: str
    derived_version_id: str
    relation: str = "derived_from"
    engine_job_id: str | None = None


class DerivedIn(BaseModel):
    sources: list[str]
    folder_id: str
    name: str
    content_base64: str
    relation: str = "derived_from"
    engine_job_id: str | None = None
    code: str | None = None
    retention: str = "preserve_history"


class SyncIn(BaseModel):
    manifest: str = "manifest.yaml"
    entries: list[str] | None = None
    apply: bool = False


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
        raise HTTPException(503, "DATABASE_SERVICE_URL and DATABASE_SERVICE_TOKEN are required for filesystem metadata writes")
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

    return await asyncio.to_thread(_call, request, principal, work)


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
        return await asyncio.to_thread(_call, request, principal,
            lambda service, repo, actor: download_url(service, version_id, actor=actor))
    if not settings.database_service_url or not settings.database_service_token:
        raise HTTPException(503, "DATABASE_SERVICE_URL and DATABASE_SERVICE_TOKEN are required for filesystem downloads")
    try:
        client = DatabaseServiceFilesystemClient(settings.database_service_url, settings.database_service_token)
        key = await client.get_download_key(principal.account_id, version_id)
        if is_anonymously_readable(key):
            import os
            origin = os.environ.get("S3_PUBLIC_ORIGIN", "https://res.alidantech.org/mzizi").rstrip("/")
            return {"kind": "public", "url": f"{origin}/{key}", "expires_in": None}
        store = request.app.state.filesystem_store() if hasattr(request.app.state, "filesystem_store") else _store()
        return {"kind": "presigned", "url": store.presign_get(key), "expires_in": 900}
    except httpx.HTTPStatusError as error:
        if error.response.status_code == 403:
            raise HTTPException(403, error.response.text) from None
        if error.response.status_code == 404:
            raise HTTPException(404, "no such version") from None
        raise HTTPException(503, "database service rejected file download") from None
    except httpx.HTTPError as error:
        raise HTTPException(503, f"database service unavailable: {type(error).__name__}") from None


@router.post("/uploads", status_code=201)
async def start_upload(body: UploadIn, request: Request, principal: Principal = Depends(authenticated)) -> dict:
    test_client = getattr(request.app.state, "filesystem_database_client", None)
    settings = request.app.state.settings
    if test_client is None and (not settings.database_service_url or not settings.database_service_token):
        raise HTTPException(503, "DATABASE_SERVICE_URL and DATABASE_SERVICE_TOKEN are required for upload reservation")
    store = request.app.state.filesystem_store() if hasattr(request.app.state, "filesystem_store") else _store()
    try:
        if test_client is not None:
            upload = await test_client.create_upload(principal.account_id, body.folder_id, body.filename, body.size,
                body.sha256, body.lease_seconds, body.ttl_seconds)
        else:
            client = DatabaseServiceFilesystemClient(settings.database_service_url, settings.database_service_token)
            upload = await client.create_upload(principal.account_id, body.folder_id, body.filename, body.size,
                body.sha256, body.lease_seconds, body.ttl_seconds)
        upload["put_url"] = store.presign_put(upload["temp_key"], body.content_type, min(body.lease_seconds, 3600))
        return {"upload_id": str(upload["id"]), "put_url": upload["put_url"],
            "lease_expires_at": upload["lease_expires_at"], "expires_at": upload["expires_at"]}
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

    return await asyncio.to_thread(_call, request, principal, work)


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
            return {"dry_run": rep.dry_run, "abandoned": len(rep.abandoned), "multipart_aborted": len(rep.aborted_multipart),
                "temp_objects_removed": len(rep.temp_objects_removed), "sessions_trimmed": rep.sessions_trimmed, "errors": rep.errors}
        return await asyncio.to_thread(_call, request, principal, test_work)

    if not settings.database_service_url or not settings.database_service_token:
        raise HTTPException(503, "DATABASE_SERVICE_URL and DATABASE_SERVICE_TOKEN are required for upload cleanup")
    client = DatabaseServiceFilesystemClient(settings.database_service_url, settings.database_service_token)
    store = request.app.state.filesystem_store() if hasattr(request.app.state, "filesystem_store") else _store()
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
                if temp_key.startswith("private/tmp/uploads/") and not upload.get("referenced") and store.head(temp_key) is not None:
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
        return {"dry_run": not apply, "abandoned": len(candidates), "multipart_aborted": multipart_aborted,
            "temp_objects_removed": temp_objects_removed, "sessions_trimmed": sessions_trimmed, "errors": errors}
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


@router.post("/relations", status_code=201)
async def add_relation(body: RelationIn, request: Request, principal: Principal = Depends(authenticated)) -> dict:
    test_client = getattr(request.app.state, "filesystem_database_client", None)
    settings = request.app.state.settings
    try:
        if test_client is not None:
            return await asyncio.to_thread(_call, request, principal, lambda service, repo, actor: {
                "created": relate(service, body.source_version_id, body.derived_version_id, relation=body.relation,
                    actor=actor, engine_job_id=body.engine_job_id)
            })
        if not settings.database_service_url or not settings.database_service_token:
            raise HTTPException(503, "DATABASE_SERVICE_URL and DATABASE_SERVICE_TOKEN are required for file relations")
        client = DatabaseServiceFilesystemClient(settings.database_service_url, settings.database_service_token)
        created = await client.link_relation(principal.account_id, body.source_version_id, body.derived_version_id,
            body.relation, body.engine_job_id)
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

    return await asyncio.to_thread(_call, request, principal, work)


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
            return await asyncio.to_thread(_call, request, principal, test_work)
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


@router.post("/sync", status_code=202)
async def start_sync(body: SyncIn, request: Request, principal: Principal = Depends(authenticated)) -> dict:
    """Plan (default) or apply a manifest sync as an engine job; the actor is the authenticated principal, never taken from the body."""
    manifest = (SEED_ROOT / body.manifest) if not Path(body.manifest).is_absolute() else Path(body.manifest)
    if SEED_ROOT.resolve() not in manifest.resolve().parents:
        raise HTTPException(422, "manifest must be inside the seed root")
    job, created = await request.app.state.executor.submit(
        "filesystem.sync",
        {
            "manifest": str(manifest),
            "entries": body.entries,
            "apply": body.apply,
            "actor": principal.account_id,
            "database_url": request.app.state.settings.database_url,
        },
        None,
        principal.account_id,
    )
    return {**job, "created": created}
