"""Participants: one row of participants."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ParticipantsRow(BaseModel):
    """One organisation or person taking part in one occurrence in a role."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "event.participants"

    created_at: datetime
    deleted_at: datetime | None = None
    entity_id: UUID | None = None
    id: UUID
    individual_id: UUID | None = None
    occurrence_id: UUID
    role_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
