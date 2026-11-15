"""Base Query"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.shared.enums.sort_direction import SortDirection


class BaseQuery(BaseModel):
    """Base Query"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    limit: Annotated[int, Field(ge=0)] | None = Field(default=None, alias="limit")
    order: SortDirection | None = Field(default=None, alias="order")
    page: Annotated[int, Field(ge=0)] | None = Field(default=None, alias="page")
    sort: Annotated[str, Field(min_length=1, max_length=100)] | None = Field(default=None, alias="sort")
