"""Calendars: one row of calendars."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CalendarsRow(BaseModel):
    """A way of counting time that gives events their dates: the civil calendar, a lunar calendar, a fiscal or school year."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "events.calendars"

    calendar_kind_id: UUID
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
    description: Annotated[str, Field(max_length=4000)] | None = None
    id: UUID
    is_observed: bool
    source_citation_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
    year_start_day: Annotated[int, Field(ge=1)] | None = None
    year_start_month: Annotated[int, Field(ge=1)] | None = None
