"""Rules: one row of rules."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class RulesRow(BaseModel):
    """When an event recurs."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "event.rules"

    adjustment_term: UUID | None = None
    anchor_on: date | None = None
    created_at: datetime
    day_of_month: Annotated[int, Field(ge=1, le=31)] | None = None
    deleted_at: datetime | None = None
    event_id: UUID
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    interval_years: Annotated[int, Field(ge=1)] | None = None
    kind_term: UUID
    month: Annotated[int, Field(ge=1, le=12)] | None = None
    nth_weekday: Annotated[int, Field(ge=-5, le=5)] | None = None
    rrule: Annotated[str, Field(min_length=1, max_length=500)] | None = None
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
    weekday: Annotated[int, Field(ge=1, le=7)] | None = None
