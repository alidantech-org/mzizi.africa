"""Events: one row of events."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.audit.enums.audit_action import AuditAction


class EventsRow(BaseModel):
    """Immutable attributable operational action, hash-chained to the previous event."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "audit.events"

    action: AuditAction
    actor_id: UUID | None = None
    correlation_id: UUID | None = None
    details: str | None = None
    event_hash: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")]
    id: UUID
    previous_hash: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")] | None = None
    recorded_at: datetime
    request_id: UUID | None = None
    target_id: UUID
    target_kind: Annotated[str, Field(min_length=1, max_length=100)]
    target_version: Annotated[str, Field(min_length=1, max_length=255)] | None = None
