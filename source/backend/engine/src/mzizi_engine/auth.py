"""Engine authentication and authorization: the same OIDC identities and the same `auth` schema as the NestJS API.

The engine invents no accounts or permissions. A bearer token proves (issuer, subject); `auth.resolve_identity` maps it
to an account and `auth.can_platform` checks a platform permission such as engine.read, engine.edit or engine.publish.
Service actors (the NestJS API, scripts, agents) are ordinary accounts of the auth schema.
"""

from __future__ import annotations

import asyncio
from dataclasses import dataclass
from typing import Any, Protocol

import httpx
from fastapi import Depends, HTTPException, Request

from .config import Settings
from .filesystem import PermissionDenied


@dataclass(frozen=True)
class Principal:
    account_id: str | None  # None only when ENGINE_AUTH=off


class Authority(Protocol):
    async def resolve(self, issuer: str, subject: str) -> tuple[str | None, str]: ...
    async def can(self, account_id: str, permission: str) -> bool: ...


class DatabaseServiceAuthority:
    """Uses named TypeScript database-service auth operations; Python holds no SQL access here."""

    def __init__(self, service_url: str, service_token: str) -> None:
        self.url = service_url.rstrip("/")
        self.token = service_token

    async def _post(self, endpoint: str, payload: dict[str, str]) -> dict[str, Any]:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.post(
                f"{self.url}/internal/v1/auth/{endpoint}",
                json=payload,
                headers={"authorization": f"Bearer {self.token}"},
            )
            response.raise_for_status()
            return response.json()

    async def resolve(self, issuer: str, subject: str) -> tuple[str | None, str]:
        result = await self._post("resolve-identity", {"issuer": issuer, "subject": subject})
        return result.get("accountId"), result.get("outcome", "unknown_identity")

    async def can(self, account_id: str, permission: str) -> bool:
        result = await self._post("can-platform", {"accountId": account_id, "permission": permission})
        return bool(result.get("allowed"))


class DatabaseServiceFilesystemAuthorizer:
    """Synchronous scoped-auth client used by filesystem operations inside their worker thread."""

    def __init__(self, service_url: str, service_token: str) -> None:
        self.url = service_url.rstrip("/")
        self.token = service_token

    def _post(self, endpoint: str, payload: dict[str, Any]) -> dict[str, Any]:
        response = httpx.post(
            f"{self.url}/internal/v1/auth/{endpoint}",
            json=payload,
            headers={"authorization": f"Bearer {self.token}"},
            timeout=5.0,
        )
        response.raise_for_status()
        return response.json()

    @staticmethod
    def _check(decision: dict[str, Any], what: str) -> None:
        if not decision.get("allowed"):
            raise PermissionDenied(
                f"{what} denied: {decision.get('reason', 'unknown')}"
                + (f" ({decision['failed_on']})" if decision.get("failed_on") else "")
            )

    def for_new_child(self, actor: str | None, permission: str, table: str, parent_folder_id: str | None) -> None:
        if actor is None:
            raise PermissionDenied("an authenticated actor is required")
        self._check(
            self._post(
                "can-link", {"accountId": actor, "permission": permission, "table": table, "linkId": parent_folder_id}
            ),
            f"{permission} on {table}",
        )

    def for_record(self, actor: str | None, permission: str, table: str, record_id: str) -> None:
        if actor is None:
            raise PermissionDenied("an authenticated actor is required")
        self._check(
            self._post(
                "can-record", {"accountId": actor, "permission": permission, "table": table, "recordId": record_id}
            ),
            f"{permission} on {table}",
        )

    def for_move(self, actor: str | None, permission: str, table: str, record_id: str, new_link_id: str | None) -> None:
        if actor is None:
            raise PermissionDenied("an authenticated actor is required")
        self._check(
            self._post(
                "can-change",
                {
                    "accountId": actor,
                    "permission": permission,
                    "table": table,
                    "recordId": record_id,
                    "newLinkId": new_link_id,
                },
            ),
            f"move on {table}",
        )

    def for_platform(self, actor: str | None, permission: str) -> None:
        if actor is None:
            raise PermissionDenied("an authenticated actor is required")
        self._check(self._post("can-platform", {"accountId": actor, "permission": permission}), permission)


