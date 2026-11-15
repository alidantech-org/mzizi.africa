"""Alignments: one row of alignments."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AlignmentsRow(BaseModel):
    """One party's dated alignment with one coalition."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "politics.alignments"

    alignment_kind_id: UUID
    coalition_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    party_id: UUID
    source_citation_id: UUID | None = None
    updated_at: datetime
    valid_from: date | None = None
    valid_until: date | None = None
    version: Annotated[int, Field(ge=1)]
