"""Job"""

from __future__ import annotations

from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.engine.enums.job_status import JobStatus
from mzizi_engine.jsonvalue import JsonValue


class Job(BaseModel):
    """Job"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    attempts: Annotated[int, Field(ge=0, le=500)] = Field(alias="attempts")
    error: Annotated[str, Field(max_length=4000)] | None = Field(default=None, alias="error")
    id: UUID = Field(alias="id")
    kind: Annotated[str, Field(min_length=1, max_length=200)] = Field(alias="kind")
    result: JsonValue | None = Field(default=None, alias="result")
    run_id: UUID | None = Field(default=None, alias="runId")
    status: JobStatus = Field(alias="status")
