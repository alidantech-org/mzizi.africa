"""Relationships: one row of relationships."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class GovernanceRelationshipsRow(BaseModel):
    """One dated, typed relationship between two government institutions."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.relationships"

    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    object_institution_id: UUID
    relationship_kind_id: UUID
    source_citation_id: UUID | None = None
    subject_institution_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
