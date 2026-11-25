"""Discoveries: one row of discoveries."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class DiscoveriesRow(BaseModel):
    """A link found while crawling."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.discoveries"

    anchor_text: Annotated[str, Field(max_length=1000)] | None = None
    context: Annotated[str, Field(max_length=4000)] | None = None
    created_at: datetime
    discovered_at: datetime
    found_on_id: UUID | None = None
    id: UUID
    observed_url: Annotated[str, Field(max_length=2048)]
    path_id: UUID | None = None
    source_id: UUID | None = None
