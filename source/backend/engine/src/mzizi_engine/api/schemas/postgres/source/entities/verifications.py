"""Verifications: one row of verifications."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.source.enums.verification_outcome import VerificationOutcome


class VerificationsRow(BaseModel):
    """Append-only attributable assessment; disagreement and insufficient evidence remain explicit outcomes."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.verifications"

    assessed_at: datetime
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    confidence: Annotated[float, Field(ge=0, le=1)] | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    evidence_id: UUID
    explanation: Annotated[str, Field(max_length=4000)]
    id: UUID
    method_id: UUID
    outcome: VerificationOutcome
    reviewer_snapshot: str
    supersedes_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
