"""Occurrences: one row of occurrences."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class EventOccurrencesRow(BaseModel):
    """One happening of an event, with planned and actual dates."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "event.occurrences"

    actual_ends_on: date | None = None
    actual_starts_on: date | None = None
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    continues_occurrence_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    event_id: UUID
    format_term: UUID | None = None
    id: UUID
    is_all_day: bool
    knowledge_term: UUID
    organiser_id: UUID | None = None
    planned_ends_on: date | None = None
    planned_starts_on: date
    starts_at: datetime | None = None
    status_term: UUID
    timezone_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
