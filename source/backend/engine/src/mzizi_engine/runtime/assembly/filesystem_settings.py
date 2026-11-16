"""Filesystem settings: the one place the environment is read for it. Every value is required; nothing is guessed."""

from __future__ import annotations

from collections.abc import Mapping
from pathlib import Path

from pydantic import BaseModel, ConfigDict

from mzizi_filesystem import FilesystemConfig, S3Settings

DATABASE_URL = "MZIZI_DB_URL"
S3_ENDPOINT, S3_PUBLIC_ENDPOINT = "S3_ENDPOINT", "S3_PUBLIC_ENDPOINT"
S3_ACCESS_KEY, S3_SECRET_KEY = "S3_ACCESS_KEY", "S3_SECRET_KEY"
S3_BUCKET, S3_REGION = "S3_BUCKET", "S3_REGION"
PROTECTED_PREFIXES = "FILESYSTEM_PROTECTED_PREFIXES"
RESERVED_ROOTS = "FILESYSTEM_RESERVED_ROOTS"
TEMP_PREFIX = "FILESYSTEM_TEMP_PREFIX"
MEDIA_FORMATS = "FILESYSTEM_MEDIA_FORMATS"
MEMORY_STORE = "ENGINE_STORE_MEMORY"
INPUT_ROOT = "ENGINE_INPUT_ROOT"


class FilesystemSettingsError(ValueError):
    """Required filesystem settings are missing; the message names each one."""


class FilesystemSettings(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    database_url: str
    config: FilesystemConfig
    #: `None` selects the in-memory store (development and tests only).
    s3: S3Settings | None
    media_formats_path: Path | None
    input_root: Path | None

    @classmethod
    def from_env(cls, env: Mapping[str, str]) -> FilesystemSettings:
        memory = env.get(MEMORY_STORE) == "1"
        required = [DATABASE_URL, S3_BUCKET, S3_REGION, PROTECTED_PREFIXES, RESERVED_ROOTS, TEMP_PREFIX]
        if not memory:
            required += [S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY]
        missing = [name for name in required if name not in env or env[name] == ""]
        if missing:
            raise FilesystemSettingsError(f"filesystem settings missing: {', '.join(missing)}")
        public = env.get(S3_PUBLIC_ENDPOINT) or None
        s3 = (
            None
            if memory
            else S3Settings(
                endpoint=env[S3_ENDPOINT],
                public_endpoint=public,
                access_key=env[S3_ACCESS_KEY],
                secret_key=env[S3_SECRET_KEY],
                bucket=env[S3_BUCKET],
                region=env[S3_REGION],
            )
        )
        return cls(
            database_url=env[DATABASE_URL],
            config=FilesystemConfig(
                bucket=env[S3_BUCKET],
                region=env[S3_REGION],
                public_endpoint=public,
                protected_prefixes=_list(env[PROTECTED_PREFIXES]),
                reserved_roots=_list(env[RESERVED_ROOTS]),
                temp_prefix=env[TEMP_PREFIX],
            ),
            s3=s3,
            media_formats_path=Path(env[MEDIA_FORMATS]) if env.get(MEDIA_FORMATS) else None,
            input_root=Path(env[INPUT_ROOT]).resolve() if env.get(INPUT_ROOT) else None,
        )


def _list(text: str) -> tuple[str, ...]:
    """A comma-separated setting; `-` means an explicitly empty list."""
    return () if text.strip() == "-" else tuple(part.strip() for part in text.split(",") if part.strip())
