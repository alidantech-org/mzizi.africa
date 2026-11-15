"""Taggings: one row of taggings."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class TaggingsRow(BaseModel):
    """One tag assignment to exactly one typed file or folder target."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "filesystem.taggings"

    created_at: datetime
    deleted_at: datetime | None = None
    file_id: UUID | None = None
    folder_id: UUID | None = None
    id: UUID
    tag_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
