"""Stages: one row of stages."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.stage_outcome import StageOutcome


class StagesRow(BaseModel):
    """A stage a bill passes through."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "legislature.stages"

    bill_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    kind_term: UUID
    motion_id: UUID | None = None
    on_date: date | None = None
    outcome: StageOutcome | None = None
    sequence: Annotated[int, Field(ge=1)]
    sitting_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
