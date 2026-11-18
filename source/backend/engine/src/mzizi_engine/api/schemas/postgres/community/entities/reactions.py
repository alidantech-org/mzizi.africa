"""Reactions: one row of reactions."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.subject_table import SubjectTable


class ReactionsRow(BaseModel):
    """One reaction (a like) by one actor to one subject; one per actor, kind and subject, reversible."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.reactions"

    actor_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    kind_id: UUID
    subject_id: UUID
    subject_table: SubjectTable
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
