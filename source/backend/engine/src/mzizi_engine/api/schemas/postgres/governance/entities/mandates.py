"""Mandates: one row of mandates."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class MandatesRow(BaseModel):
    """One responsibility or authority assignment for an institution or office."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.mandates"

    created_at: datetime
    deleted_at: datetime | None = None
    description: Annotated[str, Field(max_length=4000)]
    id: UUID
    institution_id: UUID | None = None
    mandate_kind_id: UUID
    office_id: UUID | None = None
    source_citation_id: UUID | None = None
    updated_at: datetime
    valid_from: date | None = None
    valid_until: date | None = None
    version: Annotated[int, Field(ge=1)]
