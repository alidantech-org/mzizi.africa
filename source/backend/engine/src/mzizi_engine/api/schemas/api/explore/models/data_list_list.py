"""Data List List"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.explore.models.data_list import DataList


class DataListList(BaseModel):
    """Data List List"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    lists: list[DataList] = Field(alias="lists")
