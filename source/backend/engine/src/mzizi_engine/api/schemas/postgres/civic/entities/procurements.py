"""Procurements: one row of procurements."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ProcurementsRow(BaseModel):
    """One public procurement process run by a buyer, optionally linked to a project."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "civic.procurements"

    awarded_on: date | None = None
    bidder_count: Annotated[int, Field(ge=0)] | None = None
    buyer_entity_id: UUID
    category_id: UUID | None = None
    closes_on: date | None = None
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
    currency_id: UUID | None = None
    deleted_at: datetime | None = None
    estimated_amount_minor_units: Annotated[int, Field(ge=0)] | None = None
    evaluation_basis_id: UUID | None = None
    id: UUID
    nature_id: UUID | None = None
    procedure_kind_id: UUID
    project_id: UUID | None = None
    published_on: date | None = None
    reference: Annotated[str, Field(min_length=1, max_length=300)] | None = None
    source_citation_id: UUID | None = None
    status_id: UUID | None = None
    title: Annotated[str, Field(min_length=1, max_length=300)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
