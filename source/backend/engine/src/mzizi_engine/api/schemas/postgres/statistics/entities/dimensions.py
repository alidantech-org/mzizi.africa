"""Dimensions: one row of dimensions."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class DimensionsRow(BaseModel):
    """Which breakdowns an indicator allows, in order."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "statistics.dimensions"

    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    indicator_id: UUID
    is_required: bool
    position: Annotated[int, Field(ge=0)]
    scheme_id: UUID
