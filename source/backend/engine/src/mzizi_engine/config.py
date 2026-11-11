"""Engine settings, from the environment only.

ENGINE_HOST / ENGINE_PORT     bind address (default 127.0.0.1:8760; the API is local, called by the NestJS API, scripts and agents)
ENGINE_AUTH                   oidc (default) or off (development only; refused unless bound to a loopback address)
AUTH_ISSUER, AUTH_JWKS_URL    OIDC verification (shared with the NestJS API)   AUTH_AUDIENCE optional
DATABASE_URL                  database for the engine tables and the auth check (mzizi_new)
ENGINE_STORE                  postgres (default when DATABASE_URL is set) or memory
NESTJS_CALLBACK_URL           where results/events are delivered (HTTP POST, retried from the outbox)   ENGINE_CALLBACK_TOKEN bearer for that call
ENGINE_PROCESS_WORKERS        worker processes for CPU-bound capabilities (default 2)
ENGINE_CAPABILITY_LIMITS      "name=n,name=n" concurrency limits per capability
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field


@dataclass
class Settings:
    host: str = "127.0.0.1"
    port: int = 8760
    auth: str = "oidc"
    issuer: str | None = None
    jwks_url: str | None = None
    audience: str | None = None
    database_url: str | None = None
    store: str = "memory"
    callback_url: str | None = None
    callback_token: str | None = None
    process_workers: int = 2
    default_concurrency: int = 4
    limits: dict[str, int] = field(default_factory=dict)
    max_attempts: int = 3
    retry_base_seconds: float = 1.0

    @classmethod
    def from_env(cls, environ: dict | None = None) -> Settings:
        env = environ if environ is not None else os.environ
        limits = {}
        for part in filter(None, (env.get("ENGINE_CAPABILITY_LIMITS") or "").split(",")):
            name, _, count = part.partition("=")
            limits[name.strip()] = int(count)
        url = env.get("DATABASE_URL")
        return cls(
            host=env.get("ENGINE_HOST", "127.0.0.1"),
            port=int(env.get("ENGINE_PORT", "8760")),
            auth=env.get("ENGINE_AUTH", "oidc"),
            issuer=env.get("AUTH_ISSUER"),
            jwks_url=env.get("AUTH_JWKS_URL"),
            audience=env.get("AUTH_AUDIENCE"),
            database_url=url,
            store=env.get("ENGINE_STORE", "postgres" if url else "memory"),
            callback_url=env.get("NESTJS_CALLBACK_URL"),
            callback_token=env.get("ENGINE_CALLBACK_TOKEN"),
            process_workers=int(env.get("ENGINE_PROCESS_WORKERS", "2")),
            limits=limits,
        )

    def check(self) -> None:
        if self.auth not in ("oidc", "off"):
            raise ValueError("ENGINE_AUTH must be oidc or off")
        if self.auth == "off" and self.host not in ("127.0.0.1", "::1", "localhost"):
            raise ValueError("ENGINE_AUTH=off is allowed only when bound to a loopback address")
