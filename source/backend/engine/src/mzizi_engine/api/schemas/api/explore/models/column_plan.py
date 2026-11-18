"""Column Plan"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.jsonvalue import JsonValue


class ColumnPlan(BaseModel):
    """Column Plan"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    clean: list[JsonValue] | None = Field(default=None, alias="clean")
    keep: bool | None = Field(default=None, alias="keep")
    name: Annotated[str, Field(min_length=1, max_length=500)] | None = Field(default=None, alias="name")
    source: Annotated[str, Field(min_length=1, max_length=500)] = Field(alias="source")
