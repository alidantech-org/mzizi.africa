"""Proofs: one row of proofs."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.community.enums.location_check import LocationCheck


class ProofsRow(BaseModel):
    """The evidence that a poster was in or near the place they posted about, with a trust score. A signal, never proof."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.proofs"

    accuracy_meters: Annotated[int, Field(ge=0)] | None = None
    actor_id: UUID
    check: LocationCheck
    coarse_cell: Annotated[str, Field(min_length=1, max_length=100)] | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    device_id: UUID
    id: UUID
    matched_feature_id: UUID | None = None
    mock_location_detected: bool
    recorded_at: datetime
    signals: str | None = None
    trust_score: Annotated[float, Field(ge=0, le=100)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
