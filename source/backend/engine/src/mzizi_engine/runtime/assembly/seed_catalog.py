"""Project the manifest catalog onto the engine's read-only seed operation."""

from hashlib import sha256

from pydantic import RootModel

from mzizi_engine.runtime.contracts.seed_catalog import SeedCatalog, SeedCatalogRequest, SeedColumn, SeedTable
from mzizi_manifest.features.database.tables import Table, load_tables

SEED_CATALOG_OPERATION = "catalog.seed_tables"


class UnknownSeedTable(ValueError):
    """The requested table does not have a seed contract."""


def _seed_table(table: Table, by_id: dict[str, Table]) -> SeedTable:
    columns: list[SeedColumn] = []
    for column in table.columns.values():
        link = column.link
        name = link.alias if link else column.name
        if name not in table.seed.columns:
            continue
        columns.append(
            SeedColumn(
                name=name,
                kind=column.kind,
                required=name in table.seed.required,
                target_table=by_id[link.table_id].qualified_name if link else None,
                target_column=link.column if link else None,
            )
        )
    return SeedTable(
        name=table.qualified_name,
        natural_key=table.natural_key,
        columns=tuple(sorted(columns, key=lambda column: column.name)),
    )


def seed_catalog(request: SeedCatalogRequest) -> SeedCatalog:
    return project_seed_catalog(load_tables(), request)


def project_seed_catalog(tables: dict[str, Table], request: SeedCatalogRequest) -> SeedCatalog:
    by_id = {table.id: table for table in tables.values()}
    catalog = tuple(_seed_table(table, by_id) for _, table in sorted(tables.items()) if table.seedable)
    selected = tuple(table for table in catalog if request.table is None or table.name == request.table)
    if request.table is not None and not selected:
        raise UnknownSeedTable("No seed contract for the requested table")
    digest = sha256(RootModel[tuple[SeedTable, ...]](catalog).model_dump_json().encode()).hexdigest()
    return SeedCatalog(sha256=digest, tables=selected)
