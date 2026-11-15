"""Electorates: one row of electorates."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ElectoratesRow(BaseModel):
    """One set of electorate and ballot totals reported for one contest and geographic unit."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "politics.electorates"

    ballots_cast: Annotated[int, Field(ge=0)] | None = None
    contest_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    registered_voters: Annotated[int, Field(ge=0)] | None = None
    rejected_ballots: Annotated[int, Field(ge=0)] | None = None
    source_citation_id: UUID | None = None
    unit_feature_id: UUID
    updated_at: datetime
    valid_ballots: Annotated[int, Field(ge=0)] | None = None
    version: Annotated[int, Field(ge=1)]
