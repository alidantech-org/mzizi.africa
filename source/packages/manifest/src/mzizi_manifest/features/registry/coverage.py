"""How much of the database the column dictionaries describe: per seedable table, which seed columns have terms, and whether
the table has a code recipe and a name lookup."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from mzizi_manifest.features.database.tables import Table, load_tables
from mzizi_manifest.features.registry.scan import _documents


@dataclass(frozen=True)
class TableCoverage:
    table: str
    seed_columns: tuple[str, ...]
    covered: tuple[str, ...]
    recipe: bool
    lookup: bool

    @property
    def uncovered(self) -> tuple[str, ...]:
        return tuple(c for c in self.seed_columns if c not in self.covered and c != "code")


def coverage(root: Path, tables: dict[str, Table] | None = None) -> list[TableCoverage]:
    tables = tables if tables is not None else load_tables()
    covered: dict[str, set[str]] = {}
    recipes: set[str] = set()
    lookups: set[str] = set()
    for _, document in _documents(root):
        if not str(document.get("code", "")).startswith("sys.col."):
            continue
        for column, entry in (document.get("columns") or {}).items():
            if (entry or {}).get("terms"):
                table, _, name = column.rpartition(".")
                covered.setdefault(table, set()).add(name)
        for name, spec in (document.get("tables") or {}).items():
            if (spec or {}).get("code"):
                recipes.add(name)
            if (spec or {}).get("lookup"):
                lookups.add(name)
    return [
        TableCoverage(
            name, tuple(t.seed.columns), tuple(sorted(covered.get(name, ()))), name in recipes, name in lookups
        )
        for name, t in sorted(tables.items())
        if t.seedable
    ]
