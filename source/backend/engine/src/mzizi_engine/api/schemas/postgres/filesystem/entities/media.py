"""Media: one row of media."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.subject_table import SubjectTable


class MediaRow(BaseModel):
    """One use of a stored media file by one subject record, which it mentions by table and id. A subject can have many media of any kind and one file can serve many subjects; subjects carry no media pointer."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "filesystem.media"

    alt_text: Annotated[str, Field(min_length=1, max_length=500)] | None = None
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
    description: Annotated[str, Field(max_length=4000)] | None = None
    external_url: Annotated[str, Field(max_length=2048)] | None = None
    file_version_id: UUID | None = None
    id: UUID
    kind_id: UUID
    platform_id: UUID | None = None
    position: Annotated[int, Field(ge=0)] | None = None
    purpose: Annotated[str, Field(max_length=4000)] | None = None
    subject_id: UUID
    subject_table: SubjectTable
    thumbnail_url: Annotated[str, Field(max_length=2048)] | None = None
    title: Annotated[str, Field(min_length=1, max_length=300)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
