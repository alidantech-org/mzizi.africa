"""Attributions: one row of attributions."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AttributionsRow(BaseModel):
    """Credit and rights for one artifact and publisher; equal bytes from other places never overwrite it."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.attributions"

    artifact_id: UUID
    assessed_at: datetime
    assessor_snapshot: str
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    created_at: datetime
    credit: Annotated[str, Field(min_length=1, max_length=1000)]
    deleted_at: datetime | None = None
    id: UUID
    license_value_id: UUID | None = None
    publisher_id: UUID
    rights_statement: Annotated[str, Field(max_length=4000)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
