"""Links: one row of links."""

from __future__ import annotations

from datetime import datetime
from typing import ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from mzizi_engine.api.schemas.postgres.history.enums.link_kind import LinkKind


class LinksRow(BaseModel):
    """How historical occurrences relate to one another."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "history.links"

    created_at: datetime
    deleted_at: datetime | None = None
    from_id: UUID
    id: UUID
    kind: LinkKind
    to_id: UUID
