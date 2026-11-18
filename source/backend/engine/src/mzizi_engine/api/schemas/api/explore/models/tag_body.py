"""Tag Body"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class TagBody(BaseModel):
    """Tag Body"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    domain: Annotated[str, Field(min_length=1, max_length=80)] | None = Field(default=None, alias="domain")
    texts: list[Annotated[str, Field(max_length=4000000)]] = Field(alias="texts")
