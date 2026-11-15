"""Relationships: one row of relationships."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class GeographyRelationshipsRow(BaseModel):
    """A typed, dated directed relationship between features; separate rows allow overlapping administrative, electoral, statistical and other systems."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "geography.relationships"

    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    object_feature_id: UUID
    relationship_kind_id: UUID
    source_ref_id: UUID | None = None
    subject_feature_id: UUID
    system_id: UUID
    updated_at: datetime
    valid_from: date | None = None
    valid_until: date | None = None
    version: Annotated[int, Field(ge=1)]
