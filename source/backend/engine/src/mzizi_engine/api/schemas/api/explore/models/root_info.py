"""Root Info"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class RootInfo(BaseModel):
    """Root Info"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    name: Annotated[str, Field(min_length=1, max_length=40)] = Field(alias="name")
    path: Annotated[str, Field(max_length=2000)] = Field(alias="path")
