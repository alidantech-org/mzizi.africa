"""Obligations: one row of obligations."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.governance.enums.frequency import Frequency


class ObligationsRow(BaseModel):
    """A duty to report that law sets; its explanation is a definition name."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.obligations"

    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    frequency: Frequency
    holder_id: UUID
    id: UUID
    kind_term: UUID
    recipient_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
