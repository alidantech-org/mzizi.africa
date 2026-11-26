"""Contests: one row of contests."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ContestsRow(BaseModel):
    """One contest in an election: one seat or one referendum question for one area. A contest is generated per seat per cycle and exists before any candidate or result."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "election.contests"

    area_id: UUID | None = None
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    election_id: UUID
    id: UUID
    kind_term: UUID
    office_id: UUID | None = None
    previous_holder_id: UUID | None = None
    reason_term: UUID | None = None
    seat_count: Annotated[int, Field(ge=1)] | None = None
    template_id: UUID | None = None
    term_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
