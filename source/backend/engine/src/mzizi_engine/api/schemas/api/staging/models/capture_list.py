"""Capture List"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.mongo.staging.models.capture import Capture


class CaptureList(BaseModel):
    """Capture List"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    captures: list[Capture] = Field(alias="captures")
