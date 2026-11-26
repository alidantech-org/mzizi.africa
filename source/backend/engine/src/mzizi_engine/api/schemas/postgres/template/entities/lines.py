"""Lines: one row of lines."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class LinesRow(BaseModel):
    """One effect line: when the first template creates a row, the second runs for it. This list is how a template records its effects; the effects themselves carry no template column."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "template.lines"

    created_at: datetime
    deleted_at: datetime | None = None
    effect_template_id: UUID
    id: UUID
    position: Annotated[int, Field(ge=0)]
    template_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
