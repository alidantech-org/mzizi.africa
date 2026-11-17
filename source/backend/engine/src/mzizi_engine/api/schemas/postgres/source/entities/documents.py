"""Documents: one row of documents."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class DocumentsRow(BaseModel):
    """A distinct piece of content identified by its sha256. The same file fetched from many sources is one document with many captures."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.documents"

    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    content_type: Annotated[str, Field(min_length=1, max_length=255)] | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    file_version_id: UUID | None = None
    id: UUID
    kind_id: UUID
    parent_id: UUID | None = None
    published_on: date | None = None
    publisher_id: UUID | None = None
    sha256: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")]
    size_bytes: Annotated[int, Field(ge=1)] | None = None
    title: Annotated[str, Field(min_length=1, max_length=300)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
