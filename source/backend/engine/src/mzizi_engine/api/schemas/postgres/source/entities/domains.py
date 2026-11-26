"""Domains: one row of domains."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.domain_status import DomainStatus


class DomainsRow(BaseModel):
    """A host name a source publishes on. A candidate host generated for an institution is not a source until it is verified."""

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
    contact_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    ends_on: date | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    host: Annotated[str, Field(min_length=1, max_length=255)]
    id: UUID
    last_checked_at: datetime | None = None
    owner_id: UUID | None = None
    source_id: UUID | None = None
    starts_on: date | None = None
    status: DomainStatus
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
