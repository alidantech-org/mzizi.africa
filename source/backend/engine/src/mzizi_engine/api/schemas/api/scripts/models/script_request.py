"""Script Request"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.research.models.artifact_ref import ArtifactRef
from mzizi_engine.api.schemas.api.scripts.enums.language import Language


class ScriptRequest(BaseModel):
    """Script Request"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    inputs: list[ArtifactRef] | None = Field(default=None, alias="inputs")
    language: Language = Field(alias="language")
    script: Annotated[str, Field(min_length=1, max_length=65536)] = Field(alias="script")
    timeout_seconds: Annotated[int, Field(ge=1, le=60)] | None = Field(default=None, alias="timeoutSeconds")
