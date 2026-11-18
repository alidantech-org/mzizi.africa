"""Metrics: one row of metrics."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class MetricsRow(BaseModel):
    """A ranking or comparison measure defined as data: an indicator, or one indicator over another with a factor. Titles and descriptions per language are copy; no metric is coded in a read."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "statistics.metrics"

    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    created_at: datetime
    default_level_kind_id: UUID | None = None
    deleted_at: datetime | None = None
    denominator_indicator_id: UUID | None = None
    higher_is_better: bool | None = None
    id: UUID
    is_rankable: bool
    numerator_indicator_id: UUID
    per_factor: float | None = None
    source_citation_id: UUID | None = None
    topic_id: UUID
    unit_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
