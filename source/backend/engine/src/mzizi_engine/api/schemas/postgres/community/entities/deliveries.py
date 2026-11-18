"""Deliveries: one row of deliveries."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.community.enums.delivery_state import DeliveryState


class CommunityDeliveriesRow(BaseModel):
    """The delivery of one notification to one device for one subscription."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.deliveries"

    created_at: datetime
    deleted_at: datetime | None = None
    device_id: UUID
    id: UUID
    notification_id: UUID
    opened_at: datetime | None = None
    sent_at: datetime | None = None
    state: DeliveryState
    subscription_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
