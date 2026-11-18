"""Coverage: one row of coverage."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CoverageRow(BaseModel):
    """What a source or product covers, for which place, years and kind of record, how completely, and when that was checked. It makes every 'none recorded' honest: the page says which sources were checked, and a gap is never read as zero."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.coverage"

    checked_on: date
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    country_id: UUID
    coverage_subject_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    expected_publication_url: Annotated[str, Field(max_length=2048)] | None = None
    id: UUID
    level_id: UUID
    note: Annotated[str, Field(max_length=4000)] | None = None
    period_from: date | None = None
    period_until: date | None = None
    product_id: UUID | None = None
    publisher_entity_id: UUID | None = None
    scope_unit_feature_id: UUID | None = None
    source_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
