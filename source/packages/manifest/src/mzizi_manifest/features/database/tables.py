"""The stored tables, read from the Dryv-generated schemas in `source/schema/database/`.

Nothing here knows a table by name: the generated files are the only catalogue, so a seed file, a mapping or a ranking
rule can be checked against the contracts without a second hand-kept list.

Each table has two views. The stored view is every database column. The seed view is what an author writes: the natural
key (a table's `code`), its data, and links written as the target's code (`scheme_code`), never ids or system fields.
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

from mzizi_manifest.shared.paths import SCHEMA_ROOT


@dataclass(frozen=True)
class Link:
    """A foreign key: the contract id of the target table, its column, and the seed column that names the target by code."""

    table_id: str
    column: str
    alias: str


@dataclass(frozen=True)
class Column:
    name: str
    #: Dryv's column kind: uuid, text, boolean, integer, decimal, number, date, time, interval or timestamp.
    kind: str
    #: `key` (natural key), `data`, `link` (foreign key) or `system` (assigned by the system, never in a seed).
    role: str
    #: True when a client must supply a value in a stored row (not nullable, no default, not filled by the system).
    required: bool
    nullable: bool
    #: Filled by the system (created_at, updated_at, version, deleted_at).
    managed: bool
    primary_key: bool
    min_length: int | None
    max_length: int | None
    pattern: str | None
    enum: tuple[str, ...] | None
    link: Link | None

    @property
    def references(self) -> tuple[str, str] | None:
        """The contract id of the referenced table and its column, for a foreign key."""
        return (self.link.table_id, self.link.column) if self.link else None


@dataclass(frozen=True)
class Seed:
    """The shape of a seed file row: allowed columns, required columns and the system columns it must not contain."""

    columns: tuple[str, ...]
    required: tuple[str, ...]
    system: tuple[str, ...]


@dataclass(frozen=True)
class Table:
    id: str
    #: `global.<group>.<table>`: the table's own code; a seed CSV for it is `<scope>.<group>.<table>`.
    code: str
    qualified_name: str
    primary_key: tuple[str, ...]
    unique_keys: tuple[tuple[str, ...], ...]
    #: The columns that identify a row to a human; empty when the table cannot be seeded by CSV.
    natural_key: tuple[str, ...]
    seedable: bool
    seed: Seed
    columns: dict[str, Column]

    def stored_name(self, seed_column: str) -> str:
        """The stored column a seed column fills: `scheme_code` fills `scheme_id`."""
        for column in self.columns.values():
            if column.link and column.link.alias == seed_column:
                return column.name
        return seed_column


def _column(name: str, spec: dict, required: set[str]) -> Column:
    link = spec.get("x-link")
    types = spec["type"]
    return Column(
        name=name,
        kind=spec["x-type"],
        role=spec["x-role"],
        required=name in required,
        nullable="null" in types if isinstance(types, list) else False,
        managed=bool(spec.get("x-managed")),
        primary_key=bool(spec.get("x-primaryKey")),
        min_length=spec.get("minLength"),
        max_length=spec.get("maxLength"),
        pattern=spec.get("pattern"),
        enum=tuple(spec["enum"]) if "enum" in spec else None,
        link=Link(link["tableId"], link["column"], link["alias"]) if link else None,
    )


def load_tables(schema_root: Path = SCHEMA_ROOT) -> dict[str, Table]:
    """Every stored table keyed by `schema.table`."""
    tables: dict[str, Table] = {}
    for path in sorted((schema_root / "database").glob("*.schema.json")):
        for definition in json.loads(path.read_text(encoding="utf-8"))["$defs"].values():
            required = set(definition["required"])
            seed = definition["x-seed"]
            tables[definition["x-table"]] = Table(
                id=definition["x-id"],
                code=definition["x-code"],
                qualified_name=definition["x-table"],
                primary_key=tuple(definition["x-primaryKey"]),
                unique_keys=tuple(tuple(key) for key in definition["x-uniqueKeys"]),
                natural_key=tuple(definition["x-naturalKey"]),
                seedable=bool(definition["x-seedable"]),
                seed=Seed(tuple(seed["columns"]), tuple(seed["required"]), tuple(seed["system"])),
                columns={name: _column(name, spec, required) for name, spec in definition["properties"].items()},
            )
    return tables


def table_cycle(tables: dict[str, Table], names: set[str] | None = None) -> list[str] | None:
    """The first cycle in the foreign-key graph among `names` (default: every table), ignoring self-references.

    A cycle means no load order exists without a two-pass load. The reference group has none.
    """
    by_id = {table.id: table.qualified_name for table in tables.values()}
    selected = names if names is not None else set(tables)
    edges = {
        name: sorted(
            {
                by_id[column.link.table_id]
                for column in tables[name].columns.values()
                if column.link and column.link.table_id in by_id and by_id[column.link.table_id] != name
            }
            & selected
        )
        for name in selected
    }
    state: dict[str, int] = {}
    path: list[str] = []

    def visit(name: str) -> list[str] | None:
        state[name] = 1
        path.append(name)
        for target in edges[name]:
            if state.get(target) == 1:
                return [*path[path.index(target) :], target]
            if state.get(target) is None and (found := visit(target)):
                return found
        path.pop()
        state[name] = 2
        return None

    for name in sorted(selected):
        if state.get(name) is None and (found := visit(name)):
            return found
    return None


def load_order(tables: dict[str, Table], names: set[str]) -> list[str]:
    """The tables in `names` ordered so every table comes after the tables it links to (self-links ignored)."""
    by_id = {table.id: table.qualified_name for table in tables.values()}
    remaining = set(names)
    ordered: list[str] = []
    while remaining:
        ready = sorted(
            name
            for name in remaining
            if not {
                by_id[c.link.table_id]
                for c in tables[name].columns.values()
                if c.link and c.link.table_id in by_id and by_id[c.link.table_id] not in (name, *ordered)
            }
            & remaining
        )
        if not ready:
            raise ValueError(f"foreign-key cycle among {sorted(remaining)}")
        ordered.extend(ready)
        remaining -= set(ready)
    return ordered
