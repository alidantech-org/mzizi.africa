"""Candidates: one row of candidates."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CandidatesRow(BaseModel):
    """One person's candidature in one contest, retaining party affiliation at election time."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "politics.candidates"

    ballot_order: Annotated[int, Field(ge=1)] | None = None
    candidate_kind_id: UUID
    contest_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    individual_id: UUID
    party_id_at_election: UUID | None = None
    source_citation_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
