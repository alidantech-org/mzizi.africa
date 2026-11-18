"""Content Tags: one row of content_tags."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ContentTagsRow(BaseModel):
    """Tags a content text; a text may have several."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "filesystem.content_tags"

    content_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    tag_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
