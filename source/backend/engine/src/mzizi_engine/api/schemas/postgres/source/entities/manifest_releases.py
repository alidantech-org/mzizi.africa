"""Manifest Releases: one row of manifest_releases."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.source.enums.release_status import ReleaseStatus


class ManifestReleasesRow(BaseModel):
    """Pinned approved manifest content; schema and capabilities are immutable release inputs."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.manifest_releases"

    approved_at: datetime
    approved_by_snapshot: str
    content_hash: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")]
    created_at: datetime
    deleted_at: datetime | None = None
    effective_from: datetime
    effective_until: datetime | None = None
    file_version_id: UUID
    id: UUID
    input_schema_code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    input_schema_version: Annotated[str, Field(min_length=1, max_length=100)]
    manifest_id: UUID
    release_label: Annotated[str, Field(min_length=1, max_length=100)]
    required_capabilities: str
    status: ReleaseStatus
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
