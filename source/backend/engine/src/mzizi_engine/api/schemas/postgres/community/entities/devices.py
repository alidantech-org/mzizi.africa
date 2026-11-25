"""Devices: one row of devices."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.community.enums.attestation_status import AttestationStatus
from mzizi_engine.api.schemas.postgres.community.enums.platform import Platform


class DevicesRow(BaseModel):
    """A device an actor uses."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.devices"

    actor_id: UUID
    app_version: Annotated[str, Field(min_length=1, max_length=100)] | None = None
    attestation: AttestationStatus
    created_at: datetime
    deleted_at: datetime | None = None
    fingerprint_hash: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")]
    first_seen_at: datetime
    id: UUID
    last_seen_at: datetime
    platform: Platform
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
