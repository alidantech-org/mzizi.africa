"""Individuals: one row of individuals."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class IndividualsRow(BaseModel):
    """One real human identity; names, identifiers and contacts are normalized in shared tables."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "official.individuals"

    birth_date: date | None = None
    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9]+(-[a-z0-9]+)*(\\.[a-z0-9]+(-[a-z0-9]+)*){0,15}$")
    ]
    created_at: datetime
    death_date: date | None = None
    deleted_at: datetime | None = None
    id: UUID
    source_citation_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
