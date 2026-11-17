"""The engine's one configuration: every setting the engine reads from the environment, assembled in this file.

Nothing else in the engine reads the environment. `EngineConfig.load()` reads the repository's git-ignored `.env` (without
overriding variables already set), then builds each section; `EngineConfig.from_env(mapping)` does the same from a mapping,
for tests. A section whose required variables are missing is `None`, and `require_*` raises one error that names them, so a
capability that is not used never needs its settings.

Variables (the root `.env` already carries most of them):

    server      ENGINE_HOST ENGINE_PORT ENGINE_AUTH AUTH_ISSUER AUTH_JWKS_URL AUTH_AUDIENCE ENGINE_SERVICE_TOKEN
                ENGINE_STORE NESTJS_CALLBACK_URL ENGINE_CALLBACK_TOKEN ENGINE_PROCESS_WORKERS ENGINE_CAPABILITY_LIMITS
    postgres    DATABASE_WRITE_URL (the engine writes; the read-only DATABASE_URL is never used for writes)
    mongo       MZIZI_MONGO_URL MZIZI_MONGO_DATABASE   (ENGINE_ACTIVITY_STORE=files turns the activity store off)
    vector      MZIZI_VECTOR_URL (optional; the vector store is a skeleton)
    s3          S3_ENDPOINT S3_BUCKET, credentials S3_ACCESS_KEY/AWS_ACCESS_KEY_ID and S3_SECRET_KEY/AWS_SECRET_ACCESS_KEY,
                region S3_REGION/AWS_DEFAULT_REGION, public endpoint S3_PUBLIC_ENDPOINT/S3_PUBLIC_ORIGIN (optional);
                ENGINE_STORE_MEMORY=1 swaps S3 for an in-memory store (development and tests only)
    filesystem  FILESYSTEM_PROTECTED_PREFIXES FILESYSTEM_RESERVED_ROOTS FILESYSTEM_TEMP_PREFIX (comma lists, `-` for none),
                FILESYSTEM_MEDIA_FORMATS (optional file)
    search      BRAVE_API_KEY, GOOGLE_CSE_API_KEY and GOOGLE_CSE_ID (each provider optional)
    crawler     MZIZI_USER_AGENT, ENGINE_INPUT_ROOT, MZIZI_DEV_ROOT, MZIZI_MARKDOWN_WORKERS,
                MZIZI_MIN_FREE_GB, MZIZI_DEBUG_STACKS, MZIZI_WEB_VOCABULARY
    runs        ENGINE_RUN_STORE, ENGINE_RUN_LOCAL_ROOT, ENGINE_RUN_SCRATCH_ROOT, ENGINE_RUN_RETENTION_DAYS,
                ENGINE_RUN_LOG_RETENTION_DAYS, ENGINE_WORKER_CEILING, ENGINE_RUN_LEASE_SECONDS,
                ENGINE_RUN_CANCEL_GRACE_SECONDS, ENGINE_RUN_MAX_ATTEMPTS, ENGINE_RUN_RETRY_SECONDS
    governor    ENGINE_HOST_REQUESTS_PER_SECOND, ENGINE_HOST_CONCURRENCY, ENGINE_HOST_DAILY_BUDGET,
                ENGINE_REDIS_URL (optional; MongoDB is the fallback)
"""

from __future__ import annotations

import os
from collections.abc import Mapping
from dataclasses import dataclass, field
from pathlib import Path
from typing import Literal

from pydantic import BaseModel, ConfigDict, PositiveFloat, PositiveInt

from mzizi_engine.config.parse import parse_env as parse_env

# ---------------------------------------------------------------------------------------------------- errors


class ConfigError(ValueError):
    """Required settings are missing or invalid; the message names each variable."""


def _missing(section: str, names: list[str]) -> ConfigError:
    return ConfigError(f"{section} settings missing: {', '.join(names)}")


# ---------------------------------------------------------------------------------------------------- sections


