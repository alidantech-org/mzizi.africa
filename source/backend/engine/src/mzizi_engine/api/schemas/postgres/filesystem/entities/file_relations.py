"""File Relations: one row of file_relations."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class FileRelationsRow(BaseModel):
    """Directed exact input-to-output lineage with a pinned processing description; originals remain immutable."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "filesystem.file_relations"

    created_at: datetime
    deleted_at: datetime | None = None
    derived_version_id: UUID
    id: UUID
    kind_id: UUID
    processing_provenance: str
    source_version_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
