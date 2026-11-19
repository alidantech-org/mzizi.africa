"""Variations: one row of variations."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class VariationsRow(BaseModel):
    """One change to an executed contract: a variation of price or scope, an extension, a renewal or a termination."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "civic.variations"

    amount_delta_minor_units: int | None = None
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    contract_id: UUID
    created_at: datetime
    currency_id: UUID | None = None
    deleted_at: datetime | None = None
    id: UUID
    kind_id: UUID
    new_end_on: date | None = None
    reason: Annotated[str, Field(max_length=4000)] | None = None
    signed_on: date | None = None
    source_citation_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
