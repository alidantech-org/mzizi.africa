"""Coverage: one row of coverage."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CoverageRow(BaseModel):
    """Expected coverage, for acquisition planning."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.coverage"

    checked_on: date | None = None
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    country_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    expected_url: Annotated[str, Field(max_length=2048)] | None = None
    feature_id: UUID | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    level_id: UUID | None = None
    note: Annotated[str, Field(min_length=1, max_length=4000)] | None = None
    note_language_id: UUID | None = None
    product_id: UUID | None = None
    publisher_id: UUID | None = None
    source_id: UUID | None = None
    subject_term: UUID
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
