"""Table Page"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.explore.models.column_info import ColumnInfo
from mzizi_engine.jsonvalue import JsonValue


class TablePage(BaseModel):
    """Table Page"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    columns: list[ColumnInfo] = Field(alias="columns")
    direction: Annotated[str, Field(min_length=1, max_length=500)] = Field(alias="direction")
    domain: Annotated[str, Field(min_length=1, max_length=80)] = Field(alias="domain")
    limit: Annotated[int, Field(ge=0, le=1000000000)] = Field(alias="limit")
    offset: Annotated[int, Field(ge=0, le=1000000000)] = Field(alias="offset")
    order: Annotated[str, Field(min_length=1, max_length=500)] = Field(alias="order")
    rows: list[JsonValue] = Field(alias="rows")
    search: Annotated[str, Field(max_length=4000000)] = Field(alias="search")
    table: Annotated[str, Field(min_length=1, max_length=500)] = Field(alias="table")
    total: Annotated[int, Field(ge=0, le=1000000000)] = Field(alias="total")
