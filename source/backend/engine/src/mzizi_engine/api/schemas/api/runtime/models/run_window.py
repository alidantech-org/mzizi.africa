"""Run Window"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.mongo.runtime.enums.run_status import RunStatus


class RunWindow(BaseModel):
    """Run Window"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    limit: Annotated[int, Field(ge=0, le=500)] | None = Field(default=None, alias="limit")
    status: RunStatus | None = Field(default=None, alias="status")
