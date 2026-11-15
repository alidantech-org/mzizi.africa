"""Unit: one row of units."""

from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class UnitRow(BaseModel):
    """Measurement unit and conversion to its optional base unit; never a spatial unit."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "reference.units"

    base_id: UUID | None = None
    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$")
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    offset: Decimal
    quantity: Annotated[str, Field(min_length=1, max_length=255)]
    scale: Decimal
    symbol: Annotated[str, Field(min_length=1, max_length=100)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
