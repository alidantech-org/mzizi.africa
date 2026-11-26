"""Flows: one row of flows."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.flow_kind import FlowKind


class FlowsRow(BaseModel):
    """A movement of public money: allocation, transfer, disbursement, payment or receipt."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "finance.flows"

    amount: Annotated[int, Field(ge=0)] | None = None
    appropriation_id: UUID | None = None
    class_term: UUID | None = None
    contract_id: UUID | None = None
    counterparty_id: UUID | None = None
    country_id: UUID
    created_at: datetime
    currency_id: UUID | None = None
    debt_id: UUID | None = None
    deleted_at: datetime | None = None
    feature_id: UUID | None = None
    fund_id: UUID | None = None
    id: UUID
    institution_id: UUID | None = None
    kind: FlowKind
    occurred_on: date | None = None
    period_id: UUID | None = None
    project_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
