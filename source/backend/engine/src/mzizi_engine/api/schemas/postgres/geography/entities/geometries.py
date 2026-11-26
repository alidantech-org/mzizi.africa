"""Geometries: one row of geometries."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.geography.enums.geometry_status import GeometryStatus
from mzizi_engine.api.schemas.postgres.shared.enums.geometry_basis import GeometryBasis
from mzizi_engine.api.schemas.postgres.shared.enums.geometry_role import GeometryRole
from mzizi_engine.jsonvalue import JsonValue


class GeometriesRow(BaseModel):
    """One full-detail drawing of a feature with its role, basis and revision. The current drawing has no end year."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "geography.geometries"

    area: float | None = None
    basis: GeometryBasis | None = None
    centroid: JsonValue | None = None
    confidence: Annotated[float, Field(ge=0, le=1)] | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    envelope: JsonValue | None = None
    feature_id: UUID
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    geometry: JsonValue | None = None
    id: UUID
    revision: Annotated[int, Field(ge=1)]
    role: GeometryRole
    status: GeometryStatus
    supersedes_id: UUID | None = None
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
