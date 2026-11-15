"""Capability List"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.engine.models.capability import Capability


class CapabilityList(BaseModel):
    """Capability List"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    capabilities: list[Capability] = Field(alias="capabilities")
