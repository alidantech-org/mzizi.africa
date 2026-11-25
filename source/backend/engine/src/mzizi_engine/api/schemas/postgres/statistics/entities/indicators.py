"""Indicators: one row of indicators."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.identity_kind import IdentityKind
from mzizi_engine.api.schemas.postgres.statistics.enums.aggregation import Aggregation
from mzizi_engine.api.schemas.postgres.statistics.enums.frequency import Frequency


class IndicatorsRow(BaseModel):
    """The concept measured (Population). Its names and short definitions are `identity.names`."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "statistics.indicators"

    aggregation: Aggregation
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    created_at: datetime
    decimals: Annotated[int, Field(ge=0, le=10)] | None = None
    deleted_at: datetime | None = None
    frequency: Frequency | None = None
    higher_is_better: bool | None = None
    id: UUID
    identity_kind: IdentityKind
    is_derived: bool
    kind_term: UUID
    role_term: UUID | None = None
    topic_term: UUID
    unit_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
