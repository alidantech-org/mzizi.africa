"""Fiscal Periods: one row of fiscal_periods."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class FiscalPeriodsRow(BaseModel):
    """One fiscal reporting period for a country, with explicit date bounds and source citation."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "finance.fiscal_periods"

    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$")
    ]
    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    ends_on: date
    id: UUID
    period_kind_id: UUID
    source_citation_id: UUID | None = None
    starts_on: date
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
