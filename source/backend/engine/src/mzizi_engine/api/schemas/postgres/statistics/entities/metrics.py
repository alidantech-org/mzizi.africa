"""Metrics: one row of metrics."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.identity_kind import IdentityKind


class MetricsRow(BaseModel):
    """A figure calculated from indicators (a rate per 1,000); computed when `figures` is refreshed."""

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
    deleted_at: datetime | None = None
    denominator_id: UUID | None = None
    higher_is_better: bool | None = None
    id: UUID
    identity_kind: IdentityKind
    is_rankable: bool
    level_term: UUID | None = None
    numerator_id: UUID
    per_factor: float | None = None
    topic_term: UUID
    unit_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
