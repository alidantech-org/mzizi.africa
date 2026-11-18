"""Stages: one row of stages."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class StagesRow(BaseModel):
    """One step of a bill's passage in order: a reading, a committee, a vote in the other house, assent, publication."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.stages"

    bill_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    motion_id: UUID | None = None
    on_date: date | None = None
    outcome_id: UUID | None = None
    sequence_number: Annotated[int, Field(ge=1)]
    sitting_id: UUID | None = None
    source_citation_id: UUID | None = None
    stage_kind_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
