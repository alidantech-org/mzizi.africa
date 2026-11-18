"""File View"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.jsonvalue import JsonValue


class FileView(BaseModel):
    """File View"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    actions: list[Annotated[str, Field(min_length=1, max_length=500)]] = Field(alias="actions")
    header: list[Annotated[str, Field(min_length=1, max_length=500)]] = Field(alias="header")
    kind: Annotated[str, Field(min_length=1, max_length=500)] = Field(alias="kind")
    modified: Annotated[str, Field(min_length=1, max_length=500)] = Field(alias="modified")
    name: Annotated[str, Field(min_length=1, max_length=500)] = Field(alias="name")
    parsed: JsonValue | None = Field(default=None, alias="parsed")
    path: Annotated[str, Field(max_length=2000)] = Field(alias="path")
    root: Annotated[str, Field(min_length=1, max_length=40)] = Field(alias="root")
    rows: list[JsonValue] = Field(alias="rows")
    size: Annotated[int, Field(ge=0, le=1000000000)] = Field(alias="size")
    text: Annotated[str, Field(max_length=4000000)] | None = Field(default=None, alias="text")
    total_rows: Annotated[int, Field(ge=0, le=1000000000)] | None = Field(default=None, alias="totalRows")
    truncated: bool = Field(alias="truncated")
