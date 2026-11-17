"""Artifacts: one row of artifacts."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ArtifactsRow(BaseModel):
    """One exact representation of an edition, tied to immutable bytes. Identical downloads from many sources are one artifact with many captures."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.artifacts"

    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    content_type: Annotated[str, Field(min_length=1, max_length=255)] | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    description: Annotated[str, Field(max_length=4000)] | None = None
    edition_id: UUID
    file_version_id: UUID | None = None
    format: Annotated[str, Field(min_length=1, max_length=100)] | None = None
    id: UUID
    location: Annotated[str, Field(min_length=1, max_length=1000)] | None = None
    parent_id: UUID | None = None
    sha256: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")]
    size_bytes: Annotated[int, Field(ge=0)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
