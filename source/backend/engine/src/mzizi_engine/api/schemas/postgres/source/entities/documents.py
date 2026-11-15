"""Documents: one row of documents."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class DocumentsRow(BaseModel):
    """Stable published document identity; repeated captures retain independent retrieval history."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.documents"

    canonical_url: Annotated[str, Field(max_length=2048)] | None = None
    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$")
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    kind_id: UUID
    published_on: date | None = None
    publisher_id: UUID
    source_id: UUID
    title: Annotated[str, Field(min_length=1, max_length=300)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
