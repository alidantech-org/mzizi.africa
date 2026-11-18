"""Job Detail Input"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class JobDetailInput(BaseModel):
    """Job Detail Input"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    job_id: Annotated[str, Field(min_length=1, max_length=500)] = Field(alias="jobId")
