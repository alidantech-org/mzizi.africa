"""Relationships: one row of relationships."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.date_precision import DatePrecision


class GeographyRelationshipsRow(BaseModel):
    """A typed, dated directed relationship between features; separate rows allow overlapping administrative, electoral, statistical and other systems."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "geography.relationships"

    created_at: datetime
    deleted_at: datetime | None = None
    ends_on: date | None = None
    from_to_precision: DatePrecision | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    object_feature_id: UUID
    relationship_kind_id: UUID
    starts_on: date | None = None
    subject_feature_id: UUID
    system_id: UUID
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
