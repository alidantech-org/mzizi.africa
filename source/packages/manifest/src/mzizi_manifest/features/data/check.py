"""Check seed CSV files against the generated database schemas, before anything is written to a database.

A file `data/<scope>/<domain>/<table>.csv` holds the rows of `<domain>.<table>`. A row is written in the seed view of the
table: its natural key (`code`), its data, and links written as the target's code (`scheme_code`). It never carries ids or
system fields (`version`, `created_at`, `updated_at`, `deleted_at`); the loader assigns them, deriving the id from the
table and the code (`mzizi_manifest.features.seeds.ids.stable_id`).

Checked: the path names a seedable table; the header holds only allowed columns and every required one; each value fits
its column (kind, length, pattern, enum); natural keys and other unique keys are unique across all files of a table; every
link names a row that exists in the files being checked; the links form a load order (no cycle between tables, none among
the rows of a self-link such as `supersedes_code`).
"""

from __future__ import annotations

import csv
import re
from dataclasses import dataclass, field
from datetime import date, datetime, time
from decimal import Decimal, InvalidOperation
from pathlib import Path

from mzizi_manifest.features.codes.glossary import load_glossary
from mzizi_manifest.features.codes.grammar import (
    MAX_LENGTH,
    member_path_problem,
    scheme_path_problem,
    segments_problem,
    stored_code,
)
from mzizi_manifest.features.database.tables import Column, Table, load_order, load_tables, table_cycle
from mzizi_manifest.shared.paths import SCHEMA_ROOT

SCOPE = re.compile(r"^(global|[a-z]{2,3})$")
UUID = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")


@dataclass(frozen=True)
class Row:
    file: Path
    line: int
    values: dict[str, str]


@dataclass
class DataResult:
    problems: list[str] = field(default_factory=list)
    #: Rows by `schema.table`, in file order.
    rows: dict[str, list[Row]] = field(default_factory=dict)
    #: The order tables must be loaded in.
    order: list[str] = field(default_factory=list)


def _value_problem(column: Column, value: str) -> str | None:
    """Why `value` does not fit `column`, or None."""
    if column.enum is not None and value not in column.enum:
        return f"{value!r} is not one of {', '.join(column.enum)}"
    kind = column.kind
    try:
        if kind == "uuid" and not UUID.match(value):
            return f"{value!r} is not a UUID"
        if kind == "boolean" and value not in ("true", "false"):
            return f"{value!r} is not true or false"
        if kind == "integer":
            int(value)
        if kind in ("decimal", "number"):
            Decimal(value)
        if kind == "date":
            date.fromisoformat(value)
        if kind == "time":
            time.fromisoformat(value)
        if kind == "timestamp":
            datetime.fromisoformat(value.replace("Z", "+00:00"))
    except (ValueError, InvalidOperation):
        return f"{value!r} is not a valid {kind}"
    if kind == "text":
        if column.min_length is not None and len(value) < column.min_length:
            return f"{value!r} is shorter than {column.min_length}"
        if column.max_length is not None and len(value) > column.max_length:
            return f"{value!r} is longer than {column.max_length}"
        if column.pattern is not None and not re.search(column.pattern, value):
            return f"{value!r} does not match {column.pattern}"
    return None


def _table_for(path: Path, root: Path, tables: dict[str, Table]) -> tuple[Table | None, str | None]:
    parts = path.relative_to(root).parts
    if len(parts) != 4 or parts[0] != "data":
        return None, "a CSV must be data/<scope>/<domain>/<table>.csv"
    _, scope, domain, name = parts
    if not SCOPE.match(scope):
        return None, f"scope {scope!r} must be 'global' or a country code"
    table = tables.get(f"{domain}.{Path(name).stem}")
    if table is None:
        return None, f"{domain}.{Path(name).stem} is not a stored table"
    if not table.seedable:
        return None, f"{table.qualified_name} has no natural key, so it cannot be seeded by CSV"
    return table, None


def _read(path: Path, table: Table, shown: str, problems: list[str]) -> list[Row]:
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.reader(handle)
        header = next(reader, None)
        if header is None:
            problems.append(f"{shown}: the file is empty")
            return []
        allowed, required = set(table.seed.columns), set(table.seed.required)
        for name in header:
            if name in table.seed.system:
                problems.append(f"{shown}: {name!r} is filled by the system and must not be in a seed file")
            elif name not in allowed:
                problems.append(f"{shown}: unknown column {name!r} (allowed: {', '.join(table.seed.columns)})")
        if len(set(header)) != len(header):
            problems.append(f"{shown}: a column is listed twice")
        for name in sorted(required - set(header)):
            problems.append(f"{shown}: missing required column {name!r}")
        rows = []
        for number, record in enumerate(reader, start=2):
            if not any(cell.strip() for cell in record):
                continue
            if len(record) != len(header):
                problems.append(f"{shown}:{number}: {len(record)} values for {len(header)} columns")
                continue
            rows.append(Row(path, number, dict(zip(header, record, strict=True))))
        return rows


def _columns_by_seed_name(table: Table) -> dict[str, Column]:
    return {(column.link.alias if column.link else column.name): column for column in table.columns.values()}


