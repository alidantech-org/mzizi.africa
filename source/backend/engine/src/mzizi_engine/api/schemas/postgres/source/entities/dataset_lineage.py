"""Dataset Lineage: one row of dataset_lineage."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.source.enums.lineage_role import LineageRole


class DatasetLineageRow(BaseModel):
    """What a dataset was prepared from: a capture, a document or another dataset, with the role and method."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.dataset_lineage"

    created_at: datetime
    dataset_id: UUID
    deleted_at: datetime | None = None
    id: UUID
    input_capture_id: UUID | None = None
    input_dataset_id: UUID | None = None
    input_document_id: UUID | None = None
    method: Annotated[str, Field(max_length=4000)] | None = None
    role: LineageRole
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
