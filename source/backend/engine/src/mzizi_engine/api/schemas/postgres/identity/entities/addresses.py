"""Addresses: one row of addresses."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AddressesRow(BaseModel):
    """Readable URL addresses of named things; dated rows keep old addresses resolving."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "identity.addresses"

    canonical_id: UUID | None = None
    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    identity_id: UUID
    language_id: UUID | None = None
    parent_id: UUID | None = None
    section_term: UUID | None = None
    segment: Annotated[str, Field(min_length=1, max_length=200, pattern="^[a-z0-9]+(-[a-z0-9]+)*$")]
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
