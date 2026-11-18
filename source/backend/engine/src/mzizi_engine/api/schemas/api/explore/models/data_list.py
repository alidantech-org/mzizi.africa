"""Data List"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class DataList(BaseModel):
    """Data List"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    code: Annotated[str, Field(min_length=1, max_length=500)] = Field(alias="code")
    columns: list[Annotated[str, Field(min_length=1, max_length=500)]] = Field(alias="columns")
    describe: Annotated[str, Field(max_length=4000000)] = Field(alias="describe")
    domain: Annotated[str, Field(min_length=1, max_length=80)] = Field(alias="domain")
    sql: Annotated[str, Field(max_length=4000000)] = Field(alias="sql")
    title: Annotated[str, Field(min_length=1, max_length=500)] = Field(alias="title")
