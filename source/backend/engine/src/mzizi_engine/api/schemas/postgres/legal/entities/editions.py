"""Editions: one row of editions."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class LegalEditionsRow(BaseModel):
    """One edition of an instrument with its consolidation and commencement dates."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "legal.editions"

    ceased_on: date | None = None
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    commenced_on: date | None = None
    consolidated_on: date | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    designation: Annotated[str, Field(min_length=1, max_length=255)]
    id: UUID
    instrument_id: UUID
    repealed_on: date | None = None
    supersedes_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
