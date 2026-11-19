"""Fulfilments: one row of fulfilments."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class FulfilmentsRow(BaseModel):
    """A recorded link from a promise to what delivered it, with how the link was made and whether it is reviewed."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.fulfilments"

    appropriation_id: UUID | None = None
    bill_id: UUID | None = None
    contract_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    evidence_status_id: UUID
    id: UUID
    instrument_id: UUID | None = None
    kind_id: UUID
    project_id: UUID | None = None
    promise_id: UUID
    recorded_on: date
    source_citation_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
