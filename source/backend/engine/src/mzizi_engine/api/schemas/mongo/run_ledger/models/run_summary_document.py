"""Run Summary Document"""

from __future__ import annotations

import builtins
from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.mongo.run_ledger.enums.ledger_run_state import LedgerRunState
from mzizi_engine.api.schemas.mongo.run_ledger.models.ledger_decision import LedgerDecision
from mzizi_engine.api.schemas.mongo.run_ledger.models.ledger_stage_count import LedgerStageCount
from mzizi_engine.api.schemas.mongo.run_ledger.models.run_artifact_document import RunArtifactDocument


class RunSummaryDocument(BaseModel):
    """Run Summary Document"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    approval_json: str | None = Field(default=None, alias="approvalJson")
    approver: Annotated[str, Field(min_length=1)] | None = Field(default=None, alias="approver")
    counts: builtins.list[LedgerStageCount] = Field(alias="counts")
    decisions: builtins.list[LedgerDecision] = Field(alias="decisions")
    files: builtins.list[RunArtifactDocument] = Field(alias="files")
    finished_at: datetime = Field(alias="finishedAt")
    manifest_hash: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")] | None = Field(
        default=None, alias="manifestHash"
    )
    run_id: UUID = Field(alias="runId")
    spec_hash: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")] = Field(alias="specHash")
    state: LedgerRunState = Field(alias="state")
