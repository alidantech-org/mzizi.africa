"""Seasons: one row of seasons."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.date_precision import DatePrecision


class SeasonsRow(BaseModel):
    """A recurring yearly window, natural or human: the long rains, a planting season, a school term, for a country or a place. Gives the calendar its seasonal context and explains recurring patterns in data."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "events.seasons"

    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    country_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    description: Annotated[str, Field(max_length=4000)] | None = None
    end_day: Annotated[int, Field(ge=1)] | None = None
    end_month: Annotated[int, Field(ge=1)]
    from_to_precision: DatePrecision | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    is_natural: bool
    scope_feature_id: UUID | None = None
    season_kind_id: UUID
    source_citation_id: UUID | None = None
    start_day: Annotated[int, Field(ge=1)] | None = None
    start_month: Annotated[int, Field(ge=1)]
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
