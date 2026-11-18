"""Views: one row of views."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.subject_table import SubjectTable


class ViewsRow(BaseModel):
    """One visitor-day of viewing one subject, deduplicated by a daily-rotating hash. Counts are derived from these rows."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.views"

    country_id: UUID | None = None
    created_at: datetime
    day: date
    deleted_at: datetime | None = None
    id: UUID
    subject_id: UUID
    subject_table: SubjectTable
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
    visitor_hash: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")]
