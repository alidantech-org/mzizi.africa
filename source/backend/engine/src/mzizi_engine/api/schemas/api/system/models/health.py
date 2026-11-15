"""Health"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.system.enums.health_state import HealthState


class Health(BaseModel):
    """Health"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    state: HealthState = Field(alias="state")
