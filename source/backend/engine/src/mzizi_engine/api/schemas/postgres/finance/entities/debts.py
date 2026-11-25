"""Debts: one row of debts."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.identity_kind import IdentityKind


class DebtsRow(BaseModel):
    """A public debt (a loan or bond)."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "finance.debts"

    amount: Annotated[int, Field(ge=0)] | None = None
    borrower_id: UUID
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    contracted_on: date | None = None
    country_id: UUID
    created_at: datetime
    currency_id: UUID | None = None
    deleted_at: datetime | None = None
    id: UUID
    identity_kind: IdentityKind
    kind_term: UUID
    lender_id: UUID
    maturity_on: date | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
