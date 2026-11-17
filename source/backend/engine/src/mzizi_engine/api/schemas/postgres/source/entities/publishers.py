"""Publishers: one row of publishers."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class PublishersRow(BaseModel):
    """Accepted publisher; an optional official identity distinguishes organization from publication channel."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.publishers"

    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    kind_id: UUID
    name: Annotated[str, Field(min_length=1, max_length=300)]
    official_entity_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
