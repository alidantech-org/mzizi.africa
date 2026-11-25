"""Blocks: one row of blocks."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class BlocksRow(BaseModel):
    """A block on an account that posted bad content; a blocked account cannot sign in or contribute."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.blocks"

    account_id: UUID
    case_id: UUID | None = None
    created_at: datetime
    decided_by: UUID
    deleted_at: datetime | None = None
    from_on: date
    id: UUID
    reason_term: UUID
    to_on: date | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