@dataclass
class ServerConfig:
    """The HTTP front door and the executor: bind address, authentication, retries, concurrency and callbacks."""

    host: str = "127.0.0.1"
    port: int = 8760
    auth: str = "oidc"
    issuer: str | None = None
    jwks_url: str | None = None
    audience: str | None = None
    database_service_url: str | None = None
    database_service_token: str | None = None
    service_token: str | None = None
    store: str = "memory"
    callback_url: str | None = None
    callback_token: str | None = None
    process_workers: int = 2
    default_concurrency: int = 4
    limits: dict[str, int] = field(default_factory=dict)
    max_attempts: int = 3
    retry_base_seconds: float = 1.0

    @classmethod
    def from_env(cls, env: Mapping[str, str]) -> ServerConfig:
        limits: dict[str, int] = {}
        for part in filter(None, (env.get("ENGINE_CAPABILITY_LIMITS") or "").split(",")):
            name, _, count = part.partition("=")
            limits[name.strip()] = int(count)
        return cls(
            host=env.get("ENGINE_HOST", "127.0.0.1"),
            port=int(env.get("ENGINE_PORT", "8760")),
            auth=env.get("ENGINE_AUTH", "oidc"),
            issuer=env.get("AUTH_ISSUER"),
            jwks_url=env.get("AUTH_JWKS_URL"),
            audience=env.get("AUTH_AUDIENCE"),
            database_service_url=env.get("DATABASE_SERVICE_URL"),
            database_service_token=env.get("DATABASE_SERVICE_TOKEN"),
            service_token=env.get("ENGINE_SERVICE_TOKEN"),
            store=env.get("ENGINE_STORE", "memory"),
            callback_url=env.get("NESTJS_CALLBACK_URL"),
            callback_token=env.get("ENGINE_CALLBACK_TOKEN"),
            process_workers=int(env.get("ENGINE_PROCESS_WORKERS", "2")),
            limits=limits,
        )

    def check(self) -> None:
        if self.auth not in ("service", "oidc", "off"):
            raise ValueError("ENGINE_AUTH must be service, oidc or off")
        if self.auth == "service" and not self.service_token:
            raise ValueError("ENGINE_SERVICE_TOKEN is required when ENGINE_AUTH=service")
        if self.store != "memory":
            raise ValueError(
                "ENGINE_STORE must be memory: persistent job state returns with the engine's own persistence"
            )
        if self.auth == "off" and self.host not in ("127.0.0.1", "::1", "localhost"):
            raise ValueError("ENGINE_AUTH=off is allowed only when bound to a loopback address")


