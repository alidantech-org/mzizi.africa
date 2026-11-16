"""The stored tables, read from the Dryv-generated schemas in `source/schema/database/`.

Nothing here knows a table by name: the generated files are the only catalogue, so a seed file, a mapping or a ranking
rule can be checked against the contracts without a second hand-kept list.
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

from mzizi_manifest.shared.paths import SCHEMA_ROOT


@dataclass(frozen=True)
class Column:
    name: str
    #: Dryv's column kind: uuid, text, boolean, integer, decimal, number, date, time, interval or timestamp.
    kind: str
    #: True when a seed author must supply a value (not nullable, no default, not filled by the system).
    required: bool
    nullable: bool
    #: Filled by the system (created_at, updated_at, version, deleted_at): optional in a seed file.
    managed: bool
    primary_key: bool
    max_length: int | None
    enum: tuple[str, ...] | None
    #: The contract id of the referenced table and its column, for a foreign key.
    references: tuple[str, str] | None


@dataclass(frozen=True)
class Table:
    id: str
    qualified_name: str
    primary_key: tuple[str, ...]
    unique_keys: tuple[tuple[str, ...], ...]
    columns: dict[str, Column]


def _column(name: str, spec: dict, required: set[str]) -> Column:
    reference = spec.get("x-references")
    types = spec["type"]
    return Column(
        name=name,
        kind=spec["x-type"],
        required=name in required,
        nullable="null" in types if isinstance(types, list) else False,
        managed=bool(spec.get("x-managed")),
        primary_key=bool(spec.get("x-primaryKey")),
        max_length=spec.get("maxLength"),
        enum=tuple(spec["enum"]) if "enum" in spec else None,
        references=(reference["tableId"], reference["column"]) if reference else None,
    )


def load_tables(schema_root: Path = SCHEMA_ROOT) -> dict[str, Table]:
    """Every stored table keyed by `schema.table`."""
    tables: dict[str, Table] = {}
    for path in sorted((schema_root / "database").glob("*.schema.json")):
        for definition in json.loads(path.read_text(encoding="utf-8"))["$defs"].values():
            required = set(definition["required"])
            tables[definition["x-table"]] = Table(
                id=definition["x-id"],
                qualified_name=definition["x-table"],
                primary_key=tuple(definition["x-primaryKey"]),
                unique_keys=tuple(tuple(key) for key in definition["x-uniqueKeys"]),
                columns={name: _column(name, spec, required) for name, spec in definition["properties"].items()},
            )
    return tables
