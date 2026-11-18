"""Prepare Request"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.explore.models.column_plan import ColumnPlan


class PrepareRequest(BaseModel):
    """Prepare Request"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    columns: list[ColumnPlan] = Field(alias="columns")
    path: Annotated[str, Field(max_length=2000)] = Field(alias="path")
    root: Annotated[str, Field(min_length=1, max_length=40)] = Field(alias="root")
    save_as: Annotated[str, Field(min_length=1, max_length=500)] | None = Field(default=None, alias="saveAs")
    skip_empty_rows: bool | None = Field(default=None, alias="skipEmptyRows")
