"""Partners: one row of partners."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class PartnersRow(BaseModel):
    """A party that shares one contract or one bid with the main bidder or contractor: a joint-venture member, a subcontractor or a guarantor."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "civic.partners"

    bid_id: UUID | None = None
    contract_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    partner_entity_id: UUID
    role_id: UUID
    share_percentage: Annotated[float, Field(ge=0, le=100)] | None = None
    source_citation_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
