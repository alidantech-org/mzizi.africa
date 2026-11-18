"""Contracts: one row of contracts."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ContractsRow(BaseModel):
    """One executed contract with a contractor, optional procurement/project links and contracted amount."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "civic.contracts"

    amount_minor_units: Annotated[int, Field(ge=0)]
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    contractor_entity_id: UUID
    created_at: datetime
    currency_id: UUID
    deleted_at: datetime | None = None
    id: UUID
    nature_id: UUID | None = None
    procurement_id: UUID | None = None
    project_id: UUID | None = None
    signed_on: date | None = None
    source_citation_id: UUID | None = None
    status_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
