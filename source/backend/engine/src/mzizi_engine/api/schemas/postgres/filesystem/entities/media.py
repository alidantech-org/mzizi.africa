"""Media: one row of media."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class MediaRow(BaseModel):
    """A logo, symbol, photograph, recording or other media an entity or person can point at; its bytes are a filesystem file version."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "filesystem.media"

    alt_text: Annotated[str, Field(min_length=1, max_length=500)] | None = None
    caption: Annotated[str, Field(max_length=4000)] | None = None
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
    file_version_id: UUID | None = None
    id: UUID
    kind_id: UUID
    source_url: Annotated[str, Field(max_length=2048)] | None = None
    title: Annotated[str, Field(min_length=1, max_length=300)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
