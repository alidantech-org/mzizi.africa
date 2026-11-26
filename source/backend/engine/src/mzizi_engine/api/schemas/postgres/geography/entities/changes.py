"""Changes: one row of changes."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.place_change import PlaceChange


class GeographyChangesRow(BaseModel):
    """One edge of a boundary change: splits, merges, creation or dissolution, without overwriting the places."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "geography.changes"

    created_at: datetime
    deleted_at: datetime | None = None
    effective_on: date | None = None
    id: UUID
    kind: PlaceChange
    note: Annotated[str, Field(min_length=1, max_length=4000)] | None = None
    note_language_id: UUID | None = None
    occurrence_id: UUID | None = None
    predecessor_feature_id: UUID | None = None
    successor_feature_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
