"""Domains: one row of domains."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class DomainsRow(BaseModel):
    """A host name a source is served from. A source can have several over time, and a domain keeps its own validity period."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.domains"

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
    host: Annotated[str, Field(min_length=1, max_length=255)]
    id: UUID
    source_id: UUID
    updated_at: datetime
    valid_from: date | None = None
    valid_until: date | None = None
    version: Annotated[int, Field(ge=1)]
