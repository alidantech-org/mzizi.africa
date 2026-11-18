"""Table Info"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class TableInfo(BaseModel):
    """Table Info"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    columns: Annotated[int, Field(ge=0, le=1000000000)] = Field(alias="columns")
    describe: Annotated[str, Field(max_length=4000000)] = Field(alias="describe")
    name: Annotated[str, Field(min_length=1, max_length=500)] = Field(alias="name")
    rows: Annotated[int, Field(ge=0, le=1000000000)] = Field(alias="rows")
