"""Candidate Window"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.mongo.staging.enums.candidate_kind import CandidateKind
from mzizi_engine.api.schemas.mongo.staging.enums.candidate_status import CandidateStatus


class CandidateWindow(BaseModel):
    """Candidate Window"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    kind: CandidateKind | None = Field(default=None, alias="kind")
    limit: Annotated[int, Field(ge=0, le=500)] | None = Field(default=None, alias="limit")
    status: CandidateStatus | None = Field(default=None, alias="status")
