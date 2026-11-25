"""Versions: one row of versions."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.filesystem.enums.access import Access


class VersionsRow(BaseModel):
    """Immutable exact bytes in object storage, with hash, size and access."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "filesystem.versions"

    access: Access
    content_type: Annotated[str, Field(min_length=1, max_length=255)]
    created_at: datetime
    created_by_snapshot: str
    deleted_at: datetime | None = None
    file_id: UUID
    format_id: UUID | None = None
    id: UUID
    original_filename: Annotated[str, Field(min_length=1, max_length=500)] | None = None
    pinned: bool
    provenance: str
    revision: Annotated[int, Field(ge=1)]
    s3_key: Annotated[str, Field(min_length=1, max_length=1000)]
    sha256: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")]
    size_bytes: Annotated[int, Field(ge=0)]
    updated_at: datetime
    verified_at: datetime
    version: Annotated[int, Field(ge=1)]
