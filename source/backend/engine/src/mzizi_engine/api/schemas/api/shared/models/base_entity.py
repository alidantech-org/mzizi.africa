"""Base Entity"""

from __future__ import annotations

from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class BaseEntity(BaseModel):
    """Base Entity"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    created_at: datetime = Field(alias="createdAt")
    id: UUID = Field(alias="id")
    updated_at: datetime = Field(alias="updatedAt")
    version: Annotated[int, Field(ge=0)] = Field(alias="version")
