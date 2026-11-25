"""Observations: one row of observations."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.figure_basis import FigureBasis
from mzizi_engine.api.schemas.postgres.shared.enums.figure_status import FigureStatus


class ObservationsRow(BaseModel):
    """One published figure for an indicator, place, subject, period and breakdown cell, by collection and revision."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "statistics.observations"

    basis: FigureBasis
    cell: Annotated[str, Field(max_length=1000)]
    collection_id: UUID | None = None
    country_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    ends_on: date | None = None
    feature_id: UUID
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    indicator_id: UUID
    lower: float | None = None
    revision: Annotated[int, Field(ge=1)]
    starts_on: date | None = None
    status: FigureStatus
    subject_id: UUID | None = None
    supersedes_id: UUID | None = None
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    upper: float | None = None
    value: float | None = None
    version: Annotated[int, Field(ge=1)]
