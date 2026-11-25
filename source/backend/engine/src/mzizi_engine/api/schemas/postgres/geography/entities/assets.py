"""Assets: one row of assets."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class GeographyAssetsRow(BaseModel):
    """A stored GIS file or prepared map output (tile set, TopoJSON) for a feature, through filesystem versions."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "geography.assets"

    band: Annotated[int, Field(ge=1)] | None = None
    built_at: datetime | None = None
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
    feature_id: UUID
    geometry_id: UUID | None = None
    hierarchy_id: UUID | None = None
    id: UUID
    kind_term: UUID
    layer: Annotated[str, Field(min_length=1, max_length=255)] | None = None
    level_id: UUID | None = None
    member: Annotated[str, Field(min_length=1, max_length=1000)] | None = None
    purpose_term: UUID
    stale_at: datetime | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
    version_id: UUID
