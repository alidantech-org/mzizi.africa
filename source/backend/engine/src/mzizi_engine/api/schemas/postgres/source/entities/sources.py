"""Sources: one row of sources."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class SourcesRow(BaseModel):
    """Stable publication-channel identity independent of any public website."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.sources"

    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$")
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    description: Annotated[str, Field(max_length=4000)] | None = None
    id: UUID
    kind_id: UUID
    official_entity_id: UUID | None = None
    publisher_id: UUID
    title: Annotated[str, Field(min_length=1, max_length=300)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
