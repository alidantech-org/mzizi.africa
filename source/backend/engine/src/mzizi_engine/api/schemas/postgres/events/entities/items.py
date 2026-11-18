"""Items: one row of items."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ItemsRow(BaseModel):
    """One line of a schedule: an event placed at an offset from the anchor, and the occurrence it became."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "events.items"

    counts_working_days: bool
    created_at: datetime
    deleted_at: datetime | None = None
    event_id: UUID
    id: UUID
    note: Annotated[str, Field(max_length=4000)] | None = None
    occurrence_id: UUID | None = None
    offset_days: int | None = None
    position: Annotated[int, Field(ge=0)]
    schedule_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
