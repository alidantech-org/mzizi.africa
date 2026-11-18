"""Observations: one row of observations."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ObservationsRow(BaseModel):
    """One figure of one indicator for one place and period, optionally broken down by sex, age, residence, ethnicity or language."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "statistics.observations"

    age_group_id: UUID | None = None
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    estimated: bool | None = None
    ethnicity_id: UUID | None = None
    feature_id: UUID
    id: UUID
    indicator_id: UUID
    language_id: UUID | None = None
    period_from: date
    period_to: date | None = None
    residence_id: UUID | None = None
    sex_id: UUID | None = None
    source_citation_id: UUID | None = None
    updated_at: datetime
    value: float
    version: Annotated[int, Field(ge=1)]
