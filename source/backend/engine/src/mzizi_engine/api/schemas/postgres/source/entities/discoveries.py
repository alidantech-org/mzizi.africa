"""Discoveries: one row of discoveries."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class DiscoveriesRow(BaseModel):
    """An observation that an address exists: where it was found, as what text and when. Retrieval is a separate capture."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.discoveries"

    address_id: UUID | None = None
    anchor_text: Annotated[str, Field(max_length=1000)] | None = None
    context: Annotated[str, Field(max_length=4000)] | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    discovered_at: datetime
    found_on_address_id: UUID | None = None
    id: UUID
    observed_url: Annotated[str, Field(max_length=2048)]
    source_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
