"""Raw File"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class RawFile(BaseModel):
    """Raw File"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    base64: Annotated[str, Field(max_length=24000000)] = Field(alias="base64")
    content_type: Annotated[str, Field(min_length=1, max_length=500)] = Field(alias="contentType")
    name: Annotated[str, Field(min_length=1, max_length=500)] = Field(alias="name")
    size: Annotated[int, Field(ge=0, le=1000000000)] = Field(alias="size")
