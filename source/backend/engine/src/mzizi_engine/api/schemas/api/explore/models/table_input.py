"""Table Input"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class TableInput(BaseModel):
    """Table Input"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    direction: Annotated[str, Field(min_length=1, max_length=500)] | None = Field(default=None, alias="direction")
    domain: Annotated[str, Field(min_length=1, max_length=80)] = Field(alias="domain")
    limit: Annotated[int, Field(ge=0, le=1000000000)] | None = Field(default=None, alias="limit")
    offset: Annotated[int, Field(ge=0, le=1000000000)] | None = Field(default=None, alias="offset")
    order: Annotated[str, Field(min_length=1, max_length=500)] | None = Field(default=None, alias="order")
    q: Annotated[str, Field(max_length=4000000)] | None = Field(default=None, alias="q")
    table: Annotated[str, Field(min_length=1, max_length=500)] = Field(alias="table")
