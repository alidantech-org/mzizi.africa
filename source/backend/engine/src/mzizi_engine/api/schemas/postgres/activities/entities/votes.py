"""Votes: one row of votes."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class VotesRow(BaseModel):
    """One office holder's recorded position on one motion, including being absent."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "activities.votes"

    created_at: datetime
    deleted_at: datetime | None = None
    holder_id: UUID
    id: UUID
    motion_id: UUID
    position_id: UUID
    source_citation_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
