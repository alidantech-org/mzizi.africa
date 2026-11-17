"""Projects: one row of projects."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ProjectsRow(BaseModel):
    """One public development or infrastructure project with responsible institution, status, geographic scope and evidence."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "civic.projects"

    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    completed_on: date | None = None
    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    description: Annotated[str, Field(max_length=4000)]
    id: UUID
    implementing_entity_id: UUID | None = None
    name: Annotated[str, Field(min_length=1, max_length=300)]
    responsible_institution_id: UUID | None = None
    scope_unit_feature_id: UUID | None = None
    source_citation_id: UUID | None = None
    sponsor_entity_id: UUID | None = None
    started_on: date | None = None
    status_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
