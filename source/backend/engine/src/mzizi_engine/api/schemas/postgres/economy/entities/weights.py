"""Weights: one row of weights."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class WeightsRow(BaseModel):
    """A good's weight in a basket."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "economy.weights"

    basket_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    good_id: UUID
    id: UUID
    weight: Annotated[float, Field(ge=0)]
