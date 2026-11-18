"""Venues: one row of venues."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class VenuesRow(BaseModel):
    """One place an occurrence happens at. An occurrence can have many: a national election covers every county and polling place."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "events.venues"

    created_at: datetime
    deleted_at: datetime | None = None
    feature_id: UUID
    id: UUID
    note: Annotated[str, Field(max_length=4000)] | None = None
    occurrence_id: UUID
    role_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
