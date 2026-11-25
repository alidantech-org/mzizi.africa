"""Contracts: one row of contracts."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ContractsRow(BaseModel):
    """A signed contract."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "civic.contracts"

    amount: Annotated[int, Field(ge=0)] | None = None
    buyer_id: UUID
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    contractor_id: UUID
    created_at: datetime
    currency_id: UUID | None = None
    deleted_at: datetime | None = None
    ends_on: date | None = None
    id: UUID
    nature_term: UUID
    procurement_id: UUID | None = None
    project_id: UUID | None = None
    signed_on: date | None = None
    starts_on: date | None = None
    status_term: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