class DatabaseServiceFilesystemClient:
    """Typed filesystem commands. File bytes remain in the filesystem capability; metadata writes belong to TypeScript."""

    def __init__(self, service_url: str, service_token: str) -> None:
        self.url = service_url.rstrip("/")
        self.token = service_token

    async def get_folder(self, actor: str | None, folder_id: str) -> dict[str, Any]:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{self.url}/internal/v1/filesystem/folders/{folder_id}",
                params={"actorId": actor} if actor else None,
                headers={"authorization": f"Bearer {self.token}"},
            )
            response.raise_for_status()
            return response.json()

    async def get_file(self, actor: str | None, file_id: str) -> dict[str, Any]:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{self.url}/internal/v1/filesystem/files/{file_id}",
                params={"actorId": actor} if actor else None,
                headers={"authorization": f"Bearer {self.token}"},
            )
            response.raise_for_status()
            return response.json()

    async def get_download_key(self, actor: str | None, version_id: str) -> str:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{self.url}/internal/v1/filesystem/versions/{version_id}/download",
                params={"actorId": actor} if actor else None,
                headers={"authorization": f"Bearer {self.token}"},
            )
            response.raise_for_status()
            return str(response.json()["key"])

    async def get_lineage(self, actor: str | None, version_id: str) -> dict[str, Any]:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{self.url}/internal/v1/filesystem/versions/{version_id}/lineage",
                params={"actorId": actor} if actor else None,
                headers={"authorization": f"Bearer {self.token}"},
            )
            response.raise_for_status()
            return response.json()

    async def create_upload(
        self,
        actor: str | None,
        folder_id: str,
        filename: str,
        size: int | None,
        sha256: str | None,
        lease_seconds: int,
        ttl_seconds: int,
    ) -> dict[str, Any]:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{self.url}/internal/v1/filesystem/uploads",
                json={
                    "actorId": actor,
                    "folderId": folder_id,
                    "filename": filename,
                    "size": size,
                    "sha256": sha256,
                    "leaseSeconds": lease_seconds,
                    "ttlSeconds": ttl_seconds,
                },
                headers={"authorization": f"Bearer {self.token}"},
            )
            response.raise_for_status()
            return response.json()["upload"]

    async def link_relation(
        self,
        actor: str | None,
        source_version_id: str,
        derived_version_id: str,
        relation: str,
        engine_job_id: str | None,
    ) -> bool:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{self.url}/internal/v1/filesystem/relations",
                json={
                    "actorId": actor,
                    "sourceVersionId": source_version_id,
                    "derivedVersionId": derived_version_id,
                    "relation": relation,
                    "engineJobId": engine_job_id,
                },
                headers={"authorization": f"Bearer {self.token}"},
            )
            response.raise_for_status()
            return bool(response.json()["created"])

    async def cleanup_uploads(self, actor: str | None, apply: bool, batch: int) -> list[dict[str, Any]]:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                f"{self.url}/internal/v1/filesystem/uploads/cleanup",
                json={"actorId": actor, "apply": apply, "batch": batch},
                headers={"authorization": f"Bearer {self.token}"},
            )
            response.raise_for_status()
            return list(response.json()["candidates"])

    async def trim_uploads(self, actor: str | None, older_than_days: int, batch: int) -> int:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                f"{self.url}/internal/v1/filesystem/uploads/trim",
                json={"actorId": actor, "olderThanDays": older_than_days, "batch": batch},
                headers={"authorization": f"Bearer {self.token}"},
            )
            response.raise_for_status()
            return int(response.json()["trimmed"])

    async def mark_uploads_cleaned(self, actor: str | None, upload_ids: list[str]) -> int:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                f"{self.url}/internal/v1/filesystem/uploads/cleaned",
                json={"actorId": actor, "ids": upload_ids},
                headers={"authorization": f"Bearer {self.token}"},
            )
            response.raise_for_status()
            return int(response.json()["marked"])

    async def create_folder(
        self, actor: str | None, parent_id: str | None, name: str, fields: dict[str, Any]
    ) -> dict[str, Any]:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{self.url}/internal/v1/filesystem/folders",
                json={"actorId": actor, "parentId": parent_id, "name": name, "fields": fields},
                headers={"authorization": f"Bearer {self.token}"},
            )
            response.raise_for_status()
            return response.json()


class TokenVerifier(Protocol):
    async def __call__(self, token: str) -> tuple[str, str]: ...


def oidc_verifier(settings: Settings) -> TokenVerifier:
    """Verifies signature, issuer, expiry (and audience if set) with the issuer's JWKS; returns (issuer, subject)."""
    import jwt

    client = jwt.PyJWKClient(settings.jwks_url) if settings.jwks_url else None

    async def verify(token: str) -> tuple[str, str]:
        if not settings.issuer or client is None:
            raise HTTPException(503, "authentication is not configured (AUTH_ISSUER, AUTH_JWKS_URL)")

        def decode() -> dict[str, Any]:
            key = client.get_signing_key_from_jwt(token).key
            return jwt.decode(
                token,
                key,
                algorithms=["RS256", "ES256", "EdDSA"],
                issuer=settings.issuer,
                audience=settings.audience,
                options={"require": ["exp", "sub"], "verify_aud": bool(settings.audience)},
            )

        try:
            claims = await asyncio.to_thread(decode)
        except jwt.PyJWTError as error:
            raise HTTPException(401, "invalid or expired token") from error
        return settings.issuer, claims["sub"]

    return verify


def require(permission: str) -> Any:
    """FastAPI dependency: 401 without a valid token or known identity, 403 for a blocked account or missing permission."""

    async def dependency(request: Request) -> Principal:
        state = request.app.state
        if state.settings.auth == "off":
            return Principal(None)
        header = request.headers.get("authorization", "")
        scheme, _, token = header.partition(" ")
        if scheme.lower() != "bearer" or not token:
            raise HTTPException(401, "a bearer token is required")
        issuer, subject = await state.verifier(token)
        account_id, outcome = await state.authority.resolve(issuer, subject)
        if outcome == "account_not_active":
            raise HTTPException(403, "account_not_active")
        if outcome != "ok" or not account_id:
            raise HTTPException(401, outcome)
        if not await state.authority.can(account_id, permission):
            raise HTTPException(403, f"{permission} is required")
        return Principal(account_id)

    return Depends(dependency)


async def authenticated(request: Request) -> Principal:
    """Authenticated principal without a platform permission: record-level checks happen in the package against the `auth` schema."""
    state = request.app.state
    if state.settings.auth == "off":
        return Principal(None)
    header = request.headers.get("authorization", "")
    scheme, _, token = header.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(401, "a bearer token is required")
    issuer, subject = await state.verifier(token)
    account_id, outcome = await state.authority.resolve(issuer, subject)
    if outcome == "account_not_active":
        raise HTTPException(403, "account_not_active")
    if outcome != "ok" or not account_id:
        raise HTTPException(401, outcome)
    return Principal(account_id)
