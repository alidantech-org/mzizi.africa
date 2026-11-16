"""File Extensions: one row of file_extensions."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class FileExtensionsRow(BaseModel):
    """Technical filename suffix and media-type hint; never a semantic document classification."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "filesystem.file_extensions"

    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9]+(-[a-z0-9]+)*(\\.[a-z0-9]+(-[a-z0-9]+)*){0,15}$")
    ]
    content_type: Annotated[str, Field(min_length=1, max_length=255)]
    created_at: datetime
    deleted_at: datetime | None = None
    description: Annotated[str, Field(max_length=4000)] | None = None
    extension: Annotated[str, Field(min_length=1, max_length=100)]
    id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
