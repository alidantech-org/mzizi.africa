"""Seasons: one row of seasons."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class SeasonsRow(BaseModel):
    """A recurring season of a country or region."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "event.seasons"

    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    country_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    end_day: Annotated[int, Field(ge=1, le=31)] | None = None
    end_month: Annotated[int, Field(ge=1, le=12)]
    feature_id: UUID | None = None
    id: UUID
    is_natural: bool
    kind_term: UUID
    start_day: Annotated[int, Field(ge=1, le=31)] | None = None
    start_month: Annotated[int, Field(ge=1, le=12)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
