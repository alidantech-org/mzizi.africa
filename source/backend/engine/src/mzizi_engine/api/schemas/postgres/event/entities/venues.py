"""Venues: one row of venues."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class VenuesRow(BaseModel):
    """Where an occurrence takes place."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "event.venues"

    created_at: datetime
    deleted_at: datetime | None = None
    feature_id: UUID | None = None
    id: UUID
    note: Annotated[str, Field(min_length=1, max_length=4000)] | None = None
    note_language_id: UUID | None = None
    occurrence_id: UUID
    role_term: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
