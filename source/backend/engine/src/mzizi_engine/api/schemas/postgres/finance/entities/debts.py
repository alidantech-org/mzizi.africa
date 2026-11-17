"""Debts: one row of debts."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class DebtsRow(BaseModel):
    """One public debt instrument between a borrower and optional lender, with contracted amount and maturity facts."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "finance.debts"

    amount_minor_units: Annotated[int, Field(ge=0)]
    borrower_entity_id: UUID
    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9]+(-[a-z0-9]+)*(\\.[a-z0-9]+(-[a-z0-9]+)*){0,15}$")
    ]
    contracted_on: date | None = None
    country_id: UUID | None = None
    created_at: datetime
    currency_id: UUID
    debt_kind_id: UUID
    deleted_at: datetime | None = None
    id: UUID
    lender_entity_id: UUID | None = None
    maturity_on: date | None = None
    source_citation_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
