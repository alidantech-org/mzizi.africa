"""Run Event Document"""

from __future__ import annotations

from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.mongo.run_ledger.enums.ledger_event_level import LedgerEventLevel
from mzizi_engine.api.schemas.mongo.run_ledger.enums.ledger_run_state import LedgerRunState


class RunEventDocument(BaseModel):
    """Run Event Document"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    event_id: UUID = Field(alias="eventId")
    expires_at: datetime = Field(alias="expiresAt")
    failure_type: Annotated[str, Field(min_length=1)] | None = Field(default=None, alias="failureType")
    level: LedgerEventLevel = Field(alias="level")
    run_id: UUID = Field(alias="runId")
    stage: Annotated[str, Field(min_length=1)] | None = Field(default=None, alias="stage")
    state: LedgerRunState = Field(alias="state")
    time: datetime = Field(alias="time")
