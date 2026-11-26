"""Events: one row of events."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.identity_kind import IdentityKind


class EventsRow(BaseModel):
    """A planned or recurring civic happening (Madaraka Day, budget reading). Its names are `identity.names`."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "event.events"

    calendar_id: UUID | None = None
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    feature_id: UUID | None = None
    id: UUID
    identity_kind: IdentityKind
    kind_term: UUID
    level_id: UUID | None = None
    organiser_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
