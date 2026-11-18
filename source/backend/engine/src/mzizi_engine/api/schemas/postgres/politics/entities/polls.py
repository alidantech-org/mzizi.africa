"""Polls: one row of polls."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class PollsRow(BaseModel):
    """One station's operation in one election: its host that day, its registered voters, streams and opening times, and whether it operated. The station itself is a feature and a civic facility; its code is a geography identifier; votes are electorates and results with the station feature as the unit."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "politics.polls"

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
    host_feature_id: UUID | None = None
    id: UUID
    note: Annotated[str, Field(max_length=4000)] | None = None
    opens_at: datetime | None = None
    registered_voters: Annotated[int, Field(ge=0)] | None = None
    source_citation_id: UUID | None = None
    station_feature_id: UUID
    status_id: UUID
    stream_count: Annotated[int, Field(ge=1)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
