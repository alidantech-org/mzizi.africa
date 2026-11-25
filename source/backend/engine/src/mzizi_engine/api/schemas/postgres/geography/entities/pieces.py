"""Pieces: one row of pieces."""

from __future__ import annotations

from datetime import datetime
from typing import ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from mzizi_engine.jsonvalue import JsonValue


class PiecesRow(BaseModel):
    """Subdivided polygons with a spatial index, so "where am I?" lookups stay fast even for long coastlines."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "geography.pieces"

    created_at: datetime
    deleted_at: datetime | None = None
    feature_id: UUID
    geometry: JsonValue
    geometry_id: UUID
    id: UUID
