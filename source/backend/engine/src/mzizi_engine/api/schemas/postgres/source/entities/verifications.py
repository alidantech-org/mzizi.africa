"""Verifications: one row of verifications."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.subject_table import SubjectTable
from mzizi_engine.api.schemas.postgres.source.enums.verification_outcome import VerificationOutcome


class VerificationsRow(BaseModel):
    """A review decision about one row, against what and when."""

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
    id: UUID
    method_term: UUID
    note: Annotated[str, Field(min_length=1, max_length=4000)] | None = None
    note_language_id: UUID | None = None
    outcome: VerificationOutcome
    reviewer_id: UUID | None = None
    subject_id: UUID
    subject_table: SubjectTable
    supersedes_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
