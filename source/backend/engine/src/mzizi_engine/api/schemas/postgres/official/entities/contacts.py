"""Contacts: one row of contacts."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ContactsRow(BaseModel):
    """One sourced contact channel for exactly one identity; visibility class governs handling of private values."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "official.contacts"

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
    entity_id: UUID | None = None
    id: UUID
    individual_id: UUID | None = None
    kind_id: UUID
    source_citation_id: UUID | None = None
    updated_at: datetime
    valid_from: date | None = None
    valid_until: date | None = None
    value: Annotated[str, Field(min_length=1, max_length=1000)]
    version: Annotated[int, Field(ge=1)]
    visibility_id: UUID
