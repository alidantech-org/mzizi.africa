"""Captures: one row of captures."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CapturesRow(BaseModel):
    """One fetch of a path."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.captures"

    artifact_id: UUID | None = None
    content_type: Annotated[str, Field(min_length=1, max_length=255)] | None = None
    created_at: datetime
    discovered_at: datetime | None = None
    discovery_id: UUID | None = None
    etag: Annotated[str, Field(min_length=1, max_length=1000)] | None = None
    id: UUID
    last_modified: datetime | None = None
    original_url: Annotated[str, Field(max_length=2048)]
    path_id: UUID | None = None
    retrieved_at: datetime
    retrieved_url: Annotated[str, Field(max_length=2048)] | None = None
    source_id: UUID | None = None
    status_code: Annotated[int, Field(ge=100, le=599)] | None = None
