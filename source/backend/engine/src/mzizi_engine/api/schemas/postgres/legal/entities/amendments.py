"""Amendments: one row of amendments."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AmendmentsRow(BaseModel):
    """An exact authority provision changes an exact affected wording version; both historical texts remain available."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "legal.amendments"

    affected_id: UUID
    authority_id: UUID
    citation_id: UUID
    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9]+(-[a-z0-9]+)*(\\.[a-z0-9]+(-[a-z0-9]+)*){0,15}$")
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    effective_on: date | None = None
    explanation: Annotated[str, Field(max_length=4000)] | None = None
    id: UUID
    kind_id: UUID
    resulting_version_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
