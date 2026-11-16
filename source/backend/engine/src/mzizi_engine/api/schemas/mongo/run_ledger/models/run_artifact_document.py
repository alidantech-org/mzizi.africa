"""Run Artifact Document"""

from __future__ import annotations

from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.mongo.run_ledger.enums.ledger_artifact_state import LedgerArtifactState


class RunArtifactDocument(BaseModel):
    """Run Artifact Document"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    derived_from: list[Annotated[str, Field(min_length=1)]] = Field(alias="derivedFrom")
    media_type: Annotated[str, Field(min_length=1)] = Field(alias="mediaType")
    path: Annotated[str, Field(min_length=1)] = Field(alias="path")
    run_id: UUID = Field(alias="runId")
    sha256: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")] = Field(alias="sha256")
    size: Annotated[int, Field(ge=0)] = Field(alias="size")
    source_url: Annotated[str, Field(min_length=1)] | None = Field(default=None, alias="sourceUrl")
    stage: Annotated[str, Field(min_length=1)] = Field(alias="stage")
    state: LedgerArtifactState = Field(alias="state")
