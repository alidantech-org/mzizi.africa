"""Offices: one row of offices."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class OfficesRow(BaseModel):
    """One established public office, independent of any current holder and optionally scoped to a geographic unit."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.offices"

    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9]+(-[a-z0-9]+)*(\\.[a-z0-9]+(-[a-z0-9]+)*){0,15}$")
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    institution_id: UUID
    office_kind_id: UUID
    source_citation_id: UUID | None = None
    unit_feature_id: UUID | None = None
    updated_at: datetime
    valid_from: date | None = None
    valid_until: date | None = None
    version: Annotated[int, Field(ge=1)]
