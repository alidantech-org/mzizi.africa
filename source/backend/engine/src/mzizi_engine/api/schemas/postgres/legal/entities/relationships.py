"""Relationships: one row of relationships."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class LegalRelationshipsRow(BaseModel):
    """An amendment, repeal or replacement between instruments or wordings."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "legal.relationships"

    affected_wording_id: UUID | None = None
    authority_wording_id: UUID | None = None
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
    effective_on: date | None = None
    id: UUID
    kind_term: UUID
    note: Annotated[str, Field(min_length=1, max_length=4000)] | None = None
    note_language_id: UUID | None = None
    object_instrument_id: UUID | None = None
    resulting_wording_id: UUID | None = None
    subject_instrument_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
