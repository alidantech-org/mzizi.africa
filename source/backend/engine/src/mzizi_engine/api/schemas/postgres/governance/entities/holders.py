"""Holders: one row of holders."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.date_precision import DatePrecision


class HoldersRow(BaseModel):
    """One person's continuous tenure in one office, with appointment kind and effective dates."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.holders"

    appointed_by_entity_id: UUID | None = None
    appointment_kind_id: UUID
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    from_to_precision: DatePrecision | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    individual_id: UUID
    left_office_on: date | None = None
    office_id: UUID
    source_citation_id: UUID | None = None
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    took_office_on: date | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
