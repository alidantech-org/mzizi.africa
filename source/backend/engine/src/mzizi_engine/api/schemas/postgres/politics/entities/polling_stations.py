"""Polling Stations: one row of polling_stations."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class PollingStationsRow(BaseModel):
    """One polling place's own identity, separate from the school or hall that hosts it. Registered voters and results per election are electorates and results with the station's feature as the unit."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "politics.polling_stations"

    access_note: Annotated[str, Field(max_length=4000)] | None = None
    closed_on: date | None = None
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    commission_code: Annotated[str, Field(min_length=1, max_length=100)] | None = None
    country_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    feature_id: UUID
    id: UUID
    opened_on: date | None = None
    registration_centre_id: UUID | None = None
    source_citation_id: UUID | None = None
    station_kind_id: UUID
    stream_count: Annotated[int, Field(ge=1)] | None = None
    succeeded_by_station_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
