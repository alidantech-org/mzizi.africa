"""Findings: one row of findings."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.finding_status import FindingStatus


class FindingsRow(BaseModel):
    """An audit finding about an institution in a fiscal period."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "finance.findings"

    amount: Annotated[int, Field(ge=0)] | None = None
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    contract_id: UUID | None = None
    created_at: datetime
    currency_id: UUID | None = None
    deleted_at: datetime | None = None
    flow_country_id: UUID | None = None
    flow_id: UUID | None = None
    id: UUID
    institution_id: UUID
    kind_term: UUID
    period_id: UUID
    project_id: UUID | None = None
    status: FindingStatus
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
