"""Names: one row of names."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class EventNamesRow(BaseModel):
    """The name of an event in one language; at most one preferred name per event and language."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "event.names"

    created_at: datetime
    deleted_at: datetime | None = None
    event_id: UUID
    id: UUID
    is_preferred: bool
    language_id: UUID
    name: Annotated[str, Field(min_length=1, max_length=300)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
