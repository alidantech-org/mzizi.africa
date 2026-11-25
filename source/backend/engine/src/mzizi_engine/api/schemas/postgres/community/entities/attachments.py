"""Attachments: one row of attachments."""

from __future__ import annotations

from datetime import datetime
from typing import ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class CommunityAttachmentsRow(BaseModel):
    """Media attached to a post; reviewed with the post."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.attachments"

    asset_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    post_country_id: UUID
    post_id: UUID
