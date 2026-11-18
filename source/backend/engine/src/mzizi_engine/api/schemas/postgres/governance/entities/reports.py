"""Reports: one row of reports."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ReportsRow(BaseModel):
    """One expected or found filing under an obligation, for one reporter and period, with its status and the document when found. Absence is a status, not a missing row."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.reports"

    artifact_id: UUID | None = None
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
    due_on: date | None = None
    filed_on: date | None = None
    id: UUID
    obligation_id: UUID
    period_from: date | None = None
    period_until: date | None = None
    reporter_entity_id: UUID
    source_citation_id: UUID | None = None
    status_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
