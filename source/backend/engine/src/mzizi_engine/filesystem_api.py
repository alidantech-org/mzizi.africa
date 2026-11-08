"""Authorized filesystem operations of the engine: folders, files, versions, uploads, extractions, access transitions, downloads and sync.

All behavior lives in the filesystem package; these routes only authenticate, open a database connection, and call it. Record-level
authorization is the package's `DatabaseAuthorizer` over the `auth` schema (scoped to folders), so the engine adds no access rules of its
own. Responses never expose whether bytes were physically shared with another artifact.
"""
from __future__ import annotations

import asyncio
import base64
from pathlib import Path
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field

from mzizi_filesystem import (Conflict, DatabaseAuthorizer, FilesystemService, ManifestError, MemoryObjectStore, OperatorAuthorizer, PermissionDenied, Repository, S3ObjectStore, StoreError, ancestry,
                              begin_extraction, cleanup_uploads, complete_upload, create_upload, finish_extraction, load_plan, register_output, run_sync, transition_folder_access)
from mzizi_filesystem.download import download_url
from mzizi_manifest.paths import SEED_ROOT

from .auth import Principal, authenticated

router = APIRouter(prefix="/v1/filesystem", tags=["filesystem"])


def _store():
    import os

    if all(os.environ.get(k) for k in ("S3_ENDPOINT", "S3_ACCESS_KEY", "S3_SECRET_KEY")):
        return S3ObjectStore()
    if os.environ.get("ENGINE_STORE_MEMORY") == "1":
        return MemoryObjectStore()
    raise HTTPException(503, "object storage is not configured (S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY)")


def _open(request: Request, principal: Principal):
    from mzizi_database import connect

    url = request.app.state.settings.database_url
    if not url:
        raise HTTPException(503, "DATABASE_URL is not configured")
    conn = connect(url, autocommit=True)
    store = request.app.state.filesystem_store() if hasattr(request.app.state, "filesystem_store") else _store()
    authorizer = OperatorAuthorizer() if request.app.state.settings.auth == "off" else DatabaseAuthorizer(conn)
    return conn, FilesystemService(Repository(conn), store, authorizer)


def _call(request: Request, principal: Principal, fn):
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
    finally:
        conn.close()


def _public(row: dict | None) -> dict | None:
    return None if row is None else {k: (str(v) if hasattr(v, "hex") and not isinstance(v, (bytes, str)) else (v.isoformat() if hasattr(v, "isoformat") else v)) for k, v in row.items()}


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
    registry_code: str | None = None
    retention: str = "preserve_history"


class ExtractionIn(BaseModel):
    operation: str
    capability: str
    capability_version: str
    inputs: list[str]
    config: dict[str, Any] | None = None
    tool: dict[str, Any] = Field(default_factory=dict)
    engine_run_id: str | None = None
    engine_job_id: str | None = None


class OutputIn(BaseModel):
    folder_id: str
    name: str
    content_base64: str
    ordinal: int = 0
    registry_code: str | None = None
    retention: str = "preserve_history"


class FinishIn(BaseModel):
    state: str
    error: str | None = None


class SyncIn(BaseModel):
    manifest: str = "manifest.yaml"
    entries: list[str] | None = None
    apply: bool = False


@router.get("/folders/{folder_id}")
async def get_folder(folder_id: str, request: Request, principal: Principal = Depends(authenticated)) -> dict:
    def work(service, repo, actor):
        folder = repo.get_folder(folder_id)
        if folder is None:
            raise LookupError("no such folder")
        service.authorizer.for_record(actor, "filesystem.read", "filesystem.folders", folder_id)
        children = repo.conn.execute("SELECT id, name FROM filesystem.folders WHERE parent_id = %s ORDER BY name", (folder_id,)).fetchall()
        files = repo.conn.execute("SELECT id, name, current_version_id FROM filesystem.files WHERE folder_id = %s ORDER BY name", (folder_id,)).fetchall()
        return {"folder": _public(folder), "path": repo.folder_path(folder_id), "effective": _public(repo.effective(folder_id)), "folders": [_public(c) for c in children], "files": [_public(f) for f in files]}

    return await asyncio.to_thread(_call, request, principal, work)


