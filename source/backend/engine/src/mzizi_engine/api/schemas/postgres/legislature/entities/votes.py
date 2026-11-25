"""Votes: one row of votes."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.legislature.enums.vote_choice import VoteChoice


class VotesRow(BaseModel):
    """How one member voted on one motion."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "legislature.votes"

    choice: VoteChoice
    country_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    holder_id: UUID
    id: UUID
    motion_id: UUID
    party_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
