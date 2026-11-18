"""Column Info"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class ColumnInfo(BaseModel):
    """Column Info"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    name: Annotated[str, Field(min_length=1, max_length=500)] = Field(alias="name")
    nullable: bool = Field(alias="nullable")
    primary: bool = Field(alias="primary")
    type: Annotated[str, Field(min_length=1, max_length=500)] = Field(alias="type")