def check_data(root: Path, schema_root: Path = SCHEMA_ROOT) -> DataResult:
    """Check every CSV under `root/data` and return the problems, the rows and the load order.

    A `code` cell and a link cell hold the identity path alone (`ke`, `geo.continent.africa`): the file and the link column
    already say which table. The stored code is `<schema short>.<table short>.<path>` (`ref.cty.ke`).
    """
    tables = load_tables(schema_root)
    glossary = load_glossary(schema_root)
    by_id = {table.id: table for table in tables.values()}
    result = DataResult()
    files = sorted((root / "data").rglob("*.csv")) if (root / "data").is_dir() else []
    for path in files:
        shown = str(path.relative_to(root))
        table, why = _table_for(path, root, tables)
        if table is None:
            result.problems.append(f"{shown}: {why}")
            continue
        result.rows.setdefault(table.qualified_name, []).extend(_read(path, table, shown, result.problems))

    # Values and uniqueness.
    keys: dict[str, dict[tuple[str, ...], Row]] = {}
    for name, rows in result.rows.items():
        table = tables[name]
        columns = _columns_by_seed_name(table)
        required = set(table.seed.required)
        natural = table.natural_key
        seen: dict[tuple[str, ...], Row] = {}
        unique = [key for key in table.unique_keys if all(k in columns and not columns[k].link for k in key)]
        seen_unique: dict[tuple[str, ...], dict[tuple[str, ...], Row]] = {key: {} for key in unique}
        for row in rows:
            where = f"{row.file.relative_to(root)}:{row.line}"
            for seed_name, value in row.values.items():
                column = columns.get(seed_name)
                if column is None:
                    continue
                if value == "":
                    if seed_name in required:
                        result.problems.append(f"{where}: {seed_name} is required")
                    continue
                if (problem := _value_problem(column, value)) and not column.link:
                    result.problems.append(f"{where}: {seed_name}: {problem}")
            identity = row.values.get("code", "")
            tcode = glossary.tables.get(name)
            if identity and tcode is None:
                result.problems.append(f"{where}: {name} has no short name in seed/codes.json")
            elif identity and tcode is not None:
                reason = segments_problem(identity)
                if reason is None and len(stored_code(tcode, identity)) > MAX_LENGTH:
                    reason = f"the stored code would be longer than {MAX_LENGTH}"
                if reason is None and tcode.kind == "scheme":
                    reason = scheme_path_problem(identity, glossary)
                if reason is None and tcode.kind == "member":
                    parent_path = row.values.get(tcode.parent or "", "")
                    reason = member_path_problem(identity, parent_path) if parent_path else None
                if reason:
                    result.problems.append(f"{where}: code {identity!r} {reason}")
            key = tuple(row.values.get(k, "") for k in natural)
            if all(key):
                if key in seen:
                    first = seen[key]
                    result.problems.append(
                        f"{where}: duplicate {'/'.join(natural)} {key[0]!r}, first at {first.file.relative_to(root)}:{first.line}"
                    )
                seen[key] = row
            for unique_key, found in seen_unique.items():
                value_key = tuple(row.values.get(k, "") for k in unique_key)
                if all(value_key):
                    if value_key in found:
                        result.problems.append(f"{where}: duplicate {'/'.join(unique_key)} {value_key[0]!r}")
                    found[value_key] = row
        keys[name] = seen

    # Links.
    edges: dict[str, set[str]] = {name: set() for name in result.rows}
    for name, rows in result.rows.items():
        table = tables[name]
        for column in table.columns.values():
            if column.link is None:
                continue
            target = by_id.get(column.link.table_id)
            alias = column.link.alias
            if target is None:
                continue
            for row in rows:
                value = row.values.get(alias, "")
                if not value:
                    continue
                where = f"{row.file.relative_to(root)}:{row.line}"
                if target.natural_key != ("code",):
                    result.problems.append(f"{where}: {alias}: {target.qualified_name} cannot be linked by code")
                    break
                if target.qualified_name not in result.rows:
                    result.problems.append(
                        f"{where}: {alias}: {value!r} is a {target.qualified_name} code but that table has no seed file"
                    )
                    continue
                if reason := segments_problem(value):
                    result.problems.append(f"{where}: {alias} {value!r} {reason}")
                    continue
                if (value,) not in keys.get(target.qualified_name, {}):
                    result.problems.append(f"{where}: {alias}: unknown {target.qualified_name} code {value!r}")
                if target.qualified_name != name:
                    edges[name].add(target.qualified_name)

    names = set(result.rows)
    if (cycle := table_cycle(tables, names)) is not None:
        result.problems.append(f"the tables link in a cycle: {' -> '.join(cycle)}")
    else:
        result.order = load_order(tables, names)

    # Self-links: following them from any row must never come back to it.
    for name, rows in result.rows.items():
        for column in tables[name].columns.values():
            if column.link is None or by_id.get(column.link.table_id) is not tables[name]:
                continue
            parent = {r.values.get("code", ""): r.values.get(column.link.alias, "") for r in rows}
            for start in parent:
                seen_codes = {start}
                current = parent.get(start, "")
                while current:
                    if current in seen_codes:
                        result.problems.append(f"{name}: {column.link.alias} cycle through {start!r}")
                        break
                    seen_codes.add(current)
                    current = parent.get(current, "")
                else:
                    continue
                break
    return result
