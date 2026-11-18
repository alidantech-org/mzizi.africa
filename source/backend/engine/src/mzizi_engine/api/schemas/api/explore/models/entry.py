"""Entry"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class Entry(BaseModel):
    """Entry"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    directory: bool = Field(alias="directory")
    kind: Annotated[str, Field(min_length=1, max_length=500)] = Field(alias="kind")
    modified: Annotated[str, Field(min_length=1, max_length=500)] = Field(alias="modified")
    name: Annotated[str, Field(min_length=1, max_length=500)] = Field(alias="name")
    path: Annotated[str, Field(max_length=2000)] = Field(alias="path")
    size: Annotated[int, Field(ge=0, le=1000000000)] = Field(alias="size")
