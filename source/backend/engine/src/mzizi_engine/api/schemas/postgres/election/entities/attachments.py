"""Attachments: one row of attachments."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ElectionAttachmentsRow(BaseModel):
    """Media on elections, contests and candidates (a debate video)."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "election.attachments"

    article_id: UUID | None = None
    asset_id: UUID | None = None
    candidate_id: UUID | None = None
    contest_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    election_id: UUID | None = None
    end_second: Annotated[float, Field(ge=0)] | None = None
    id: UUID
    position: Annotated[int, Field(ge=0)] | None = None
    purpose_term: UUID
    start_second: Annotated[float, Field(ge=0)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
