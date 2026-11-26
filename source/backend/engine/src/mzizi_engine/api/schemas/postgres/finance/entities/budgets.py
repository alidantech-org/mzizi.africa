"""Budgets: one row of budgets."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class BudgetsRow(BaseModel):
    """A government's budget for a fiscal period; an expected budget (one per county per year) is generated from a pattern before any figure exists."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "finance.budgets"

    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    country_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    government_id: UUID
    id: UUID
    kind_term: UUID
    period_id: UUID
    template_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
