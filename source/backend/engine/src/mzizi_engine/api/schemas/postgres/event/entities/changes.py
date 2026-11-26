"""Changes: one row of changes."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.occurrence_change import OccurrenceChange


class EventChangesRow(BaseModel):
    """A postponement, cancellation or move of an occurrence."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "event.changes"

    authority_id: UUID | None = None
    created_at: datetime
    decided_on: date | None = None
    deleted_at: datetime | None = None
    from_on: date | None = None
    id: UUID
    kind: OccurrenceChange
    note: Annotated[str, Field(min_length=1, max_length=4000)] | None = None
    note_language_id: UUID | None = None
    occurrence_id: UUID
    reason_term: UUID | None = None
    replacement_occurrence_id: UUID | None = None
    to_on: date | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
