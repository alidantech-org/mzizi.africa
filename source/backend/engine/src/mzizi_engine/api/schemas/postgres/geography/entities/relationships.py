"""Relationships: one row of relationships."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.place_relation import PlaceRelation


class GeographyRelationshipsRow(BaseModel):
    """A dated link between places that is not membership of an administrative or electoral hierarchy (a lake inside a county, two wards that border). Hierarchy membership is `geography.areas`."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "geography.relationships"

    created_at: datetime
    deleted_at: datetime | None = None
    ends_on: date | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    kind: PlaceRelation
    object_feature_id: UUID
    starts_on: date | None = None
    subject_feature_id: UUID
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
