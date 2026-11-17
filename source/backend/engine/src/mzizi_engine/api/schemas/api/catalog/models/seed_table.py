"""Seed Table"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.catalog.models.seed_column import SeedColumn


class SeedTable(BaseModel):
    """Seed Table"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    columns: list[SeedColumn] = Field(alias="columns")
    name: Annotated[str, Field(min_length=1, max_length=200)] = Field(alias="name")
    natural_key: list[Annotated[str, Field(max_length=1000)]] = Field(alias="naturalKey")
