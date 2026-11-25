"""Commitments: one row of commitments."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.politics.enums.commitment_kind import CommitmentKind


class CommitmentsRow(BaseModel):
    """A promise someone with public power made, in their original words, with its status."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "politics.commitments"

    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    due_on: date | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    kind: CommitmentKind
    language_id: UUID
    made_on: date | None = None
    maker_id: UUID
    manifesto_id: UUID | None = None
    occurrence_id: UUID | None = None
    office_id: UUID | None = None
    place_id: UUID | None = None
    quantity: float | None = None
    speech_id: UUID | None = None
    statement: Annotated[str, Field(min_length=1, max_length=8000)]
    status_as_of: date | None = None
    status_term: UUID
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    topic_term: UUID | None = None
    unit_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
