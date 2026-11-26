"""Procurements: one row of procurements."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.identity_kind import IdentityKind
from mzizi_engine.api.schemas.postgres.shared.enums.procurement_status import ProcurementStatus


class ProcurementsRow(BaseModel):
    """A tender. Its title is an `identity.names` row and its tender number an `identity.identifiers` row."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "civic.procurements"

    amount: Annotated[int, Field(ge=0)] | None = None
    bidder_count: Annotated[int, Field(ge=0)] | None = None
    buyer_id: UUID
    category_term: UUID
    closes_on: date | None = None
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
    currency_id: UUID | None = None
    deleted_at: datetime | None = None
    evaluation_term: UUID | None = None
    id: UUID
    identity_kind: IdentityKind
    nature_term: UUID | None = None
    procedure_term: UUID
    project_id: UUID | None = None
    published_on: date | None = None
    status: ProcurementStatus
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
