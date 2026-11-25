"""Attachments: one row of attachments."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CivicAttachmentsRow(BaseModel):
    """Media on projects, contracts and deliveries (site photos, signed contracts)."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "civic.attachments"

    article_id: UUID | None = None
    asset_id: UUID | None = None
    contract_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    delivery_id: UUID | None = None
    end_second: Annotated[float, Field(ge=0)] | None = None
    id: UUID
    position: Annotated[int, Field(ge=0)] | None = None
    project_id: UUID | None = None
    purpose_term: UUID
    start_second: Annotated[float, Field(ge=0)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
