"""Mappings: one row of mappings."""

from __future__ import annotations

from datetime import datetime
from typing import ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from mzizi_engine.api.schemas.postgres.vocabulary.enums.mapping_kind import MappingKind


class MappingsRow(BaseModel):
    """Links between terms across schemes and countries. Loops in broader and narrower links are refused by Mzizi's write code."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "vocabulary.mappings"

    created_at: datetime
    deleted_at: datetime | None = None
    from_id: UUID
    id: UUID
    kind: MappingKind
    to_id: UUID
