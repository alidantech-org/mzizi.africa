"""Assets: one row of assets."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AssetsRow(BaseModel):
    """A stored GIS file used for a feature or for one of its geometries. One file can serve many features and a feature can have many files. Photographs and video are filesystem media; acquisition and provenance belong to Source."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "geography.assets"

    band: Annotated[int, Field(ge=1)] | None = None
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
    feature_id: UUID
    file_version_id: UUID
    geometry_id: UUID | None = None
    id: UUID
    kind_id: UUID
    layer: Annotated[str, Field(min_length=1, max_length=255)] | None = None
    member: Annotated[str, Field(min_length=1, max_length=1000)] | None = None
    purpose_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
