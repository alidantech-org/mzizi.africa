"""Crosswalks: one row of crosswalks."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.economy.enums.crosswalk_kind import CrosswalkKind


class CrosswalksRow(BaseModel):
    """Official correspondence tables between classifications (UN CPC to COICOP, HS)."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "economy.crosswalks"

    created_at: datetime
    deleted_at: datetime | None = None
    from_scheme_term: UUID
    from_value: Annotated[str, Field(min_length=1, max_length=50)]
    id: UUID
    kind: CrosswalkKind
    to_scheme_term: UUID
    to_value: Annotated[str, Field(min_length=1, max_length=50)]
