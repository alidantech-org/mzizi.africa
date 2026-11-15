"""Attributions: one row of attributions."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AttributionsRow(BaseModel):
    """Accepted rights and credit statement tied to exact content and publisher."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.attributions"

    assessed_at: datetime
    assessor_snapshot: str
    created_at: datetime
    credit: Annotated[str, Field(min_length=1, max_length=1000)]
    deleted_at: datetime | None = None
    file_version_id: UUID
    id: UUID
    license_value_id: UUID | None = None
    publisher_id: UUID
    rights_statement: Annotated[str, Field(max_length=4000)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
