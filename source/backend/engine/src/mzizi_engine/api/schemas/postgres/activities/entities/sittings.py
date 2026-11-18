"""Sittings: one row of sittings."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class SittingsRow(BaseModel):
    """One meeting of a public body on one day."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "activities.sittings"

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
    held_on: date
    id: UUID
    institution_id: UUID
    sitting_kind_id: UUID
    source_citation_id: UUID | None = None
    title: Annotated[str, Field(min_length=1, max_length=300)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
