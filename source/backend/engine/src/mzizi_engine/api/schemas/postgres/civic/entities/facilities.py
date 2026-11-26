"""Facilities: one row of facilities."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.facility_status import FacilityStatus
from mzizi_engine.api.schemas.postgres.shared.enums.identity_kind import IdentityKind


class FacilitiesRow(BaseModel):
    """A public facility; it shares its geography feature's identity, so "near me" is a spatial query on the feature."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "civic.facilities"

    class_term: UUID
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    country_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    ends_on: date | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    identity_kind: IdentityKind
    institution_id: UUID | None = None
    operator_id: UUID | None = None
    owner_id: UUID | None = None
    ownership_term: UUID | None = None
    starts_on: date | None = None
    status: FacilityStatus | None = None
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
