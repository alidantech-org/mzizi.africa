"""Items: one row of items."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CivicItemsRow(BaseModel):
    """A line item of a contract or bid."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "civic.items"

    bid_id: UUID | None = None
    contract_id: UUID | None = None
    created_at: datetime
    currency_id: UUID | None = None
    deleted_at: datetime | None = None
    good_id: UUID
    id: UUID
    quantity: float
    unit_id: UUID
    unit_price: Annotated[int, Field(ge=0)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
