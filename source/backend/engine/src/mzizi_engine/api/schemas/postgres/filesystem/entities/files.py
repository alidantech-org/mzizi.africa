"""Files: one row of files."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.filesystem.enums.retention import Retention


class FilesRow(BaseModel):
    """Stable logical file identity; equal content hashes may belong to different files."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "filesystem.files"

    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9]+(-[a-z0-9]+)*(\\.[a-z0-9]+(-[a-z0-9]+)*){0,15}$")
    ]
    created_at: datetime
    current_version_id: UUID | None = None
    deleted_at: datetime | None = None
    folder_id: UUID
    id: UUID
    name: Annotated[str, Field(min_length=1, max_length=300)]
    retention: Retention
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
