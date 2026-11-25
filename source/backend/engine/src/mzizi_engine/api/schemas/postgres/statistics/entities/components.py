"""Components: one row of components."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ComponentsRow(BaseModel):
    """One part of a composite index, with its weight and transform."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "statistics.components"

    component_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    indicator_id: UUID
    position: Annotated[int, Field(ge=0)] | None = None
    transform_term: UUID
    weight: float
