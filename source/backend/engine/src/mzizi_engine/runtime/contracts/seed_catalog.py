"""Seed contract catalog responses derived from the generated database schemas."""

from pydantic import Field

from mzizi_engine.runtime.contracts.base import Frozen


class SeedCatalogRequest(Frozen):
    table: str | None = Field(default=None, min_length=1, max_length=200)


class SeedColumn(Frozen):
    name: str
    kind: str
    required: bool
    target_table: str | None = None
    target_column: str | None = None


class SeedTable(Frozen):
    name: str
    natural_key: tuple[str, ...]
    columns: tuple[SeedColumn, ...]


class SeedCatalog(Frozen):
    sha256: str
    tables: tuple[SeedTable, ...]
