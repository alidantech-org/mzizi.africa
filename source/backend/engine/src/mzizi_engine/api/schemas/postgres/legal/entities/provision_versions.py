"""Provision Versions: one row of provision_versions."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ProvisionVersionsRow(BaseModel):
    """Immutable original wording in an exact instrument release; structured interpretation is separately reviewed."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "legal.provision_versions"

    citation_id: UUID | None = None
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
    effective_from: date | None = None
    effective_until: date | None = None
    id: UUID
    instrument_id: UUID
    instrument_version_id: UUID
    language_id: UUID
    locator: Annotated[str, Field(min_length=1, max_length=1000)] | None = None
    observed_at: datetime
    provision_id: UUID
    supersedes_id: UUID | None = None
    text: Annotated[str, Field(min_length=1)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
