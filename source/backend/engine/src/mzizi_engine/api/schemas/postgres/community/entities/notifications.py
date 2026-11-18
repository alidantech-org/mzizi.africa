"""Notifications: one row of notifications."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.subject_table import SubjectTable


class NotificationsRow(BaseModel):
    """Something that happened to a subject and may be sent to followers; the wording is copy, filled per recipient."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.notifications"

    copy_key: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    kind_id: UUID
    payload: str | None = None
    subject_id: UUID
    subject_table: SubjectTable
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
