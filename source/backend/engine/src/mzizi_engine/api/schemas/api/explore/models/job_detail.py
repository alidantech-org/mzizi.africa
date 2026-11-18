"""Job Detail"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.explore.models.listing import Listing
from mzizi_engine.jsonvalue import JsonValue


class JobDetail(BaseModel):
    """Job Detail"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    events: list[JsonValue] = Field(alias="events")
    job: JsonValue = Field(alias="job")
    output: Listing | None = Field(default=None, alias="output")
