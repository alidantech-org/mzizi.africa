"""Datasets: one row of datasets."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.source.enums.dataset_assembly import DatasetAssembly


class SourceDatasetsRow(BaseModel):
    """A dataset we hold, most often a seed CSV that rows are loaded from: categorised, hashed, and either taken as downloaded or assembled from other inputs."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.datasets"

    assembly: DatasetAssembly
    category_id: UUID | None = None
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    description: Annotated[str, Field(max_length=4000)] | None = None
    file_version_id: UUID | None = None
    format: Annotated[str, Field(min_length=1, max_length=100)]
    id: UUID
    location: Annotated[str, Field(min_length=1, max_length=1000)] | None = None
    sha256: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")] | None = None
    title: Annotated[str, Field(min_length=1, max_length=300)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
