"""Citations: one row of citations."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CitationsRow(BaseModel):
    """Exactly where in an artifact or capture a fact is."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.citations"

    artifact_id: UUID | None = None
    capture_id: UUID | None = None
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
    id: UUID
    locator: Annotated[str, Field(min_length=1, max_length=4000)]
    locator_term: UUID
    path_id: UUID | None = None
    quoted_hash: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")] | None = None
    recorded_at: datetime
    retrieved_at: datetime | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
