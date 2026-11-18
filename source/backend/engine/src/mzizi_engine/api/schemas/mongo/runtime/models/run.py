"""Run"""

from __future__ import annotations

import builtins
from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.mongo.runtime.enums.run_status import RunStatus


class Run(BaseModel):
    """Run"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    finished_at: datetime | None = Field(default=None, alias="finishedAt")
    id: UUID = Field(alias="id")
    job_ids: builtins.list[UUID] = Field(alias="jobIds")
    kind: Annotated[str, Field(min_length=1, max_length=100)] = Field(alias="kind")
    note: Annotated[str, Field(max_length=1000)] | None = Field(default=None, alias="note")
    started_at: datetime = Field(alias="startedAt")
    status: RunStatus = Field(alias="status")
