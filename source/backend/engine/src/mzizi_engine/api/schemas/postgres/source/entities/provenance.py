"""Provenance: one row of provenance."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ProvenanceRow(BaseModel):
    """Where a record in any table came from. The loader writes one row for every seeded record, so a record's origin is a query: its dataset, the lines of the CSV and the inputs the dataset came from."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.provenance"

    capture_id: UUID | None = None
    column_name: Annotated[str, Field(min_length=1, max_length=100)] | None = None
    created_at: datetime
    dataset_id: UUID
    deleted_at: datetime | None = None
    document_id: UUID | None = None
    id: UUID
    line: Annotated[int, Field(ge=1)] | None = None
    record_id: UUID
    table_name: Annotated[str, Field(min_length=1, max_length=100)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
