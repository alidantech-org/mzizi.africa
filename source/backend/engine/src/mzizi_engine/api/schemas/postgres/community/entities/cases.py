"""Cases: one row of cases."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.community.enums.post_state import PostState


class CasesRow(BaseModel):
    """The moderation of one post."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.cases"

    created_at: datetime
    decided_at: datetime | None = None
    decision_term: UUID | None = None
    deleted_at: datetime | None = None
    id: UUID
    post_country_id: UUID
    post_id: UUID
    reason: Annotated[str, Field(max_length=4000)] | None = None
    reviewer_account_id: UUID | None = None
    state: PostState
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
