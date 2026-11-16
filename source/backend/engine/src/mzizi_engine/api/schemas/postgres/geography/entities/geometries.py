"""Geometries: one row of geometries."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

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
    file_version_ref_id: UUID | None = None
    geometry: JsonValue
    geometry_role_id: UUID
    id: UUID
    max_zoom: Annotated[int, Field(ge=0)] | None = None
    min_zoom: Annotated[int, Field(ge=0)] | None = None
    observed_at: datetime | None = None
    revision: Annotated[int, Field(ge=1)]
    source_id: UUID | None = None
    srid: Annotated[int, Field(ge=1)]
    supersedes_id: UUID | None = None
    updated_at: datetime
    valid_from: date | None = None
    valid_from_earliest: date | None = None
    valid_from_latest: date | None = None
    valid_until: date | None = None
    valid_until_earliest: date | None = None
    valid_until_latest: date | None = None
    version: Annotated[int, Field(ge=1)]
