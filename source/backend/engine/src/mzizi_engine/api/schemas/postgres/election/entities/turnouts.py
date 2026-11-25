"""Turnouts: one row of turnouts."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.figure_status import FigureStatus


class TurnoutsRow(BaseModel):
    """Registered and cast votes of a contest in one place, by revision."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "election.turnouts"

    cast: Annotated[int, Field(ge=0)] | None = None
    collection_id: UUID | None = None
    contest_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    feature_id: UUID
    id: UUID
    registered: Annotated[int, Field(ge=0)] | None = None
    rejected: Annotated[int, Field(ge=0)] | None = None
    revision: Annotated[int, Field(ge=1)]
    spoilt: Annotated[int, Field(ge=0)] | None = None
    status: FigureStatus
    supersedes_id: UUID | None = None
    updated_at: datetime
    valid: Annotated[int, Field(ge=0)] | None = None
    version: Annotated[int, Field(ge=1)]
