"""Codes: one row of codes."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class EconomyCodesRow(BaseModel):
    """A good's code in an international classification; CPC is the pivot."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "economy.codes"

    created_at: datetime
    deleted_at: datetime | None = None
    good_id: UUID
    id: UUID
    scheme_term: UUID
    value: Annotated[str, Field(min_length=1, max_length=50)]
