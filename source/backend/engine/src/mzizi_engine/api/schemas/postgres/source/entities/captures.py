"""Captures: one row of captures."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CapturesRow(BaseModel):
    """One retrieval of a path by a source: when, from which link, with what response. The content is a document, shared by every capture of the same bytes; failed requests remain in Operations."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.captures"

    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9]+(-[a-z0-9]+)*(\\.[a-z0-9]+(-[a-z0-9]+)*){0,15}$")
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    document_id: UUID | None = None
    id: UUID
    manifest_release_id: UUID | None = None
    original_url: Annotated[str, Field(max_length=2048)]
    path_id: UUID | None = None
    response_metadata: str
    retrieved_at: datetime
    retrieved_url: Annotated[str, Field(max_length=2048)] | None = None
    source_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
