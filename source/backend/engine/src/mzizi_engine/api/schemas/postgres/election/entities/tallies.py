"""Tallies: one row of tallies."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.figure_basis import FigureBasis
from mzizi_engine.api.schemas.postgres.shared.enums.figure_status import FigureStatus


class TalliesRow(BaseModel):
    """Prepared: the one result to show per contest, option and place, chosen by the country's priorities (IEBC first)."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "election.tallies"

    basis: FigureBasis
    candidate_id: UUID | None = None
    choice_id: UUID | None = None
    contest_id: UUID
    country_id: UUID
    created_at: datetime
    feature_id: UUID
    id: UUID
    refreshed_at: datetime
    result_id: UUID
    share: Annotated[float, Field(ge=0, le=100)] | None = None
    status: FigureStatus
    votes: Annotated[int, Field(ge=0)] | None = None
