"""Captures: one row of captures."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CapturesRow(BaseModel):
    """One retrieval of an address: when, from which link, with what response. Repeated captures never overwrite each other."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.captures"

    address_id: UUID | None = None
    artifact_id: UUID | None = None
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
    discovery_id: UUID | None = None
    id: UUID
    original_url: Annotated[str, Field(max_length=2048)]
    response_metadata: str
    retrieved_at: datetime
    retrieved_url: Annotated[str, Field(max_length=2048)] | None = None
    source_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
