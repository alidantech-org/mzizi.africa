"""Contests: one row of contests."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ContestsRow(BaseModel):
    """One office or electoral question contested in an election and one geographic unit."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "politics.contests"

    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9]+(-[a-z0-9]+)*(\\.[a-z0-9]+(-[a-z0-9]+)*){0,15}$")
    ]
    contest_kind_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    election_id: UUID
    id: UUID
    office_id: UUID | None = None
    source_citation_id: UUID | None = None
    unit_feature_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
