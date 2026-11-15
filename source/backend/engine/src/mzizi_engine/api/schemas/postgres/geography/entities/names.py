"""Names: one row of names."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class GeographyNamesRow(BaseModel):
    """An official, local, alternative, translated or historical name for a feature, with optional language, validity and provenance reference."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "geography.names"

    created_at: datetime
    deleted_at: datetime | None = None
    feature_id: UUID
    id: UUID
    language_tag: Annotated[str, Field(min_length=2, max_length=35)] | None = None
    name: Annotated[str, Field(min_length=1, max_length=300)]
    name_kind_id: UUID
    source_ref_id: UUID | None = None
    updated_at: datetime
    valid_from: date | None = None
    valid_until: date | None = None
    version: Annotated[int, Field(ge=1)]
