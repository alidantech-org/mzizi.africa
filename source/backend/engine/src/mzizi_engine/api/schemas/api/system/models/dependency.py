"""Dependency"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.system.enums.health_state import HealthState


class Dependency(BaseModel):
    """Dependency"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    detail: Annotated[str, Field(max_length=1000)] | None = Field(default=None, alias="detail")
    name: Annotated[str, Field(max_length=1000)] = Field(alias="name")
    state: HealthState = Field(alias="state")
