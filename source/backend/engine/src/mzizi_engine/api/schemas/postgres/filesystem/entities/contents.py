"""Contents: one row of contents."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.subject_table import SubjectTable


class ContentsRow(BaseModel):
    """One authored text (markdown) about a subject record: an institution, a place, a person, the Constitution or general knowledge. Media is referenced, never embedded."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "filesystem.contents"

    body: Annotated[str, Field(min_length=1)]
    category_id: UUID
    classification_id: UUID | None = None
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
    file_version_id: UUID | None = None
    id: UUID
    is_development_text: bool
    language_id: UUID
    subject_id: UUID
    subject_table: SubjectTable
    summary: Annotated[str, Field(max_length=4000)] | None = None
    title: Annotated[str, Field(min_length=1, max_length=300)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
