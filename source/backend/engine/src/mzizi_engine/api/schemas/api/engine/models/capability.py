"""Capability"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class Capability(BaseModel):
    """Capability"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    description: Annotated[str, Field(max_length=1000)] | None = Field(default=None, alias="description")
    kind: Annotated[str, Field(min_length=1, max_length=200)] = Field(alias="kind")