@router.post("/folders", status_code=201)
async def create_folder(body: FolderIn, request: Request, principal: Principal = Depends(authenticated)) -> dict:
    def work(service, repo, actor):
        service.authorizer.for_new_child(actor, "filesystem.edit", "filesystem.folders", body.parent_id)
        if body.access is not None:
            service.authorizer.for_new_child(actor, "filesystem.publish", "filesystem.folders", body.parent_id)  # classifying access is a publish decision
        fields = body.model_dump(exclude={"parent_id", "name"})
        with repo.transaction():
            row = repo.create_folder(body.parent_id, body.name, fields, actor)
        return {"folder": _public(row), "path": repo.folder_path(row["id"])}

    return await asyncio.to_thread(_call, request, principal, work)


@router.post("/folders/{folder_id}/access")
async def change_access(folder_id: str, body: AccessIn, request: Request, principal: Principal = Depends(authenticated)) -> dict:
    """Preview (default) or apply an access transition: content moves between S3 prefixes and the registry changes in one commit."""
    def work(service, repo, actor):
        report = transition_folder_access(service, folder_id, body.access, actor=actor, authorization=body.authorization, dry_run=not body.apply)
        if report.error:
            raise HTTPException(409, report.error)
        return {"dry_run": report.dry_run, "versions_relocated": report.versions_relocated, "superseded_keys_pending_cleanup": len(report.superseded_keys)}

    return await asyncio.to_thread(_call, request, principal, work)


@router.get("/files/{file_id}")
async def get_file(file_id: str, request: Request, principal: Principal = Depends(authenticated)) -> dict:
    def work(service, repo, actor):
        file = repo.get_file(file_id)
        if file is None:
            raise LookupError("no such file")
        service.authorizer.for_record(actor, "filesystem.read", "filesystem.files", file_id)
        versions = [{k: v for k, v in _public(r).items() if k != "s3_key"} for r in repo.versions(file_id)]
        return {"file": _public(file), "path": repo.conn.execute("SELECT filesystem.file_path(%s) AS p", (file_id,)).fetchone()["p"], "versions": versions}

    return await asyncio.to_thread(_call, request, principal, work)


@router.get("/versions/{version_id}/download")
async def download(version_id: str, request: Request, principal: Principal = Depends(authenticated)) -> dict:
    return await asyncio.to_thread(_call, request, principal, lambda service, repo, actor: download_url(service, version_id, actor=actor))


@router.post("/uploads", status_code=201)
async def start_upload(body: UploadIn, request: Request, principal: Principal = Depends(authenticated)) -> dict:
    def work(service, repo, actor):
        row = create_upload(service, body.folder_id, body.filename, actor=actor, size=body.size, sha256=body.sha256, lease_seconds=body.lease_seconds, ttl_seconds=body.ttl_seconds, content_type=body.content_type)
        return {"upload_id": str(row["id"]), "put_url": row["put_url"], "lease_expires_at": row["lease_expires_at"].isoformat(), "expires_at": row["expires_at"].isoformat()}

    return await asyncio.to_thread(_call, request, principal, work)


@router.post("/uploads/{upload_id}/complete")
async def finish_upload(upload_id: str, body: CompleteIn, request: Request, principal: Principal = Depends(authenticated)) -> dict:
    def work(service, repo, actor):
        reg = complete_upload(service, upload_id, actor=actor, registry_code=body.registry_code, retention=body.retention)
        if reg.outcome in ("failed", "conflict", "denied", "blocked"):
            raise HTTPException(409 if reg.outcome != "denied" else 403, reg.detail or reg.outcome)
        return {"outcome": reg.outcome, "file_id": reg.file_id, "version_id": reg.version_id, "revision": reg.revision, "verified": reg.verified}

    return await asyncio.to_thread(_call, request, principal, work)


