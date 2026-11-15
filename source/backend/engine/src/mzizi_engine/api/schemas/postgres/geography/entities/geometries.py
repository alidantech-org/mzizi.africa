"""Geometries: one row of geometries."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.jsonvalue import JsonValue


class GeometriesRow(BaseModel):
    """A dated spatial representation version for a feature. The geometry field remains an unsupported Dryv placeholder and is excluded from generation."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "geography.geometries"

    created_at: datetime
    deleted_at: datetime | None = None
    feature_id: UUID
    file_version_ref_id: UUID | None = None
    geometry: JsonValue
    geometry_role_id: UUID
    id: UUID
    observed_at: datetime | None = None
    source_ref_id: UUID | None = None
    srid: Annotated[int, Field(ge=1)]
    updated_at: datetime
    valid_from: date | None = None
    valid_until: date | None = None
    version: Annotated[int, Field(ge=1)]
