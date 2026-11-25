"""Stations: one row of stations."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class StationsRow(BaseModel):
    """A polling station in an election."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "election.stations"

    closes_at: datetime | None = None
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    election_id: UUID
    feature_id: UUID
    host_id: UUID | None = None
    id: UUID
    note: Annotated[str, Field(min_length=1, max_length=4000)] | None = None
    note_language_id: UUID | None = None
    opens_at: datetime | None = None
    registered_voters: Annotated[int, Field(ge=0)] | None = None
    status_term: UUID | None = None
    streams: Annotated[int, Field(ge=1)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
