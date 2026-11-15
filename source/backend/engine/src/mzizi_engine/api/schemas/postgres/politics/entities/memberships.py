"""Memberships: one row of memberships."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class PoliticsMembershipsRow(BaseModel):
    """One individual's dated membership in one political party."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "politics.memberships"

    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    individual_id: UUID
    membership_kind_id: UUID
    party_id: UUID
    source_citation_id: UUID | None = None
    updated_at: datetime
    valid_from: date | None = None
    valid_until: date | None = None
    version: Annotated[int, Field(ge=1)]
