"""Effects: one row of effects."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.legal.enums.review_status import ReviewStatus
from mzizi_engine.api.schemas.postgres.shared.enums.subject_table import SubjectTable


class EffectsRow(BaseModel):
    """A reviewed assertion of what a wording establishes, governs, limits or changes for one subject record. Never mutates the subject."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "legal.effects"

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
    explanation: Annotated[str, Field(max_length=4000)] | None = None
    id: UUID
    kind_id: UUID
    observed_at: datetime
    review_status: ReviewStatus
    subject_id: UUID
    subject_table: SubjectTable
    updated_at: datetime
    valid_from: date | None = None
    valid_until: date | None = None
    version: Annotated[int, Field(ge=1)]
    wording_id: UUID
