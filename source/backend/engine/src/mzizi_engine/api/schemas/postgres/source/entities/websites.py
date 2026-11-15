"""Websites: one row of websites."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class WebsitesRow(BaseModel):
    """Website-specific identity attached to a source channel."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.websites"

    canonical_url: Annotated[str, Field(max_length=2048)]
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    source_id: UUID
    title: Annotated[str, Field(min_length=1, max_length=300)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
