"""Motions: one row of motions."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class MotionsRow(BaseModel):
    """One matter put to a sitting: a bill, motion, budget decision or other resolution, with its outcome."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "activities.motions"

    budget_version_id: UUID | None = None
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
    fiscal_period_id: UUID | None = None
    id: UUID
    instrument_id: UUID | None = None
    motion_kind_id: UUID
    moved_by_holder_id: UUID | None = None
    outcome_id: UUID
    provision_id: UUID | None = None
    sitting_id: UUID
    source_citation_id: UUID | None = None
    summary: Annotated[str, Field(max_length=4000)] | None = None
    title: Annotated[str, Field(min_length=1, max_length=300)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
