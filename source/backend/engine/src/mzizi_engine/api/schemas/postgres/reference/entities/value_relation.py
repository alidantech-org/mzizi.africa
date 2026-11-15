"""Value Relation: one row of value_relations."""

from __future__ import annotations

from datetime import date, datetime
from typing import ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from mzizi_engine.api.schemas.postgres.reference.enums.value_relation_kind import ValueRelationKind


class ValueRelationRow(BaseModel):
    """Proposed directed, typed, time-aware relation between classification values; supports multi-parent and cross-scheme taxonomy."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "reference.value_relations"

    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    relation_kind: ValueRelationKind
    source_value_id: UUID
    target_value_id: UUID
    valid_from: date | None = None
    valid_until: date | None = None
