"""Indicators: one row of indicators."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class IndicatorsRow(BaseModel):
    """One measured quantity, for example total population, registered voters or audit opinion score."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "statistics.indicators"

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
    description: Annotated[str, Field(max_length=4000)]
    higher_is_better: bool | None = None
    id: UUID
    measure_kind_id: UUID
    name: Annotated[str, Field(min_length=1, max_length=300)]
    role_id: UUID | None = None
    source_citation_id: UUID | None = None
    topic_id: UUID
    unit_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
