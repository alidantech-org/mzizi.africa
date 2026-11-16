"""Provisions: one row of provisions."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ProvisionsRow(BaseModel):
    """Stable section identity within one instrument; hierarchy must remain within that instrument."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "legal.provisions"

    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9]+(-[a-z0-9]+)*(\\.[a-z0-9]+(-[a-z0-9]+)*){0,15}$")
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    designation: Annotated[str, Field(min_length=1, max_length=255)]
    id: UUID
    instrument_id: UUID
    parent_id: UUID | None = None
    title: Annotated[str, Field(min_length=1, max_length=300)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
