"""Relationships: one row of relationships."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.subject_table import SubjectTable


class SourceRelationshipsRow(BaseModel):
    """A classified connection from an input to an output or a domain record: derivation, extraction, translation, support. Exact locations are citations on the relationship."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.relationships"

    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    execution_ref: Annotated[str, Field(min_length=1, max_length=255)] | None = None
    id: UUID
    input_artifact_id: UUID | None = None
    input_capture_id: UUID | None = None
    input_edition_id: UUID | None = None
    input_file_version_id: UUID | None = None
    input_product_id: UUID | None = None
    kind_id: UUID
    method: Annotated[str, Field(max_length=4000)] | None = None
    output_artifact_id: UUID | None = None
    output_capture_id: UUID | None = None
    output_edition_id: UUID | None = None
    output_file_version_id: UUID | None = None
    output_product_id: UUID | None = None
    subject_id: UUID | None = None
    subject_table: SubjectTable | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
