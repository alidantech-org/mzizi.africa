"""Slugs: one row of slugs."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.date_precision import DatePrecision
from mzizi_engine.api.schemas.postgres.shared.enums.subject_table import SubjectTable


class SlugsRow(BaseModel):
    """One public address segment for one subject row. Identifies a thing by a clean name under its parent; closed rows keep history so a renamed or re-parented thing redirects instead of breaking. Carries no title: titles come from the name tables."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.slugs"

    canonical_slug_id: UUID | None = None
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
    from_to_precision: DatePrecision | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    language_id: UUID | None = None
    namespace_id: UUID
    parent_slug_id: UUID | None = None
    slug: Annotated[str, Field(min_length=1, max_length=255)]
    subject_id: UUID
    subject_table: SubjectTable
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
