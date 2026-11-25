"""Attachments: one row of attachments."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class LegislatureAttachmentsRow(BaseModel):
    """Media on proceedings that are not identities (the parliamentary video of a speech)."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "legislature.attachments"

    article_id: UUID | None = None
    asset_id: UUID | None = None
    bill_id: UUID | None = None
    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    end_second: Annotated[float, Field(ge=0)] | None = None
    id: UUID
    position: Annotated[int, Field(ge=0)] | None = None
    purpose_term: UUID
    sitting_id: UUID | None = None
    speech_id: UUID | None = None
    start_second: Annotated[float, Field(ge=0)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
