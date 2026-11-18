"""Subjects: one row of subjects."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.subject_table import SubjectTable


class SubjectsRow(BaseModel):
    """What an event is about or belongs to: an election, an institution, a person, a facility, a bill. An election's registration and nomination dates are events attached to it here."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "event.subjects"

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
    event_id: UUID
    id: UUID
    role_id: UUID
    subject_id: UUID
    subject_table: SubjectTable
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
