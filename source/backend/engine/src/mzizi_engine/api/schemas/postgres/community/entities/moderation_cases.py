"""Moderation Cases: one row of moderation_cases."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.community.enums.moderation_state import ModerationState


class ModerationCasesRow(BaseModel):
    """The moderation record of one interaction: filter results, the reviewer, the decision and any appeal."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.moderation_cases"

    appealed_at: datetime | None = None
    created_at: datetime
    decided_at: datetime | None = None
    decision_id: UUID | None = None
    deleted_at: datetime | None = None
    filter_results: str | None = None
    id: UUID
    interaction_id: UUID
    reason: Annotated[str, Field(max_length=4000)] | None = None
    reviewer_account_id: UUID | None = None
    state: ModerationState
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
