"""Geometries: one row of geometries."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.date_precision import DatePrecision
from mzizi_engine.jsonvalue import JsonValue


class GeometriesRow(BaseModel):
    """One drawing of a feature: a revision with a role, a basis, a confidence, a zoom range, a validity period and the stored file it came from. A feature has many; the current one has no end date."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "geography.geometries"

    area: float
    basis_id: UUID
    centroid: JsonValue
    confidence: Annotated[float, Field(ge=0, le=1)] | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    envelope: JsonValue
    feature_id: UUID
    from_to_precision: DatePrecision | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    geometry: JsonValue
    geometry_role_id: UUID
    id: UUID
    max_zoom: Annotated[int, Field(ge=0)] | None = None
    min_zoom: Annotated[int, Field(ge=0)] | None = None
    observed_at: datetime | None = None
    revision: Annotated[int, Field(ge=1)]
    srid: Annotated[int, Field(ge=1)]
    supersedes_id: UUID | None = None
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
