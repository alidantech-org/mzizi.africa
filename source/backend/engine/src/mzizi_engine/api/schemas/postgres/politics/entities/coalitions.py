"""Coalitions: one row of coalitions."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CoalitionsRow(BaseModel):
    """One political coalition identity over an optional effective period."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "politics.coalitions"

    coalition_kind_id: UUID
    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9]+(-[a-z0-9]+)*(\\.[a-z0-9]+(-[a-z0-9]+)*){0,15}$")
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    name: Annotated[str, Field(min_length=1, max_length=300)]
    source_citation_id: UUID | None = None
    updated_at: datetime
    valid_from: date | None = None
    valid_until: date | None = None
    version: Annotated[int, Field(ge=1)]
