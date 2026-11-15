"""Folders: one row of folders."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.filesystem.enums.access import Access


class FoldersRow(BaseModel):
    """Logical hierarchy; access escalation requires recorded authorization, independent of object keys."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "filesystem.folders"

    access: Access
    authorization: str | None = None
    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$")
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    name: Annotated[str, Field(min_length=1, max_length=300)]
    parent_id: UUID | None = None
    role_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
