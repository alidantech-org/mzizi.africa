"""Project Features: one row of project_features."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ProjectFeaturesRow(BaseModel):
    """One typed relationship between a Civic project and one Geography feature."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "civic.project_features"

    created_at: datetime
    deleted_at: datetime | None = None
    feature_id: UUID
    feature_kind_id: UUID
    id: UUID
    project_id: UUID
    source_citation_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
