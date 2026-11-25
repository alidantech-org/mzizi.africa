"""Compositions: one row of compositions."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CompositionsRow(BaseModel):
    """What a works item is made of: a bill of quantities."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "economy.compositions"

    created_at: datetime
    deleted_at: datetime | None = None
    good_id: UUID
    id: UUID
    input_id: UUID
    quantity: float
    unit_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
