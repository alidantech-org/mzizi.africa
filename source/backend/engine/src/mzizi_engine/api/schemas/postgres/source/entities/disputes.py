"""Disputes: one row of disputes."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.subject_table import SubjectTable


class DisputesRow(BaseModel):
    """A recorded disagreement between sources about one record. Both claims are kept with their citations and shown side by side; nothing is overwritten."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.disputes"

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
    kind_id: UUID
    resolution_citation_id: UUID | None = None
    resolved_on: date | None = None
    status_id: UUID
    subject_id: UUID
    subject_table: SubjectTable
    summary: Annotated[str, Field(max_length=4000)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
