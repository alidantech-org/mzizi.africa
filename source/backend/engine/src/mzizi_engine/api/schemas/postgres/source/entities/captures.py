"""Captures: one row of captures."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CapturesRow(BaseModel):
    """Immutable accepted retrieval snapshot with exact bytes; failed requests remain in Operations."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.captures"

    content_hash: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")]
    created_at: datetime
    deleted_at: datetime | None = None
    document_id: UUID | None = None
    file_version_id: UUID
    id: UUID
    manifest_release_id: UUID | None = None
    response_metadata: str
    retrieved_at: datetime
    retrieved_url: Annotated[str, Field(max_length=2048)]
    source_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
