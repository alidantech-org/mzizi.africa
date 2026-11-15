"""Instrument Versions: one row of instrument_versions."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class InstrumentVersionsRow(BaseModel):
    """Exact source-backed release; observed, consolidated and legally effective dates have separate meanings."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "legal.instrument_versions"

    ceased_on: date | None = None
    commenced_on: date | None = None
    consolidated_on: date | None = None
    content_hash: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")]
    created_at: datetime
    deleted_at: datetime | None = None
    edition: Annotated[str, Field(min_length=1, max_length=255)]
    evidence_id: UUID
    file_version_id: UUID
    id: UUID
    instrument_id: UUID
    observed_at: datetime
    repealed_on: date | None = None
    supersedes_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
