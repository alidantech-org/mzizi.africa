"""Relationships: one row of relationships."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.date_precision import DatePrecision


class OfficialRelationshipsRow(BaseModel):
    """One directed typed relationship between exactly two Official identities, optionally with an ownership share."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "official.relationships"

    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    confidence: Annotated[float, Field(ge=0, le=1)] | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    ends_on: date | None = None
    evidence_basis_id: UUID | None = None
    evidence_status_id: UUID | None = None
    from_entity_id: UUID | None = None
    from_individual_id: UUID | None = None
    from_to_precision: DatePrecision | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    kind_id: UUID
    share_percentage: Annotated[float, Field(ge=0, le=100)] | None = None
    source_citation_id: UUID | None = None
    starts_on: date | None = None
    to_entity_id: UUID | None = None
    to_individual_id: UUID | None = None
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
