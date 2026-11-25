"""Subjects: one row of subjects."""

from __future__ import annotations

from datetime import datetime
from typing import ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class EventSubjectsRow(BaseModel):
    """What an event is about."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "event.subjects"

    created_at: datetime
    deleted_at: datetime | None = None
    event_id: UUID
    id: UUID
    identity_id: UUID
    role_term: UUID
