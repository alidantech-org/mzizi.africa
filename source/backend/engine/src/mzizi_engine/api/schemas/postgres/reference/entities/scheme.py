"""Scheme: one row of schemes."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class SchemeRow(BaseModel):
    """Stable identity and stewardship snapshot for a controlled vocabulary scheme."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "reference.schemes"

    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9]+(-[a-z0-9]+)*(\\.[a-z0-9]+(-[a-z0-9]+)*){0,15}$")
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    owner_snapshot: Annotated[str, Field(min_length=1, max_length=255)]
    title: Annotated[str, Field(min_length=1, max_length=300)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
