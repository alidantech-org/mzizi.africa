"""The short names that codes are built from: spaces, schema shorts and table shorts (`source/schema/codes.json`).

A schema or table short is fixed forever. A table's `kind` says how its row codes are built: `entity` (a name path, the
default), `scheme` (`<schema short>.<concept>...`, single-word concepts) or `member` (extends the code in its `parent` link).
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

from mzizi_manifest.shared.paths import SCHEMA_ROOT


@dataclass(frozen=True)
class TableCode:
    qualified_name: str
    schema_short: str
    short: str
    kind: str
    #: For a `member` table: the seed column whose value is the code the row's code extends.
    parent: str | None


@dataclass(frozen=True)
class Glossary:
    spaces: dict[str, str]
    #: Schema (database group) -> its short.
    schemas: dict[str, str]
    tables: dict[str, TableCode]

    def table_for(self, schema_short: str, table_short: str) -> TableCode | None:
        """The table with these two shorts, or None."""
        for table in self.tables.values():
            if table.schema_short == schema_short and table.short == table_short:
                return table
        return None

    def schema_shorts(self) -> frozenset[str]:
        return frozenset(self.schemas.values())


def load_glossary(schema_root: Path = SCHEMA_ROOT) -> Glossary:
    document = json.loads((schema_root / "codes.json").read_text(encoding="utf-8"))
    schemas: dict[str, str] = document["schemas"]
    tables = {
        name: TableCode(
            name, schemas[name.split(".", 1)[0]], spec["short"], spec.get("kind", "entity"), spec.get("parent")
        )
        for name, spec in document["tables"].items()
    }
    return Glossary(dict(document["spaces"]), dict(schemas), tables)
