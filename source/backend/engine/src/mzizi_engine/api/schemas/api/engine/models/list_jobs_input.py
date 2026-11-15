"""List Jobs Input"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.engine.enums.job_status import JobStatus


class ListJobsInput(BaseModel):
    """List Jobs Input"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    limit: Annotated[int, Field(ge=0, le=500)] | None = Field(default=None, alias="limit")
    status: JobStatus | None = Field(default=None, alias="status")
