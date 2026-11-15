"""Pattern: one row of patterns."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class PatternRow(BaseModel):
    """Stable identity for a reusable, reviewed pattern definition."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "reference.patterns"

    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$")
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    title: Annotated[str, Field(min_length=1, max_length=300)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
