"""Agenda: one row of agenda."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AgendaRow(BaseModel):
    """One item of a sitting's order paper."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "legislature.agenda"

    bill_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    kind_term: UUID
    motion_id: UUID | None = None
    position: Annotated[int, Field(ge=1)]
    sitting_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
