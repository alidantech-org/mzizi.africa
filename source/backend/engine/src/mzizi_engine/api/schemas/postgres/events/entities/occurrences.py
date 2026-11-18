"""Occurrences: one row of occurrences."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class OccurrencesRow(BaseModel):
    """One dated instance of an event with its planned and actual dates, status, how we know the date, venue and format. Planned dates are never overwritten; changes are recorded."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "events.occurrences"

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
    format_id: UUID | None = None
    id: UUID
    is_all_day: bool
    knowledge_id: UUID
    organiser_entity_id: UUID | None = None
    planned_ends_on: date | None = None
    planned_starts_on: date
    source_citation_id: UUID | None = None
    starts_at: datetime | None = None
    status_id: UUID
    timezone: Annotated[str, Field(min_length=1, max_length=100)] | None = None
    updated_at: datetime
    venue_feature_id: UUID | None = None
    venue_note: Annotated[str, Field(max_length=4000)] | None = None
    version: Annotated[int, Field(ge=1)]
