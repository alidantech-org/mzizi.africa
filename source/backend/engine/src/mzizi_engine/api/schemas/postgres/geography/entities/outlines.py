"""Outlines: one row of outlines."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.jsonvalue import JsonValue


class OutlinesRow(BaseModel):
    """A prepared, simplified outline of a geometry for one zoom band; rebuilt when its geometry changes."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "geography.outlines"

    band: Annotated[int, Field(ge=0, le=3)]
    bbox: JsonValue
    built_at: datetime
    centroid: JsonValue
    created_at: datetime
    deleted_at: datetime | None = None
    feature_id: UUID
    geometry: JsonValue
    geometry_id: UUID
    id: UUID
    points: Annotated[int, Field(ge=0)]
    tolerance: float
