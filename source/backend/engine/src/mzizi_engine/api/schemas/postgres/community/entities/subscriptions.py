"""Subscriptions: one row of subscriptions."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.subject_table import SubjectTable


class SubscriptionsRow(BaseModel):
    """An actor following one subject (a place, leader, project, election, tender, institution, supplier, event) for one kind of update."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.subscriptions"

    actor_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    kind_id: UUID
    revoked_at: datetime | None = None
    subject_id: UUID
    subject_table: SubjectTable
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
