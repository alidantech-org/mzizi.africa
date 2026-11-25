"""Schedules: one row of schedules."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class SchedulesRow(BaseModel):
    """A published timetable of steps counted from an anchor (an election timetable)."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "event.schedules"

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
    issuer_id: UUID | None = None
    kind_term: UUID
    published_on: date | None = None
    status_term: UUID
    supersedes_schedule_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
