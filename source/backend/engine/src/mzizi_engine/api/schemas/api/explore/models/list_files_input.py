"""List Files Input"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class ListFilesInput(BaseModel):
    """List Files Input"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    path: Annotated[str, Field(max_length=2000)] | None = Field(default=None, alias="path")
    root: Annotated[str, Field(min_length=1, max_length=40)] = Field(alias="root")
