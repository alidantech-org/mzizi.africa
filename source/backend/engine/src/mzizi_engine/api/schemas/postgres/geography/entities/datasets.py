"""Datasets: one row of datasets."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class DatasetsRow(BaseModel):
    """Catalog metadata for vector, raster, climate, elevation, historical and derived datasets. Large assets remain in the existing Filesystem/SeaweedFS S3 system; external references await executable Source and Filesystem contracts."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "geography.datasets"

    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$")
    ]
    coverage_feature_id: UUID | None = None
    created_at: datetime
    crs: Annotated[str, Field(min_length=1, max_length=100)] | None = None
    deleted_at: datetime | None = None
    file_version_ref_id: UUID | None = None
    format: Annotated[str, Field(min_length=1, max_length=100)]
    id: UUID
    quality_notes: Annotated[str, Field(max_length=4000)] | None = None
    representation_id: UUID
    resolution: float | None = None
    resolution_unit_id: UUID | None = None
    source_ref_id: UUID | None = None
    subject_id: UUID
    title: Annotated[str, Field(min_length=1, max_length=255)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
