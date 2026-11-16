"""Worker Run Document"""

from __future__ import annotations

from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.mongo.run_ledger.enums.ledger_run_state import LedgerRunState


class WorkerRunDocument(BaseModel):
    """Worker Run Document"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    attempts: Annotated[int, Field(ge=0)] = Field(alias="attempts")
    failure_type: Annotated[str, Field(min_length=1)] | None = Field(default=None, alias="failureType")
    finished_at: datetime | None = Field(default=None, alias="finishedAt")
    manifest_hash: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")] | None = Field(
        default=None, alias="manifestHash"
    )
    requested_at: datetime = Field(alias="requestedAt")
    requested_by: Annotated[str, Field(min_length=1)] | None = Field(default=None, alias="requestedBy")
    run_id: UUID = Field(alias="runId")
    spec_hash: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")] = Field(alias="specHash")
    spec_json: str = Field(alias="specJson")
    started_at: datetime | None = Field(default=None, alias="startedAt")
    state: LedgerRunState = Field(alias="state")
