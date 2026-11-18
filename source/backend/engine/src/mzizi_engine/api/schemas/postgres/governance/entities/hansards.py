"""Hansards: one row of hansards."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class HansardsRow(BaseModel):
    """The official verbatim record (Hansard) of one sitting as a published document. Speeches and divisions are extracted from it and cite its pages."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.hansards"

    artifact_id: UUID
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
    id: UUID
    is_provisional: bool
    language_id: UUID
    published_on: date | None = None
    reference: Annotated[str, Field(min_length=1, max_length=255)] | None = None
    sitting_id: UUID
    source_citation_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
