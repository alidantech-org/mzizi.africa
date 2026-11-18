"""Agenda: one row of agenda."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AgendaRow(BaseModel):
    """One item of a sitting's order paper, in order, with the bill or motion it is about."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.agenda"

    agenda_kind_id: UUID
    bill_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    motion_id: UUID | None = None
    position: Annotated[int, Field(ge=1)]
    sitting_id: UUID
    source_citation_id: UUID | None = None
    title: Annotated[str, Field(min_length=1, max_length=300)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
