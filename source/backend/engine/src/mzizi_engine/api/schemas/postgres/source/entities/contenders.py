"""Contenders: one row of contenders."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ContendersRow(BaseModel):
    """One side of a dispute: a citation and the claim it supports."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.contenders"

    citation_id: UUID
    claim: Annotated[str, Field(max_length=4000)]
    created_at: datetime
    deleted_at: datetime | None = None
    dispute_id: UUID
    id: UUID
    is_preferred: bool
    position: Annotated[int, Field(ge=0)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
