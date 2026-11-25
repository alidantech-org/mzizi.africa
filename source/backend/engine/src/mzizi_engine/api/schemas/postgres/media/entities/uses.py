"""Uses: one row of uses."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class UsesRow(BaseModel):
    """Which named thing an asset illustrates and why (Nairobi ← photo, skyline)."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "media.uses"

    asset_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    identity_id: UUID
    position: Annotated[int, Field(ge=0)] | None = None
    purpose_term: UUID
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
