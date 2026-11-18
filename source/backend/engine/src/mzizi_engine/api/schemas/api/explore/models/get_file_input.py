"""Get File Input"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class GetFileInput(BaseModel):
    """Get File Input"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    limit: Annotated[int, Field(ge=0, le=1000000000)] | None = Field(default=None, alias="limit")
    offset: Annotated[int, Field(ge=0, le=1000000000)] | None = Field(default=None, alias="offset")
    path: Annotated[str, Field(max_length=2000)] = Field(alias="path")
    root: Annotated[str, Field(min_length=1, max_length=40)] = Field(alias="root")
