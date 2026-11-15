"""Run List"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.mongo.runtime.models.run import Run


class RunList(BaseModel):
    """Run List"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    runs: list[Run] = Field(alias="runs")
