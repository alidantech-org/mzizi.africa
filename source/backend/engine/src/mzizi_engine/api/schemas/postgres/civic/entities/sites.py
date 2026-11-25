"""Sites: one row of sites."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CivicSitesRow(BaseModel):
    """A place a project touches."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "civic.sites"

    created_at: datetime
    deleted_at: datetime | None = None
    feature_id: UUID
    id: UUID
    kind_term: UUID
    project_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
