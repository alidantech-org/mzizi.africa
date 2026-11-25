"""Views: one row of views."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ViewsRow(BaseModel):
    """A counted view, kept for a limited time."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.views"

    article_id: UUID | None = None
    country_id: UUID | None = None
    created_at: datetime
    day: date
    id: UUID
    identity_id: UUID | None = None
    post_country_id: UUID | None = None
    post_id: UUID | None = None
    visitor_hash: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")]
