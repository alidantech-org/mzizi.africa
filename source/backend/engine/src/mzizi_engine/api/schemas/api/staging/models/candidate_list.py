"""Candidate List"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.mongo.staging.models.candidate import Candidate


class CandidateList(BaseModel):
    """Candidate List"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    candidates: list[Candidate] = Field(alias="candidates")
