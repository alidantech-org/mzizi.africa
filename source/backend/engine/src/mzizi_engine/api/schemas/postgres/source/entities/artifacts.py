"""Artifacts: one row of artifacts."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ArtifactsRow(BaseModel):
    """The bytes as obtained, through a filesystem version."""

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
    created_at: datetime
    deleted_at: datetime | None = None
    edition_id: UUID | None = None
    id: UUID
    parent_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
    version_id: UUID
