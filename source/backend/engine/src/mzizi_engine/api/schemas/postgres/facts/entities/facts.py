"""Facts: one row of facts."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class FactsRow(BaseModel):
    """One fun fact about the country."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "facts.facts"

    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    detail: Annotated[str, Field(max_length=4000)] | None = None
    id: UUID
    source_citation_id: UUID | None = None
    statement: Annotated[str, Field(min_length=1, max_length=300)]
    topic_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
