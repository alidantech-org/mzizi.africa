"""Motions: one row of motions."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class MotionsRow(BaseModel):
    """A motion debated at a sitting."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "legislature.motions"

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
    id: UUID
    instrument_id: UUID | None = None
    kind_term: UUID
    mover_id: UUID | None = None
    outcome_term: UUID | None = None
    period_id: UUID | None = None
    provision_id: UUID | None = None
    revision_id: UUID | None = None
    sitting_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
