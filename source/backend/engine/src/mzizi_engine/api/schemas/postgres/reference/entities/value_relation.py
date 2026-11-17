"""Value Relation: one row of value_relations."""

from __future__ import annotations

from datetime import datetime
from typing import ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from mzizi_engine.api.schemas.postgres.reference.enums.value_relation_kind import ValueRelationKind


class ValueRelationRow(BaseModel):
    """A directed, typed, relation between classification values; supports multi-parent and cross-scheme taxonomy, such as a regional label that maps to a broader global kind."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "reference.value_relations"

    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    relation_kind: ValueRelationKind
    source_value_id: UUID
    target_value_id: UUID
