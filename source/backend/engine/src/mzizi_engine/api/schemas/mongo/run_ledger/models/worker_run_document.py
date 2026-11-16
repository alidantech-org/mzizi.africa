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

    approval_json: str | None = Field(default=None, alias="approvalJson")
    attempts: Annotated[int, Field(ge=0)] = Field(alias="attempts")
    available_at: datetime | None = Field(default=None, alias="availableAt")
    cancel_requested_at: datetime | None = Field(default=None, alias="cancelRequestedAt")
    failure_type: Annotated[str, Field(min_length=1)] | None = Field(default=None, alias="failureType")
    finished_at: datetime | None = Field(default=None, alias="finishedAt")
    heartbeat_at: datetime | None = Field(default=None, alias="heartbeatAt")
    lease_expires_at: datetime | None = Field(default=None, alias="leaseExpiresAt")
    lease_id: UUID | None = Field(default=None, alias="leaseId")
    logs_expired: bool | None = Field(default=None, alias="logsExpired")
    manifest_hash: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")] | None = Field(
        default=None, alias="manifestHash"
    )
    release_plan_hash: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")] | None = Field(
        default=None, alias="releasePlanHash"
    )
    requested_at: datetime = Field(alias="requestedAt")
    requested_by: Annotated[str, Field(min_length=1)] | None = Field(default=None, alias="requestedBy")
    revision: Annotated[int, Field(ge=0)] | None = Field(default=None, alias="revision")
    run_id: UUID = Field(alias="runId")
    run_store: Annotated[str, Field(min_length=1)] | None = Field(default=None, alias="runStore")
    sealed_at: datetime | None = Field(default=None, alias="sealedAt")
    spec_hash: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")] = Field(alias="specHash")
    spec_json: str = Field(alias="specJson")
    stages_completed: Annotated[int, Field(ge=0)] | None = Field(default=None, alias="stagesCompleted")
    started_at: datetime | None = Field(default=None, alias="startedAt")
    state: LedgerRunState = Field(alias="state")
