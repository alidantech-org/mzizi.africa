"""Breakdowns: one row of breakdowns."""

from __future__ import annotations

from datetime import datetime
from typing import ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class BreakdownsRow(BaseModel):
    """The categories that cut one observation: at most one term per dimension."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "statistics.breakdowns"

    country_id: UUID
    created_at: datetime
    id: UUID
    observation_id: UUID
    scheme_id: UUID
    term_id: UUID
