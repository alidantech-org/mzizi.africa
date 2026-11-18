"""Country: one row of countries."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CountryRow(BaseModel):
    """Canonical identity for a modern country; not a geographic unit or historical polity."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "reference.countries"

    calling_code: Annotated[str, Field(min_length=2, max_length=5, pattern="^\\+[0-9]{1,4}$")] | None = None
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    continent_id: UUID | None = None
    created_at: datetime
    currency_id: UUID | None = None
    default_language_id: UUID | None = None
    deleted_at: datetime | None = None
    designation_id: UUID | None = None
    established_on: date | None = None
    id: UUID
    is_served: bool
    iso_alpha2: Annotated[str, Field(min_length=2, max_length=2, pattern="^[A-Z]{2}$")] | None = None
    iso_alpha3: Annotated[str, Field(min_length=3, max_length=3, pattern="^[A-Z]{3}$")] | None = None
    iso_numeric: Annotated[str, Field(min_length=3, max_length=3, pattern="^[0-9]{3}$")] | None = None
    name: Annotated[str, Field(min_length=1, max_length=300)]
    official_name: Annotated[str, Field(min_length=1, max_length=300)] | None = None
    recognition_status_id: UUID | None = None
    subdomain: Annotated[str, Field(min_length=1, max_length=100)] | None = None
    subregion_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
