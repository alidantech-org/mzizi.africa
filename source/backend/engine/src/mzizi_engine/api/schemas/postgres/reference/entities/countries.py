"""Countries: one row of countries."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.identity_kind import IdentityKind


class CountriesRow(BaseModel):
    """A modern country: facts only. Names are `identity.names`, regions are `identity.classifications`, its territory is the `geography.features` row sharing its identity."""

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
    created_at: datetime
    currency_id: UUID | None = None
    deleted_at: datetime | None = None
    designation_term: UUID | None = None
    established_on: date | None = None
    id: UUID
    identity_kind: IdentityKind
    iso_alpha2: Annotated[str, Field(min_length=2, max_length=2, pattern="^[A-Z]{2}$")] | None = None
    iso_alpha3: Annotated[str, Field(min_length=3, max_length=3, pattern="^[A-Z]{3}$")] | None = None
    iso_numeric: Annotated[str, Field(min_length=3, max_length=3, pattern="^[0-9]{3}$")] | None = None
    recognition_term: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