class _Frozen(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")


class PostgresConfig(_Frozen):
    url: str


class MongoConfig(_Frozen):
    url: str
    database: str


class VectorConfig(_Frozen):
    url: str


class S3Config(_Frozen):
    endpoint: str
    public_endpoint: str | None
    access_key: str
    secret_key: str
    bucket: str
    region: str


class FilesystemRules(_Frozen):
    protected_prefixes: tuple[str, ...]
    reserved_roots: tuple[str, ...]
    temp_prefix: str
    media_formats_path: Path | None


class SearchKeys(_Frozen):
    brave_key: str | None
    google_key: str | None
    google_cx: str | None


class CrawlerConfig(_Frozen):
    user_agent: str | None
    input_root: Path | None
    dev_root: Path | None = None
    markdown_workers: int | None = None
    min_free_bytes: int = 8 * 1024**3
    debug_stack_seconds: int | None = None
    vocabulary_path: Path | None = None


class RunsConfig(_Frozen):
    store: Literal["local", "s3"] = "local"
    local_root: Path | None = None
    scratch_root: Path | None = None
    retention_days: PositiveInt | None = None
    log_retention_days: PositiveInt | None = None
    worker_ceiling: PositiveInt = 1
    lease_seconds: PositiveInt = 15
    cancel_grace_seconds: PositiveFloat = 5
    max_attempts: PositiveInt = 3
    retry_seconds: PositiveFloat = 1

    def require_log_retention(self) -> int:
        if self.log_retention_days is None:
            raise _missing("run ledger", ["ENGINE_RUN_LOG_RETENTION_DAYS"])
        return self.log_retention_days


class GovernorConfig(_Frozen):
    model_config = ConfigDict(frozen=True, extra="forbid", allow_inf_nan=False)

    requests_per_second: PositiveFloat
    concurrency: PositiveInt
    daily_budget: PositiveInt
    redis_url: str | None = None


def _path(value: str | None) -> Path | None:
    return Path(value) if value else None


def _int(value: str | None) -> int | None:
    return int(value) if value else None


# Provider names to the variables each needs (names only; values are never shown).
SEARCH_VARIABLES = {"brave": ("BRAVE_API_KEY",), "google": ("GOOGLE_CSE_API_KEY", "GOOGLE_CSE_ID")}


# ---------------------------------------------------------------------------------------------------- the config


class EngineConfig(_Frozen):
    server: ServerConfig
    postgres: PostgresConfig | None
    mongo: MongoConfig | None
    vector: VectorConfig | None
    s3: S3Config | None
    memory_store: bool
    filesystem: FilesystemRules | None
    search: SearchKeys
    runs: RunsConfig = RunsConfig()
    governor: GovernorConfig | None = None
    crawler: CrawlerConfig
    #: `files` turns the MongoDB activity store off (tests, CI); anything else uses MongoDB when it is configured.
    activity_store: str
    script_image_id: str | None = None

    model_config = ConfigDict(frozen=True, extra="forbid", arbitrary_types_allowed=True)

    @classmethod
    def load(cls, env_file: Path | None = None) -> EngineConfig:
        """Read the git-ignored `.env` (never overriding what is already set), then the environment."""
        candidate = env_file or Path(os.environ.get("MZIZI_ENV_FILE") or _repository_root() / ".env")
        if candidate.is_file():
            for key, value in parse_env(candidate.read_text(encoding="utf-8")).items():
                os.environ.setdefault(key, value)
        return cls.from_env(os.environ)

    @classmethod
    def from_env(cls, env: Mapping[str, str]) -> EngineConfig:
        def first(*names: str) -> str | None:
            return next((env[name] for name in names if env.get(name)), None)

        write_url = first("DATABASE_WRITE_URL")
        mongo_url, mongo_db = first("MZIZI_MONGO_URL"), first("MZIZI_MONGO_DATABASE")
        endpoint, bucket = first("S3_ENDPOINT"), first("S3_BUCKET")
        access, secret = first("S3_ACCESS_KEY", "AWS_ACCESS_KEY_ID"), first("S3_SECRET_KEY", "AWS_SECRET_ACCESS_KEY")
        region = first("S3_REGION", "AWS_DEFAULT_REGION")
        public = first("S3_PUBLIC_ENDPOINT", "S3_PUBLIC_ORIGIN")
        rules = [
            first(name)
            for name in ("FILESYSTEM_PROTECTED_PREFIXES", "FILESYSTEM_RESERVED_ROOTS", "FILESYSTEM_TEMP_PREFIX")
        ]
        vector_url = first("MZIZI_VECTOR_URL")
        user_agent, input_root = first("MZIZI_USER_AGENT"), first("ENGINE_INPUT_ROOT")
        media = first("FILESYSTEM_MEDIA_FORMATS")
        rate = first("ENGINE_HOST_REQUESTS_PER_SECOND")
        concurrency = first("ENGINE_HOST_CONCURRENCY")
        daily_budget = first("ENGINE_HOST_DAILY_BUDGET")
        return cls(
            server=ServerConfig.from_env(env),
            postgres=PostgresConfig(url=write_url) if write_url else None,
            mongo=MongoConfig(url=mongo_url, database=mongo_db) if mongo_url and mongo_db else None,
            vector=VectorConfig(url=vector_url) if vector_url else None,
            s3=S3Config(
                endpoint=endpoint,
                public_endpoint=public,
                access_key=access,
                secret_key=secret,
                bucket=bucket,
                region=region,
            )
            if endpoint and access and secret and bucket and region
            else None,
            memory_store=env.get("ENGINE_STORE_MEMORY") == "1",
            filesystem=FilesystemRules(
                protected_prefixes=_list(rules[0] or ""),
                reserved_roots=_list(rules[1] or ""),
                temp_prefix=rules[2] or "",
                media_formats_path=Path(media) if media else None,
            )
            if all(rules)
            else None,
            search=SearchKeys(
                brave_key=first("BRAVE_API_KEY"),
                google_key=first("GOOGLE_CSE_API_KEY"),
                google_cx=first("GOOGLE_CSE_ID"),
            ),
            crawler=CrawlerConfig(
                user_agent=user_agent,
                input_root=Path(input_root).resolve() if input_root else None,
                dev_root=_path(first("MZIZI_DEV_ROOT")),
                markdown_workers=_int(first("MZIZI_MARKDOWN_WORKERS")),
                min_free_bytes=int(float(env.get("MZIZI_MIN_FREE_GB", "8")) * 1024**3),
                debug_stack_seconds=_int(first("MZIZI_DEBUG_STACKS")),
                vocabulary_path=_path(first("MZIZI_WEB_VOCABULARY")),
            ),
            runs=RunsConfig.model_validate(
                {
                    "store": env.get("ENGINE_RUN_STORE", "local"),
                    "local_root": _path(first("ENGINE_RUN_LOCAL_ROOT")),
                    "scratch_root": _path(first("ENGINE_RUN_SCRATCH_ROOT")),
                    "retention_days": _int(first("ENGINE_RUN_RETENTION_DAYS")),
                    "log_retention_days": _int(first("ENGINE_RUN_LOG_RETENTION_DAYS")),
                    "worker_ceiling": int(env.get("ENGINE_WORKER_CEILING", "1")),
                    "lease_seconds": int(env.get("ENGINE_RUN_LEASE_SECONDS", "15")),
                    "cancel_grace_seconds": float(env.get("ENGINE_RUN_CANCEL_GRACE_SECONDS", "5")),
                    "max_attempts": int(env.get("ENGINE_RUN_MAX_ATTEMPTS", "3")),
                    "retry_seconds": float(env.get("ENGINE_RUN_RETRY_SECONDS", "1")),
                }
            ),
            governor=GovernorConfig(
                requests_per_second=float(rate),
                concurrency=int(concurrency),
                daily_budget=int(daily_budget),
                redis_url=first("ENGINE_REDIS_URL"),
            )
            if rate and concurrency and daily_budget
            else None,
            activity_store=env.get("ENGINE_ACTIVITY_STORE", "mongo"),
            script_image_id=first("ENGINE_SCRIPT_IMAGE_ID"),
        )

    # -- sections a capability needs: one error that names every missing variable -----------------------------
    def require_postgres(self) -> PostgresConfig:
        if self.postgres is None:
            raise _missing("PostgreSQL", ["DATABASE_WRITE_URL"])
        return self.postgres

    def require_mongo(self) -> MongoConfig:
        if self.mongo is None:
            raise _missing("MongoDB", ["MZIZI_MONGO_URL", "MZIZI_MONGO_DATABASE"])
        return self.mongo

    def require_user_agent(self) -> str:
        if self.crawler.user_agent is None:
            raise _missing("crawler", ["MZIZI_USER_AGENT"])
        return self.crawler.user_agent

    def require_input_root(self) -> Path:
        return self.crawler.input_root or _repository_root() / "seed"

    def require_search_keys(self) -> SearchKeys:
        brave = self.search_missing("brave")
        google = self.search_missing("google")
        if brave and google:
            raise _missing("search (configure either provider)", brave + google)
        return self.search

    def require_s3(self) -> S3Config | None:
        if self.s3 is None and not self.memory_store:
            raise _missing(
                "S3",
                [
                    "S3_ENDPOINT",
                    "S3_BUCKET",
                    "S3_ACCESS_KEY or AWS_ACCESS_KEY_ID",
                    "S3_SECRET_KEY or AWS_SECRET_ACCESS_KEY",
                    "S3_REGION or AWS_DEFAULT_REGION",
                ],
            )
        return self.s3

    def require_filesystem(self) -> tuple[PostgresConfig, FilesystemRules, S3Config | None]:
        """Everything a `filesystem.*` operation needs; S3 is not needed when the in-memory store is selected."""
        missing = []
        if self.postgres is None:
            missing.append("DATABASE_WRITE_URL")
        if self.filesystem is None:
            missing += ["FILESYSTEM_PROTECTED_PREFIXES", "FILESYSTEM_RESERVED_ROOTS", "FILESYSTEM_TEMP_PREFIX"]
        if self.s3 is None and not self.memory_store:
            missing += [
                "S3_ENDPOINT",
                "S3_BUCKET",
                "S3 credentials (S3_ACCESS_KEY or AWS_ACCESS_KEY_ID, S3_SECRET_KEY or AWS_SECRET_ACCESS_KEY)",
                "S3_REGION or AWS_DEFAULT_REGION",
            ]
        if missing or self.postgres is None or self.filesystem is None:
            raise _missing("filesystem", missing)
        return self.postgres, self.filesystem, self.s3

    def search_missing(self, provider: str) -> list[str]:
        """The variables a search provider still needs; empty when it is configured."""
        present = {
            "BRAVE_API_KEY": self.search.brave_key,
            "GOOGLE_CSE_API_KEY": self.search.google_key,
            "GOOGLE_CSE_ID": self.search.google_cx,
        }
        return [name for name in SEARCH_VARIABLES[provider] if not present[name]]


# ---------------------------------------------------------------------------------------------------- helpers


def _list(text: str) -> tuple[str, ...]:
    """A comma-separated setting; `-` means an explicitly empty list."""
    return () if text.strip() == "-" else tuple(part.strip() for part in text.split(",") if part.strip())


def _repository_root() -> Path:
    for parent in Path(__file__).resolve().parents:
        if (parent / "seed").is_dir() and (parent / "pyproject.toml").is_file():
            return parent
    return Path.cwd()
