"""Places: one row of places."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class PlacesRow(BaseModel):
    """A place an actor saved."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.places"

    actor_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    feature_id: UUID
    id: UUID
    is_home: bool
    label: Annotated[str, Field(min_length=1, max_length=100)]
    position: Annotated[int, Field(ge=0)] | None = None
    suggestion_term: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
