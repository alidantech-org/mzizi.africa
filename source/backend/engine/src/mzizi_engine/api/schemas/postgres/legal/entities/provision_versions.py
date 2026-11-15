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

    citation_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    effective_from: date | None = None
    effective_until: date | None = None
    id: UUID
    instrument_id: UUID
    instrument_version_id: UUID
    observed_at: datetime
    provision_id: UUID
    supersedes_id: UUID | None = None
    text: Annotated[str, Field(min_length=1)]
    text_hash: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
