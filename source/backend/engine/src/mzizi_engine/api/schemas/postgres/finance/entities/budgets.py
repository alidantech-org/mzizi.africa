"""Budgets: one row of budgets."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class BudgetsRow(BaseModel):
    """One institutional/country budget identity for a fiscal period and budget classification."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "finance.budgets"

    budget_kind_id: UUID
    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$")
    ]
    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    fiscal_period_id: UUID
    government_entity_id: UUID | None = None
    id: UUID
    source_citation_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
