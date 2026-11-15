"""Changes: one row of changes."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ChangesRow(BaseModel):
    """An edge in a geographic transformation; multiple rows sharing transformation_id represent splits, mergers, creation or dissolution without overwriting predecessor identities."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "geography.changes"

    change_kind_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    effective_on: date | None = None
    explanation: Annotated[str, Field(max_length=4000)] | None = None
    id: UUID
    predecessor_feature_id: UUID | None = None
    source_ref_id: UUID | None = None
    successor_feature_id: UUID | None = None
    transformation_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
