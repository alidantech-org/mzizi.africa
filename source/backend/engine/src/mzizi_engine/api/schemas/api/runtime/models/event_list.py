"""Event List"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.mongo.runtime.models.job_event import JobEvent


class EventList(BaseModel):
    """Event List"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    events: list[JobEvent] = Field(alias="events")
