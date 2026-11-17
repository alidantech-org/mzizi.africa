"""Citations: one row of citations."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.subject_table import SubjectTable


class CitationsRow(BaseModel):
    """Exact locator in one artifact: PDF page or paragraph, JSON path, CSV line and column, region or timestamp."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.citations"

    address_id: UUID | None = None
    artifact_id: UUID | None = None
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
    id: UUID
    locator: str
    locator_kind_id: UUID
    quoted_hash: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")] | None = None
    recorded_at: datetime
    subject_id: UUID | None = None
    subject_table: SubjectTable | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
