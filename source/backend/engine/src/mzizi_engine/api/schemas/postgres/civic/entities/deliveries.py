"""Deliveries: one row of deliveries."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class DeliveriesRow(BaseModel):
    """One dated deliverable or milestone under a contract, optionally scoped to a geographic unit."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "civic.deliveries"

    amount_minor_units: Annotated[int, Field(ge=0)] | None = None
    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9]+(-[a-z0-9]+)*(\\.[a-z0-9]+(-[a-z0-9]+)*){0,15}$")
    ]
    contract_id: UUID
    created_at: datetime
    currency_id: UUID | None = None
    deleted_at: datetime | None = None
    delivered_on: date | None = None
    delivery_kind_id: UUID
    id: UUID
    source_citation_id: UUID | None = None
    unit_feature_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
