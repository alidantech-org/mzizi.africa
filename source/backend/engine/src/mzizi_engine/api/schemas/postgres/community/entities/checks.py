"""Checks: one row of checks."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.community.enums.checker import Checker
from mzizi_engine.api.schemas.postgres.community.enums.verdict import Verdict


class ChecksRow(BaseModel):
    """One automated or human check of a moderation case."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.checks"

    case_id: UUID
    category_term: UUID | None = None
    checked_at: datetime
    checker: Checker
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    score: Annotated[float, Field(ge=0, le=1)] | None = None
    updated_at: datetime
    verdict: Verdict
    version: Annotated[int, Field(ge=1)]
