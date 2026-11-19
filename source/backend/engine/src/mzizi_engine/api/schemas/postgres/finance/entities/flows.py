"""Flows: one row of flows."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class FlowsRow(BaseModel):
    """One reported financial flow at its source transaction grain, not a rolled-up aggregate."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "finance.flows"

    amount_minor_units: Annotated[int, Field(ge=0)]
    appropriation_id: UUID | None = None
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    contract_id: UUID | None = None
    counterparty_entity_id: UUID | None = None
    counterparty_individual_id: UUID | None = None
    created_at: datetime
    currency_id: UUID
    debt_id: UUID | None = None
    deleted_at: datetime | None = None
    expenditure_class_id: UUID | None = None
    fiscal_period_id: UUID | None = None
    flow_kind_id: UUID
    fund_id: UUID | None = None
    id: UUID
    institution_id: UUID | None = None
    occurred_on: date
    project_id: UUID | None = None
    scope_unit_feature_id: UUID | None = None
    source_citation_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
