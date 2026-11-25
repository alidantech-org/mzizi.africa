"""Relationships: one row of relationships."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class GovernanceRelationshipsRow(BaseModel):
    """A structural link from law: a ministry part of the executive, a committee part of its house."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.relationships"

    created_at: datetime
    deleted_at: datetime | None = None
    from_id: UUID
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    kind_term: UUID
    provision_id: UUID | None = None
    to_id: UUID
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
