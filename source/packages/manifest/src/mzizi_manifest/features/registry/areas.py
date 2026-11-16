"""The areas a code may name in its second segment: database groups (then a table of that group) and system areas."""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

from mzizi_manifest.features.database.tables import load_tables
from mzizi_manifest.shared.paths import SCHEMA_ROOT


@dataclass(frozen=True)
class Areas:
    #: Database group -> the names of its tables, from the generated `source/schema/database/` files.
    tables: dict[str, frozenset[str]]
    #: Areas for things that are not database rows (database, engine, web), from `systemArea` in `sources/common.schema.json`.
    system: frozenset[str]


def load_areas(schema_root: Path = SCHEMA_ROOT) -> Areas:
    grouped: dict[str, set[str]] = {}
    for qualified in load_tables(schema_root):
        group, table = qualified.split(".", 1)
        grouped.setdefault(group, set()).add(table)
    common = json.loads((schema_root / "sources" / "common.schema.json").read_text(encoding="utf-8"))
    return Areas(
        {group: frozenset(tables) for group, tables in grouped.items()},
        frozenset(common["$defs"]["systemArea"]["enum"]),
    )
