"""Candidate"""

from __future__ import annotations

import builtins
from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.mongo.staging.enums.candidate_kind import CandidateKind
from mzizi_engine.api.schemas.mongo.staging.enums.candidate_status import CandidateStatus
from mzizi_engine.jsonvalue import JsonValue


class Candidate(BaseModel):
    """Candidate"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    capture_ids: builtins.list[UUID] = Field(alias="captureIds")
    confidence: Annotated[float, Field(ge=0, le=1)] | None = Field(default=None, alias="confidence")
    created_at: datetime = Field(alias="createdAt")
    decided_at: datetime | None = Field(default=None, alias="decidedAt")
    decided_by: Annotated[str, Field(max_length=255)] | None = Field(default=None, alias="decidedBy")
    id: UUID = Field(alias="id")
    kind: CandidateKind = Field(alias="kind")
    ledger_id: UUID | None = Field(default=None, alias="ledgerId")
    payload: JsonValue = Field(alias="payload")
    proposed_by: Annotated[str, Field(min_length=1, max_length=255)] = Field(alias="proposedBy")
    status: CandidateStatus = Field(alias="status")
    target_table: Annotated[str, Field(max_length=255)] | None = Field(default=None, alias="targetTable")
