"""Units: one row of units."""

from __future__ import annotations

from datetime import date
from typing import ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class UnitsRow(BaseModel):
    """A formally defined administrative, electoral, statistical or historical territorial specialization of one feature; country membership is optional for historic and cross-border units."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "geography.units"

    country_id: UUID | None = None
    feature_id: UUID
    valid_from: date | None = None
    valid_until: date | None = None
