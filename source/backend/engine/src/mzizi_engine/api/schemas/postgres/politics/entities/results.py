"""Results: one row of results."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ResultsRow(BaseModel):
    """One candidate's published vote result for one geographic unit."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "politics.results"

    candidate_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    source_citation_id: UUID | None = None
    status_id: UUID
    unit_feature_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
    votes: Annotated[int, Field(ge=0)]
