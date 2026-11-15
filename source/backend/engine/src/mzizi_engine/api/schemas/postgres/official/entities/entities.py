"""Entities: one row of entities."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class EntitiesRow(BaseModel):
    """Stable identity for one organization or legally identified entity; its names are stored in official.names."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "official.entities"

    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$")
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    dissolved_on: date | None = None
    id: UUID
    kind_id: UUID
    registered_on: date | None = None
    registration_country_id: UUID | None = None
    source_citation_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
