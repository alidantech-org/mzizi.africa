"""Results: one row of results."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.figure_basis import FigureBasis
from mzizi_engine.api.schemas.postgres.shared.enums.figure_status import FigureStatus


class ResultsRow(BaseModel):
    """Votes for exactly one candidate or one choice in one place, by collection and revision."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "election.results"

    basis: FigureBasis
    candidate_id: UUID | None = None
    choice_id: UUID | None = None
    collection_id: UUID | None = None
    country_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    feature_id: UUID
    form_id: UUID | None = None
    id: UUID
    revision: Annotated[int, Field(ge=1)]
    status: FigureStatus
    supersedes_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
    votes: Annotated[int, Field(ge=0)] | None = None
