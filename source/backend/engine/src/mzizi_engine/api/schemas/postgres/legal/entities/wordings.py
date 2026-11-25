"""Wordings: one row of wordings."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class WordingsRow(BaseModel):
    """The official text of a provision in one edition and language."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "legal.wordings"

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
    edition_id: UUID
    ends_on: date | None = None
    heading: Annotated[str, Field(min_length=1, max_length=1000)] | None = None
    id: UUID
    language_id: UUID
    provision_id: UUID
    starts_on: date | None = None
    supersedes_id: UUID | None = None
    text: Annotated[str, Field(min_length=1)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
