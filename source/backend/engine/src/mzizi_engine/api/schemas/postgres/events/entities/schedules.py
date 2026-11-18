"""Schedules: one row of schedules."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class SchedulesRow(BaseModel):
    """A published plan of dated items: an election timetable, a school year, a parliamentary calendar. Items are placed by offset from an anchor, so moving the anchor moves the plan."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "events.schedules"

    anchor_event_id: UUID | None = None
    anchor_on: date | None = None
    basis_provision_id: UUID | None = None
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    issuer_entity_id: UUID | None = None
    published_on: date | None = None
    schedule_kind_id: UUID
    source_citation_id: UUID | None = None
    status_id: UUID
    supersedes_schedule_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
