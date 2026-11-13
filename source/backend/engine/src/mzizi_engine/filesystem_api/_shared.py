"""Shared router, request/response models and helpers for the filesystem routes.

All behavior lives in the filesystem package; these routes only authenticate, open a database connection, and call
it. Record-level authorization is the package's `DatabaseAuthorizer` over the `auth` schema (scoped to folders), so
the engine adds no access rules of its own. Responses never expose whether bytes were physically shared with
another artifact.
"""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

import httpx
import psycopg
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

from mzizi_filesystem import Authorizer, MemoryObjectStore, OperatorAuthorizer, S3ObjectStore, StoreError
from mzizi_filesystem.store import ObjectStore

from ..auth import DatabaseServiceFilesystemAuthorizer, Principal
from ..filesystem import Conflict, FilesystemService, ManifestError, PermissionDenied, Repository
from ..ports import Connection

router = APIRouter(prefix="/v1/filesystem", tags=["filesystem"])


def _store() -> ObjectStore:
    import os

    if all(os.environ.get(k) for k in ("S3_ENDPOINT", "S3_ACCESS_KEY", "S3_SECRET_KEY")):
        return S3ObjectStore()
    if os.environ.get("ENGINE_STORE_MEMORY") == "1":
        return MemoryObjectStore()
    raise HTTPException(503, "object storage is not configured (S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY)")


def store_for(request: Request) -> ObjectStore:
    return request.app.state.filesystem_store() if hasattr(request.app.state, "filesystem_store") else _store()


def _open(request: Request, principal: Principal) -> tuple[Connection, FilesystemService]:
    from ..ports import connect

    url = request.app.state.settings.database_url
    if not url:
        raise HTTPException(
            503,
            "ENGINE_FILESYSTEM_LEGACY_DATABASE_URL is not configured; this filesystem operation is not migrated yet",
        )
    conn = connect(url, autocommit=True)
    store = store_for(request)
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
            raise HTTPException(
                503, "DATABASE_SERVICE_URL and DATABASE_SERVICE_TOKEN are required for filesystem authorization"
            )
        authorizer = DatabaseServiceFilesystemAuthorizer(service_url, service_token)
    return conn, FilesystemService(Repository(conn), store, authorizer)


def call[T](request: Request, principal: Principal, fn: Callable[[FilesystemService, Repository, Any], T]) -> T:
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


def public_row(row: dict | None) -> dict | None:
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
