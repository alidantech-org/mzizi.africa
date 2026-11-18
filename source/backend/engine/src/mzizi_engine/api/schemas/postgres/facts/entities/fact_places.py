"""Fact Places: one row of fact_places."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class FactPlacesRow(BaseModel):
    """Tags a fact to a place; a fact may be tagged to several."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "facts.fact_places"

    created_at: datetime
    deleted_at: datetime | None = None
    fact_id: UUID
    feature_id: UUID
    id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
