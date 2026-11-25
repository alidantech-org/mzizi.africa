"""Tags: one row of tags."""

from __future__ import annotations

from datetime import datetime
from typing import ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class TagsRow(BaseModel):
    """Loose editorial labels on named things, for related links and collections."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "identity.tags"

    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    identity_id: UUID
    tag_term: UUID
