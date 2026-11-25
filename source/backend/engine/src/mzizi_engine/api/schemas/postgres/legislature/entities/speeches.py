"""Speeches: one row of speeches."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class SpeechesRow(BaseModel):
    """One speech in a sitting."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "legislature.speeches"

    bill_id: UUID | None = None
    country_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    hansard_id: UUID | None = None
    holder_id: UUID | None = None
    id: UUID
    kind_term: UUID
    motion_id: UUID | None = None
    page: Annotated[int, Field(ge=1)] | None = None
    position: Annotated[int, Field(ge=1)]
    sitting_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
    word_count: Annotated[int, Field(ge=0)] | None = None
