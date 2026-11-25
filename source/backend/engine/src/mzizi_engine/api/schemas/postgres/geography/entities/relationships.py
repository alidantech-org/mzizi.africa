"""Relationships: one row of relationships."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class GeographyRelationshipsRow(BaseModel):
    """A dated link between places; a parent link in a hierarchy also records the inner place's level."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "geography.relationships"

    created_at: datetime
    deleted_at: datetime | None = None
    ends_on: date | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    hierarchy_id: UUID | None = None
    id: UUID
    kind_term: UUID
    level_id: UUID | None = None
    object_feature_id: UUID
    starts_on: date | None = None
    subject_feature_id: UUID
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
