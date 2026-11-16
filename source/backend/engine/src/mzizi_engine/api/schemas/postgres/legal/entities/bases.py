"""Bases: one row of bases."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.legal.enums.basis_relation import BasisRelation


class BasesRow(BaseModel):
    """The one place that says which provision is the legal basis of a record in any table: a pattern, an institution, an office, a feature, a scheme or a value. The target varies by table, so it is a name and an id, not a foreign key."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "legal.bases"

    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    note: Annotated[str, Field(max_length=4000)] | None = None
    provision_id: UUID
    record_code: Annotated[str, Field(min_length=1, max_length=500)]
    record_id: UUID | None = None
    relation: BasisRelation
    table_name: Annotated[str, Field(min_length=1, max_length=100)]
    updated_at: datetime
    valid_from: date | None = None
    valid_until: date | None = None
    version: Annotated[int, Field(ge=1)]
