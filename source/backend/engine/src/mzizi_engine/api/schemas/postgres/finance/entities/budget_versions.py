"""Budget Versions: one row of budget_versions."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class BudgetVersionsRow(BaseModel):
    """One ordered release or revision of a budget, preserving original and supplementary versions separately."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "finance.budget_versions"

    budget_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    released_on: date | None = None
    revision: Annotated[int, Field(ge=1)]
    source_citation_id: UUID | None = None
    status_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
