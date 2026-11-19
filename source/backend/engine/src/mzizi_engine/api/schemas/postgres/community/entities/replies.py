"""Replies: one row of replies."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.subject_table import SubjectTable


class RepliesRow(BaseModel):
    """A right of reply or correction request from a named person or body about a record, with the identity check and publication state; shown beside any signal about that record."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.replies"

    content_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    published_at: datetime | None = None
    received_at: datetime
    respondent_entity_id: UUID | None = None
    respondent_individual_id: UUID | None = None
    status_id: UUID
    subject_id: UUID
    subject_table: SubjectTable
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
