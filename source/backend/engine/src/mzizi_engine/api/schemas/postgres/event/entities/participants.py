"""Participants: one row of participants."""

from __future__ import annotations

from datetime import datetime
from typing import ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ParticipantsRow(BaseModel):
    """Who took part in an occurrence."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "event.participants"

    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    identity_id: UUID
    occurrence_id: UUID
    role_term: UUID
