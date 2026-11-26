"""Fulfilments: one row of fulfilments."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.fulfilment_kind import FulfilmentKind
from mzizi_engine.api.schemas.postgres.shared.enums.fulfilment_status import FulfilmentStatus


class FulfilmentsRow(BaseModel):
    """What delivered (or contradicts) a commitment: a project, contract, appropriation, bill or law."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "politics.fulfilments"

    appropriation_id: UUID | None = None
    bill_id: UUID | None = None
    commitment_id: UUID
    contract_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    instrument_id: UUID | None = None
    kind: FulfilmentKind
    project_id: UUID | None = None
    recorded_on: date | None = None
    status: FulfilmentStatus
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
