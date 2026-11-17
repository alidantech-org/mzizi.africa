"""Seed Catalog Query"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class SeedCatalogQuery(BaseModel):
    """Seed Catalog Query"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    table: Annotated[str, Field(min_length=1, max_length=200)] | None = Field(default=None, alias="table")
