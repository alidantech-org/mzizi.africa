"""Capture Window"""

from __future__ import annotations

from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CaptureWindow(BaseModel):
    """Capture Window"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    limit: Annotated[int, Field(ge=0, le=500)] | None = Field(default=None, alias="limit")
    source_id: UUID | None = Field(default=None, alias="sourceId")
