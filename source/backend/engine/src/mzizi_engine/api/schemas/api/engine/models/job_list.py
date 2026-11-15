"""Job List"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.engine.models.job import Job


class JobList(BaseModel):
    """Job List"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    jobs: list[Job] = Field(alias="jobs")
