"""Priorities: one row of priorities."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class PrioritiesRow(BaseModel):
    """Per-country order of trust for choosing the figure to show (Kenya ranks KNBS first)."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "statistics.priorities"

    collection_id: UUID | None = None
    country_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    position: Annotated[int, Field(ge=0)]
    steward_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
