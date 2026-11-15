"""Apis: one row of apis."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ApisRow(BaseModel):
    """API channel with named credential binding only; request behavior is pinned in manifest releases."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.apis"

    base_url: Annotated[str, Field(max_length=2048)]
    created_at: datetime
    credential_binding: Annotated[str, Field(min_length=1, max_length=255)] | None = None
    deleted_at: datetime | None = None
    id: UUID
    source_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
