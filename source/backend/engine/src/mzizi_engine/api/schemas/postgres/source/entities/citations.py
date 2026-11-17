"""Citations: one row of citations."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CitationsRow(BaseModel):
    """Exact locator in immutable bytes: PDF page/paragraph, JSON path, CSV row/column, region, timestamp or dataset record."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.citations"

    capture_id: UUID | None = None
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    document_id: UUID | None = None
    evidence_id: UUID
    file_version_id: UUID
    id: UUID
    locator: str
    locator_kind_id: UUID
    quoted_hash: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")] | None = None
    recorded_at: datetime
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
