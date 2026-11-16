"""Features: one row of features."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class FeaturesRow(BaseModel):
    """The sole canonical identity for each geographic entity, independent of type, country or geometry."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "geography.features"

    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9]+(-[a-z0-9]+)*(\\.[a-z0-9]+(-[a-z0-9]+)*){0,15}$")
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    feature_type_id: UUID
    id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
