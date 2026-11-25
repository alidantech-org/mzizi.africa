"""Dispatches: one row of dispatches."""

from __future__ import annotations

from datetime import datetime
from typing import ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from mzizi_engine.api.schemas.postgres.community.enums.dispatch_state import DispatchState


class DispatchesRow(BaseModel):
    """One sending of a notification to one device; partitioned by month."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.dispatches"

    created_at: datetime
    device_id: UUID
    id: UUID
    notification_created_at: datetime
    notification_id: UUID
    opened_at: datetime | None = None
    sent_at: datetime | None = None
    state: DispatchState
    subscription_id: UUID
