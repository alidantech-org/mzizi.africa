"""Bids: one row of bids."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.bid_outcome import BidOutcome


class BidsRow(BaseModel):
    """A bid on a tender, including cheaper bids that lost."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "civic.bids"

    amount: Annotated[int, Field(ge=0)] | None = None
    bidder_id: UUID
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    created_at: datetime
    currency_id: UUID | None = None
    deleted_at: datetime | None = None
    id: UUID
    outcome: BidOutcome
    procurement_id: UUID
    submitted_on: date | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
