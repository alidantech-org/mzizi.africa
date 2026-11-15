"""Event Window"""

from __future__ import annotations

from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class EventWindow(BaseModel):
    """Event Window"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    after: Annotated[int, Field(ge=0)] | None = Field(default=None, alias="after")
    limit: Annotated[int, Field(ge=0, le=500)] | None = Field(default=None, alias="limit")
    run_id: UUID = Field(alias="runId")
