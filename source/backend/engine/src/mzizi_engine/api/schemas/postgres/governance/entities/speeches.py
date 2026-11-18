"""Speeches: one row of speeches."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class SpeechesRow(BaseModel):
    """One member's contribution at a sitting as recorded in the Hansard: a speech, question, answer, statement or ruling. The full text, when stored, is a content row about this speech."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.speeches"

    bill_id: UUID | None = None
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
    hansard_id: UUID | None = None
    holder_id: UUID
    id: UUID
    motion_id: UUID | None = None
    page_reference: Annotated[str, Field(min_length=1, max_length=100)] | None = None
    position: Annotated[int, Field(ge=1)]
    sitting_id: UUID
    source_citation_id: UUID | None = None
    speech_kind_id: UUID
    summary: Annotated[str, Field(max_length=4000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
    word_count: Annotated[int, Field(ge=0)] | None = None
