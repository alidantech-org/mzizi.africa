"""Event Rules: one row of event_rules."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.date_precision import DatePrecision


class EventRulesRow(BaseModel):
    """How the dates of an event are produced, with the adjustment the law applies when a date falls on a rest day. Occurrences generated from a rule are projected until announced."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "activities.event_rules"

    adjustment_id: UUID | None = None
    anchor_on: date | None = None
    created_at: datetime
    day_of_month: Annotated[int, Field(ge=1)] | None = None
    deleted_at: datetime | None = None
    event_id: UUID
    from_to_precision: DatePrecision | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    interval_years: Annotated[int, Field(ge=1)] | None = None
    month: Annotated[int, Field(ge=1)] | None = None
    nth_weekday: Annotated[int, Field(ge=1)] | None = None
    rule_kind_id: UUID
    source_citation_id: UUID | None = None
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
    weekday: Annotated[int, Field(ge=1)] | None = None
