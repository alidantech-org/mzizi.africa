"""Capability"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class Capability(BaseModel):
    """Capability"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    description: Annotated[str, Field(max_length=1000)] | None = Field(default=None, alias="description")
    name: Annotated[str, Field(min_length=1, max_length=200)] = Field(alias="name")
    package: Annotated[str, Field(min_length=1, max_length=100)] = Field(alias="package")
    version: Annotated[str, Field(min_length=1, max_length=50)] = Field(alias="version")
