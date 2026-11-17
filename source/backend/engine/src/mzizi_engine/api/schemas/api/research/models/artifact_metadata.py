"""Artifact Metadata"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.research.models.artifact_ref import ArtifactRef


class ArtifactMetadata(BaseModel):
    """Artifact Metadata"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    artifact: ArtifactRef = Field(alias="artifact")
    derived_from: list[Annotated[str, Field(min_length=1, max_length=2048)]] = Field(alias="derivedFrom")
    media_type: Annotated[str, Field(max_length=1000)] = Field(alias="mediaType")
    size: Annotated[int, Field(ge=0)] = Field(alias="size")
    source_url: Annotated[str, Field(max_length=1000)] | None = Field(default=None, alias="sourceUrl")
    stage: Annotated[str, Field(max_length=1000)] = Field(alias="stage")
