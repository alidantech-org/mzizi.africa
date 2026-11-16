"""Authenticate the internal engine API using the configured service key or OIDC authority."""

from __future__ import annotations

import asyncio
from dataclasses import dataclass
from hmac import compare_digest
from typing import Any, Protocol

import httpx
from fastapi import Depends, HTTPException, Request

from mzizi_engine.config import ServerConfig


@dataclass(frozen=True)
class Principal:
    account_id: str | None  # Service and unauthenticated calls have no end-user account.


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


class TokenVerifier(Protocol):
    async def __call__(self, token: str) -> tuple[str, str]: ...


def oidc_verifier(settings: ServerConfig) -> TokenVerifier:
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
    """Authenticate requests and apply platform permission checks to OIDC accounts."""

    async def dependency(request: Request) -> Principal:
        principal = await authenticated(request)
        if principal.account_id is not None and not await request.app.state.authority.can(
            principal.account_id, permission
        ):
            raise HTTPException(403, f"{permission} is required")
        return principal

    return Depends(dependency)


async def authenticated(request: Request) -> Principal:
    """Resolve the service or OIDC principal for the protected route."""
    state = request.app.state
    if state.settings.auth == "off":
        return Principal(None)
    header = request.headers.get("authorization", "")
    scheme, _, token = header.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(401, "a bearer token is required")
    if state.settings.auth == "service":
        expected = state.settings.service_token
        if not expected or not compare_digest(token.encode(), expected.encode()):
            raise HTTPException(403, "invalid service credential")
        return Principal(None)
    issuer, subject = await state.verifier(token)
    account_id, outcome = await state.authority.resolve(issuer, subject)
    if outcome == "account_not_active":
        raise HTTPException(403, "account_not_active")
    if outcome != "ok" or not account_id:
        raise HTTPException(401, outcome)
    return Principal(account_id)
