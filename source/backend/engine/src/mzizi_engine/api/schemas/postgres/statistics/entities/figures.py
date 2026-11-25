"""Figures: one row of figures."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.figure_basis import FigureBasis
from mzizi_engine.api.schemas.postgres.shared.enums.figure_status import FigureStatus


class FiguresRow(BaseModel):
    """Prepared: the one value to show per indicator or metric, place, subject, period and cell; refreshed after every load."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "statistics.figures"

    basis: FigureBasis
    cell: Annotated[str, Field(max_length=1000)]
    country_id: UUID
    created_at: datetime
    ends_on: date | None = None
    feature_id: UUID
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    indicator_id: UUID | None = None
    lower: float | None = None
    metric_id: UUID | None = None
    observation_id: UUID | None = None
    refreshed_at: datetime
    starts_on: date | None = None
    status: FigureStatus
    subject_id: UUID | None = None
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    upper: float | None = None
    value: float | None = None
