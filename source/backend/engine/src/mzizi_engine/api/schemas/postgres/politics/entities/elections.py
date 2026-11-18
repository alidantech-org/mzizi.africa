"""Elections: one row of elections."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ElectionsRow(BaseModel):
    """One electoral event in a country with its kind, status, date, running body, term and source citation. Milestones such as registration and nominations are events attached to it."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "politics.elections"

    authority_entity_id: UUID | None = None
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
    election_kind_id: UUID
    held_on: date
    id: UUID
    parent_election_id: UUID | None = None
    source_citation_id: UUID | None = None
    status_id: UUID | None = None
    term_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
