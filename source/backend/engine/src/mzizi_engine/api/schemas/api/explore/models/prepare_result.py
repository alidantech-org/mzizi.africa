"""Prepare Result"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.jsonvalue import JsonValue


class PrepareResult(BaseModel):
    """Prepare Result"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    dropped_rows: Annotated[int, Field(ge=0, le=1000000000)] = Field(alias="droppedRows")
    header: list[Annotated[str, Field(min_length=1, max_length=500)]] = Field(alias="header")
    problems: list[Annotated[str, Field(max_length=4000000)]] = Field(alias="problems")
    rows: list[JsonValue] = Field(alias="rows")
    saved: Annotated[str, Field(max_length=2000)] = Field(alias="saved")
    total_rows: Annotated[int, Field(ge=0, le=1000000000)] = Field(alias="totalRows")
