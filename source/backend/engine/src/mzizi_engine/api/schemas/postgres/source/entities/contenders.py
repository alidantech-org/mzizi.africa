"""Contenders: one row of contenders."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ContendersRow(BaseModel):
    """One side of a dispute."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.contenders"

    claim: Annotated[str, Field(min_length=1, max_length=4000)]
    created_at: datetime
    deleted_at: datetime | None = None
    dispute_id: UUID
    evidence_id: UUID
    id: UUID
    is_preferred: bool
    language_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
