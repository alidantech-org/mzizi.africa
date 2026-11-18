"""Slug Relations: one row of slug_relations."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.date_precision import DatePrecision


class SlugRelationsRow(BaseModel):
    """A dated relation between two slugs that name the same thing or the same area: translations, aliases, a constituency and a sub-county covering the same land. Must not form cycles."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.slug_relations"

    created_at: datetime
    deleted_at: datetime | None = None
    from_slug_id: UUID
    from_to_precision: DatePrecision | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    relation_kind_id: UUID
    to_slug_id: UUID
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
