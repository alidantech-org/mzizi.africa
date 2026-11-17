"""Manifesto Items: one row of manifesto_items."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ManifestoItemsRow(BaseModel):
    """One policy commitment or promise within a manifesto, optionally linked to a Reference topic."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "politics.manifesto_items"

    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9]+(-[a-z0-9]+)*(\\.[a-z0-9]+(-[a-z0-9]+)*){0,15}$")
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    description: Annotated[str, Field(max_length=4000)]
    id: UUID
    manifesto_id: UUID
    position: Annotated[int, Field(ge=1)] | None = None
    source_citation_id: UUID | None = None
    title: Annotated[str, Field(min_length=1, max_length=300)]
    topic_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
