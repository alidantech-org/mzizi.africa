"""Data List Page"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.explore.models.data_list import DataList
from mzizi_engine.jsonvalue import JsonValue


class DataListPage(BaseModel):
    """Data List Page"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    definition: DataList = Field(alias="definition")
    limit: Annotated[int, Field(ge=0, le=1000000000)] = Field(alias="limit")
    offset: Annotated[int, Field(ge=0, le=1000000000)] = Field(alias="offset")
    rows: list[JsonValue] = Field(alias="rows")
    total: Annotated[int, Field(ge=0, le=1000000000)] = Field(alias="total")
