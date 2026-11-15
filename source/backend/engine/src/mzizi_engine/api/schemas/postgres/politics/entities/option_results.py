"""Option Results: one row of option_results."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class OptionResultsRow(BaseModel):
    """One reported vote result for one referendum option and geographic unit."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "politics.option_results"

    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    option_id: UUID
    source_citation_id: UUID | None = None
    status_id: UUID
    unit_feature_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
    votes: Annotated[int, Field(ge=0)]
