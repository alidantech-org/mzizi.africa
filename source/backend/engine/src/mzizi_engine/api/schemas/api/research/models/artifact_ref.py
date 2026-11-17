"""Artifact Ref"""

from __future__ import annotations

from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ArtifactRef(BaseModel):
    """Artifact Ref"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    path: Annotated[str, Field(min_length=1, max_length=2048)] = Field(alias="path")
    run_id: UUID = Field(alias="runId")
    sha256: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")] = Field(alias="sha256")
