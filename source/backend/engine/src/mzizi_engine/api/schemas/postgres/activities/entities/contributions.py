"""Contributions: one row of contributions."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ContributionsRow(BaseModel):
    """One member's speech, question or statement at a sitting."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "activities.contributions"

    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    contribution_kind_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    holder_id: UUID
    id: UUID
    motion_id: UUID | None = None
    sitting_id: UUID
    source_citation_id: UUID | None = None
    summary: Annotated[str, Field(max_length=4000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
    word_count: Annotated[int, Field(ge=0)] | None = None
