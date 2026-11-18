"""Mandates: one row of mandates."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.date_precision import DatePrecision


class MandatesRow(BaseModel):
    """One responsibility or authority assignment for an institution or office."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.mandates"

    created_at: datetime
    deleted_at: datetime | None = None
    description: Annotated[str, Field(max_length=4000)]
    ends_on: date | None = None
    from_to_precision: DatePrecision | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    institution_id: UUID | None = None
    mandate_kind_id: UUID
    office_id: UUID | None = None
    source_citation_id: UUID | None = None
    starts_on: date | None = None
    term_id: UUID | None = None
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
