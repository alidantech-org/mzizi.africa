"""Readiness"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.system.enums.health_state import HealthState
from mzizi_engine.api.schemas.api.system.models.dependency import Dependency


class Readiness(BaseModel):
    """Readiness"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    dependencies: list[Dependency] = Field(alias="dependencies")
    state: HealthState = Field(alias="state")
