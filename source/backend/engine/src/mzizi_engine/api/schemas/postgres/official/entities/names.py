"""Names: one row of names."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class OfficialNamesRow(BaseModel):
    """One attested name form for exactly one entity or individual, with its language (`mul` or `und` when none applies) and validity."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "official.names"

    created_at: datetime
    deleted_at: datetime | None = None
    entity_id: UUID | None = None
    id: UUID
    individual_id: UUID | None = None
    is_preferred: bool
    language_id: UUID
    name: Annotated[str, Field(min_length=1, max_length=300)]
    name_kind_id: UUID
    source_citation_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
