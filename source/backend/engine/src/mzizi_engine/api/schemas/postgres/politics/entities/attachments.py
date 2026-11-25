"""Attachments: one row of attachments."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class PoliticsAttachmentsRow(BaseModel):
    """Media on commitments, fulfilments and manifestos (the video of a promise)."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "politics.attachments"

    article_id: UUID | None = None
    asset_id: UUID | None = None
    commitment_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    end_second: Annotated[float, Field(ge=0)] | None = None
    fulfilment_id: UUID | None = None
    id: UUID
    manifesto_id: UUID | None = None
    position: Annotated[int, Field(ge=0)] | None = None
    purpose_term: UUID
    start_second: Annotated[float, Field(ge=0)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
