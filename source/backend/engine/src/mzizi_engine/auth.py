"""Engine authentication and authorization: the same OIDC identities and the same `auth` schema as the NestJS API.

The engine invents no accounts or permissions. A bearer token proves (issuer, subject); `auth.resolve_identity` maps it
to an account and `auth.can_platform` checks a platform permission such as engine.read, engine.edit or engine.publish.
Service actors (the NestJS API, scripts, agents) are ordinary accounts of the auth schema.
"""
from __future__ import annotations

import asyncio
from dataclasses import dataclass
from typing import Protocol

from fastapi import Depends, HTTPException, Request

from .config import Settings


@dataclass(frozen=True)
class Principal:
    account_id: str | None  # None only when ENGINE_AUTH=off


class Authority(Protocol):
    async def resolve(self, issuer: str, subject: str) -> tuple[str | None, str]: ...
    async def can(self, account_id: str, permission: str) -> bool: ...


class DatabaseAuthority:
    """Calls auth.resolve_identity and auth.can_platform in mzizi_new through the database package."""

    def __init__(self, database_url: str) -> None:
        self.url = database_url

    def _resolve(self, issuer: str, subject: str):
        from mzizi_database import connect

        with connect(self.url) as conn:
            row = conn.execute("SELECT account_id, outcome FROM auth.resolve_identity(%s, %s)", (issuer, subject)).fetchone()
        return (str(row["account_id"]) if row and row["account_id"] else None, row["outcome"] if row else "unknown_identity")

    def _can(self, account_id: str, permission: str) -> bool:
        from mzizi_database import connect

        with connect(self.url) as conn:
            return bool(conn.execute("SELECT auth.can_platform(%s, %s) AS ok", (account_id, permission)).fetchone()["ok"])

    async def resolve(self, issuer, subject):
        return await asyncio.to_thread(self._resolve, issuer, subject)

    async def can(self, account_id, permission):
        return await asyncio.to_thread(self._can, account_id, permission)


class TokenVerifier(Protocol):
    async def __call__(self, token: str) -> tuple[str, str]: ...


def oidc_verifier(settings: Settings) -> TokenVerifier:
    """Verifies signature, issuer, expiry (and audience if set) with the issuer's JWKS; returns (issuer, subject)."""
    import jwt

    client = jwt.PyJWKClient(settings.jwks_url) if settings.jwks_url else None

    async def verify(token: str) -> tuple[str, str]:
        if not settings.issuer or client is None:
            raise HTTPException(503, "authentication is not configured (AUTH_ISSUER, AUTH_JWKS_URL)")

        def decode():
            key = client.get_signing_key_from_jwt(token).key
            return jwt.decode(token, key, algorithms=["RS256", "ES256", "EdDSA"], issuer=settings.issuer, audience=settings.audience, options={"require": ["exp", "sub"], "verify_aud": bool(settings.audience)})

        try:
            claims = await asyncio.to_thread(decode)
        except jwt.PyJWTError as error:
            raise HTTPException(401, "invalid or expired token") from error
        return settings.issuer, claims["sub"]

    return verify


def require(permission: str):
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
