"""Capture"""

from __future__ import annotations

from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class Capture(BaseModel):
    """Capture"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    byte_size: Annotated[int, Field(ge=0)] = Field(alias="byteSize")
    content_type: Annotated[str, Field(max_length=255)] | None = Field(default=None, alias="contentType")
    fetched_at: datetime = Field(alias="fetchedAt")
    http_status: Annotated[int, Field(ge=100, le=599)] | None = Field(default=None, alias="httpStatus")
    id: UUID = Field(alias="id")
    object_key: Annotated[str, Field(min_length=1, max_length=500)] = Field(alias="objectKey")
    sha256: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")] = Field(alias="sha256")
    source_id: UUID = Field(alias="sourceId")
    url: Annotated[str, Field(max_length=2048)] = Field(alias="url")
