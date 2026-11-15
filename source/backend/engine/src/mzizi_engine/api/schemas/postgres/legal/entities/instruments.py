"""Instruments: one row of instruments."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class InstrumentsRow(BaseModel):
    """Stable instrument identity with explicit issuing territorial scope; geography alone never establishes applicability."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "legal.instruments"

    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$")
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    enacted_on: date | None = None
    id: UUID
    issuing_entity_id: UUID | None = None
    issuing_unit_id: UUID
    kind_id: UUID
    published_on: date | None = None
    title: Annotated[str, Field(min_length=1, max_length=300)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
