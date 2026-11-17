"""Seed Column"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class SeedColumn(BaseModel):
    """Seed Column"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    kind: Annotated[str, Field(max_length=1000)] = Field(alias="kind")
    name: Annotated[str, Field(max_length=1000)] = Field(alias="name")
    required: bool = Field(alias="required")
    target_column: Annotated[str, Field(max_length=1000)] | None = Field(default=None, alias="targetColumn")
    target_table: Annotated[str, Field(min_length=1, max_length=200)] | None = Field(default=None, alias="targetTable")
