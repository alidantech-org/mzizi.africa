"""Appointments: one row of appointments."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.governance.enums.appointment_step import AppointmentStep


class AppointmentsRow(BaseModel):
    """One step that put a holder in office; appointments by Parliament or a board are recorded like those by a person."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.appointments"

    actor_holder_id: UUID | None = None
    actor_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    holder_id: UUID
    id: UUID
    motion_id: UUID | None = None
    on_date: date | None = None
    step: AppointmentStep
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
