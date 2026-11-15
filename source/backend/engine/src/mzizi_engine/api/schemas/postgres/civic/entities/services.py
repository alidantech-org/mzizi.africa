"""Services: one row of services."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ServicesRow(BaseModel):
    """One provider's service provision at a physical place or geographic coverage unit during a service period."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "civic.services"

    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$")
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    description: Annotated[str, Field(max_length=4000)]
    ends_on: date | None = None
    id: UUID
    name: Annotated[str, Field(min_length=1, max_length=300)]
    place_feature_id: UUID | None = None
    provider_entity_id: UUID
    responsible_institution_id: UUID | None = None
    scope_unit_feature_id: UUID | None = None
    service_kind_id: UUID
    source_citation_id: UUID | None = None
    starts_on: date | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
