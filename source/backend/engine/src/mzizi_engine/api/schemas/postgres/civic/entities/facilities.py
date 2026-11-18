"""Facilities: one row of facilities."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class FacilitiesRow(BaseModel):
    """The civic role of a geographic feature: a school, hospital, office, road, market or polling host. Size and capacity are observations on the feature; what it is and its levels are classifications; money reaches it through project links."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "civic.facilities"

    closed_on: date | None = None
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
    facility_class_id: UUID
    feature_id: UUID
    id: UUID
    opened_on: date | None = None
    operator_entity_id: UUID | None = None
    owner_entity_id: UUID | None = None
    ownership_id: UUID | None = None
    responsible_institution_id: UUID | None = None
    source_citation_id: UUID | None = None
    status_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
