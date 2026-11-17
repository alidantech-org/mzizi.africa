"""Seed Catalog"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.catalog.models.seed_table import SeedTable


class SeedCatalog(BaseModel):
    """Seed Catalog"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    sha256: Annotated[str, Field(min_length=64, max_length=64)] = Field(alias="sha256")
    tables: list[SeedTable] = Field(alias="tables")