@router.post("/uploads/cleanup")
async def cleanup(request: Request, apply: bool = False, principal: Principal = Depends(authenticated)) -> dict:
    """Bounded cleanup of lapsed upload sessions (dry run by default). Requires filesystem.delete at platform scope unless auth is off."""
    def work(service, repo, actor):
        if request.app.state.settings.auth != "off" and not repo.conn.execute("SELECT auth.can_platform(%s, 'filesystem.delete') AS ok", (actor,)).fetchone()["ok"]:
            raise PermissionDenied("filesystem.delete is required (platform-wide) to clean up uploads")
        rep = cleanup_uploads(service, dry_run=not apply)
        return {"dry_run": rep.dry_run, "abandoned": len(rep.abandoned), "multipart_aborted": len(rep.aborted_multipart), "temp_objects_removed": len(rep.temp_objects_removed), "sessions_trimmed": rep.sessions_trimmed, "errors": rep.errors}

    return await asyncio.to_thread(_call, request, principal, work)


@router.post("/extractions", status_code=201)
async def start_extraction(body: ExtractionIn, request: Request, principal: Principal = Depends(authenticated)) -> dict:
    def work(service, repo, actor):
        row = begin_extraction(service, body.operation, body.capability, body.capability_version, body.inputs, config=body.config, tool=body.tool, actor=actor, engine_run_id=body.engine_run_id, engine_job_id=body.engine_job_id)
        return {"extraction": _public(row)}

    return await asyncio.to_thread(_call, request, principal, work)


@router.post("/extractions/{extraction_id}/outputs", status_code=201)
async def add_output(extraction_id: str, body: OutputIn, request: Request, principal: Principal = Depends(authenticated)) -> dict:
    def work(service, repo, actor):
        reg = register_output(service, extraction_id, body.folder_id, body.name, base64.b64decode(body.content_base64), ordinal=body.ordinal, actor=actor, registry_code=body.registry_code, retention=body.retention)
        if reg.outcome in ("failed", "conflict", "denied", "blocked"):
            raise HTTPException(403 if reg.outcome == "denied" else 409, reg.detail or reg.outcome)
        return {"outcome": reg.outcome, "file_id": reg.file_id, "version_id": reg.version_id, "revision": reg.revision}

    return await asyncio.to_thread(_call, request, principal, work)


@router.post("/extractions/{extraction_id}/finish")
async def end_extraction(extraction_id: str, body: FinishIn, request: Request, principal: Principal = Depends(authenticated)) -> dict:
    return await asyncio.to_thread(_call, request, principal, lambda service, repo, actor: {"extraction": _public(finish_extraction(service, extraction_id, body.state, body.error))})


@router.get("/versions/{version_id}/lineage")
async def lineage(version_id: str, request: Request, principal: Principal = Depends(authenticated)) -> dict:
    def work(service, repo, actor):
        version = repo.get_version(version_id)
        if version is None:
            raise LookupError("no such version")
        service.authorizer.for_record(actor, "filesystem.read", "filesystem.files", version["file_id"])
        return {"operations": repo.operations_for(version_id), "ancestry": ancestry(service, version_id)}

    return await asyncio.to_thread(_call, request, principal, work)


@router.post("/sync", status_code=202)
async def start_sync(body: SyncIn, request: Request, principal: Principal = Depends(authenticated)) -> dict:
    """Plan (default) or apply a manifest sync as an engine job; the actor is the authenticated principal, never taken from the body."""
    manifest = (SEED_ROOT / body.manifest) if not Path(body.manifest).is_absolute() else Path(body.manifest)
    if SEED_ROOT.resolve() not in manifest.resolve().parents:
        raise HTTPException(422, "manifest must be inside the seed root")
    job, created = await request.app.state.executor.submit("filesystem.sync", {"manifest": str(manifest), "entries": body.entries, "apply": body.apply, "actor": principal.account_id, "database_url": request.app.state.settings.database_url}, None, principal.account_id)
    return {**job, "created": created}
