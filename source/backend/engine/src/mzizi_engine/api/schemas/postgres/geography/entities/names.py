"""Names: one row of names."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class GeographyNamesRow(BaseModel):
    """A canonical, official, local, alternative, translated or historical name for a feature, with its language (`mul` or `und` when no single language applies), validity and provenance reference."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "geography.names"

    created_at: datetime
    deleted_at: datetime | None = None
    feature_id: UUID
    id: UUID
    is_default: bool
    language_id: UUID
    name: Annotated[str, Field(min_length=1, max_length=300)]
    name_kind_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
