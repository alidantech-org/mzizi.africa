"""Job Event"""

from __future__ import annotations

from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.mongo.runtime.enums.job_event_type import JobEventType
from mzizi_engine.jsonvalue import JsonValue


class JobEvent(BaseModel):
    """Job Event"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    at: datetime = Field(alias="at")
    data: JsonValue | None = Field(default=None, alias="data")
    id: UUID = Field(alias="id")
    job_id: UUID = Field(alias="jobId")
    message: Annotated[str, Field(max_length=1000)] | None = Field(default=None, alias="message")
    run_id: UUID | None = Field(default=None, alias="runId")
    sequence: Annotated[int, Field(ge=0)] = Field(alias="sequence")
    type: JobEventType = Field(alias="type")
