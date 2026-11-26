"""Notifications: one row of notifications."""

from __future__ import annotations

from datetime import datetime
from typing import ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from mzizi_engine.api.schemas.postgres.shared.enums.notification_kind import NotificationKind


class NotificationsRow(BaseModel):
    """A notification to send; partitioned by month of creation."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.notifications"

    created_at: datetime
    id: UUID
    identity_id: UUID | None = None
    key_id: UUID
    kind: NotificationKind
    occurrence_id: UUID | None = None
    post_country_id: UUID | None = None
    post_id: UUID | None = None
