"""Relationships: one row of relationships."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class OfficialRelationshipsRow(BaseModel):
    """One directed typed relationship between exactly two Official identities, optionally with an ownership share."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "official.relationships"

    created_at: datetime
    deleted_at: datetime | None = None
    from_entity_id: UUID | None = None
    from_individual_id: UUID | None = None
    id: UUID
    kind_id: UUID
    share_percentage: Annotated[float, Field(ge=0, le=100)] | None = None
    source_citation_id: UUID | None = None
    to_entity_id: UUID | None = None
    to_individual_id: UUID | None = None
    updated_at: datetime
    valid_from: date | None = None
    valid_until: date | None = None
    version: Annotated[int, Field(ge=1)]
