"""Bids: one row of bids."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class BidsRow(BaseModel):
    """One supplier submission to one procurement process, with the reported amount and outcome where known."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "civic.bids"

    amount_minor_units: Annotated[int, Field(ge=0)] | None = None
    bidder_entity_id: UUID
    created_at: datetime
    currency_id: UUID | None = None
    deleted_at: datetime | None = None
    id: UUID
    outcome_id: UUID
    procurement_id: UUID
    source_citation_id: UUID | None = None
    submitted_on: date | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
