"""Powers: one row of powers."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class PowersRow(BaseModel):
    """How power flows between positions and institutions, by procedure and threshold."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.powers"

    created_at: datetime
    deleted_at: datetime | None = None
    from_id: UUID
    id: UUID
    is_binding: bool
    kind_term: UUID
    procedure_id: UUID | None = None
    step: Annotated[int, Field(ge=1)] | None = None
    threshold_term: UUID | None = None
    to_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
