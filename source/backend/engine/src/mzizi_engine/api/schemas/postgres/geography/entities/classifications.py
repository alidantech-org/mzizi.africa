"""Classifications: one row of classifications."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.date_precision import DatePrecision


class ClassificationsRow(BaseModel):
    """One dated classification of a feature by a scheme value, so a feature can answer several classification questions and change over time."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "geography.classifications"

    created_at: datetime
    deleted_at: datetime | None = None
    feature_id: UUID
    from_to_precision: DatePrecision | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    value_id: UUID
    version: Annotated[int, Field(ge=1)]
