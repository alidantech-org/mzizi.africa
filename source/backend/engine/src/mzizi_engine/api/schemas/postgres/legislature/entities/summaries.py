"""Summaries: one row of summaries."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.legislature.enums.text_origin import TextOrigin
from mzizi_engine.api.schemas.postgres.legislature.enums.text_status import TextStatus


class SummariesRow(BaseModel):
    """A title or summary of a bill, motion, speech or agenda item in one language."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "legislature.summaries"

    agenda_id: UUID | None = None
    bill_id: UUID | None = None
    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    language_id: UUID
    motion_id: UUID | None = None
    origin: TextOrigin
    speech_id: UUID | None = None
    status: TextStatus
    text: Annotated[str, Field(min_length=1, max_length=8000)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
