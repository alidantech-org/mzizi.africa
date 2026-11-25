"""Scores: one row of scores."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.civic.enums.score_basis import ScoreBasis


class ScoresRow(BaseModel):
    """Prepared, reviewable comparison of a contract or project with comparable prices; never a finding or accusation."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "civic.scores"

    basis: ScoreBasis
    comparables: Annotated[int, Field(ge=0)]
    computed_at: datetime
    confidence: Annotated[float, Field(ge=0, le=1)] | None = None
    contract_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    high: float | None = None
    id: UUID
    low: float | None = None
    project_id: UUID | None = None
    score: float | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
