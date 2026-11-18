"""Save File Body"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class SaveFileBody(BaseModel):
    """Save File Body"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    overwrite: bool | None = Field(default=None, alias="overwrite")
    path: Annotated[str, Field(max_length=2000)] = Field(alias="path")
    text: Annotated[str, Field(max_length=4000000)] = Field(alias="text")
