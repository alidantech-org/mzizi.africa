"""Relationships: one row of relationships."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class OfficialRelationshipsRow(BaseModel):
    """A kinship, business or political tie between public figures and organisations, always with a source link."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "official.relationships"

    basis_term: UUID
    confidence: Annotated[float, Field(ge=0, le=1)] | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    ends_on: date | None = None
    from_id: UUID
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    kind_term: UUID
    share_percentage: Annotated[float, Field(ge=0, le=100)] | None = None
    starts_on: date | None = None
    status_term: UUID
    to_id: UUID
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
