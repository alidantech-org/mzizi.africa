"""Check column dictionaries against the term lists and the database schema.

A dictionary (`sys.col.<scope>.<domain>`) says which term groups, patterns and heading rules define each database
column. This module checks that every link points at a key that exists in the named list (or a list it extends) and that
every column is a seed column of the generated table schemas: a link is its `_code` column, never an id. Code and scope rules are in `registry.py`."""

from __future__ import annotations

from pathlib import Path

from mzizi_manifest.features.database.tables import Table, load_tables
from mzizi_manifest.features.registry.scan import _documents

ROLES = {"heading", "value", "unit", "member", "exclude"}


def _keys(document: dict) -> set[str]:
    keys: set[str] = set()
    for field, name in (("groups", "group"), ("patterns", "pattern"), ("heading_rules", "rule")):
        for item in document.get(field) or []:
            if isinstance(item, dict) and isinstance(item.get(name), str):
                keys.add(item[name])
    return keys


def _available(code: str, lists: dict[str, dict]) -> set[str]:
    """Keys defined by a list and every list it extends."""
    keys: set[str] = set()
    seen: set[str] = set()
    stack = [code]
    while stack:
        current = stack.pop()
        if current in seen or current not in lists:
            continue
        seen.add(current)
        keys |= _keys(lists[current])
        stack.extend(p for p in lists[current].get("extends") or [] if isinstance(p, str))
    return keys


PART_COLUMNS = ("slug", "name_slug", "code", "last", "value", "kind", "qualifier")


def _seed_column(ref: str, tables: dict[str, Table]) -> bool:
    schema_table, _, name = ref.rpartition(".")
    table = tables.get(schema_table)
    return table is not None and name in table.seed.columns


def _table_problems(where: str, name: str, spec: dict, tables: dict[str, Table]) -> list[str]:
    problems: list[str] = []
    table = tables.get(name)
    if table is None:
        return [f"{where}: tables.{name}: not a database table"]
    recipe = spec.get("code")
    if recipe is not None:
        if table.natural_key != ("code",):
            problems.append(f"{where}: tables.{name}: has no `code` natural key, so no code recipe applies")
        for index, part in enumerate(recipe.get("parts") or []):
            for field in PART_COLUMNS:
                ref = part.get(field)
                if ref and not ref.startswith("input:") and not _seed_column(ref, tables):
                    problems.append(f"{where}: tables.{name}.code.parts[{index}].{field}: {ref!r} is not a seed column")
        for ref in recipe.get("unique_within") or []:
            if not _seed_column(ref, tables):
                problems.append(f"{where}: tables.{name}.code.unique_within: {ref!r} is not a seed column")
    for index, source in enumerate((spec.get("lookup") or {}).get("sources") or []):
        source_table = tables.get(source.get("table", ""))
        if source_table is None:
            problems.append(f"{where}: tables.{name}.lookup.sources[{index}]: unknown table {source.get('table')!r}")
            continue
        for field in ("text", "code", "language"):
            column = source.get(field)
            if column and column not in source_table.seed.columns:
                problems.append(
                    f"{where}: tables.{name}.lookup.sources[{index}].{field}: {column!r} is not a seed column of {source['table']}"
                )
        kind = source.get("kind")
        if kind:
            kind_table = tables.get(kind.get("table", ""))
            if kind_table is None or not {kind.get("key"), kind.get("column")} <= set(kind_table.seed.columns):
                problems.append(
                    f"{where}: tables.{name}.lookup.sources[{index}].kind: not columns of {kind.get('table')!r}"
                )
    return problems


def column_problems(root: Path, tables: dict[str, Table] | None = None) -> list[str]:
    tables = tables if tables is not None else load_tables()
    documents = _documents(root)
    lists = {d["code"]: d for _, d in documents if str(d.get("code", "")).startswith("sys.trm.")}
    problems: list[str] = []
    for path, document in documents:
        if not str(document.get("code", "")).startswith("sys.col."):
            continue
        for name, spec in sorted((document.get("tables") or {}).items()):
            problems += _table_problems(str(path), name, spec or {}, tables)
        for column, entry in sorted((document.get("columns") or {}).items()):
            where = f"{path}: {column}"
            schema_table, _, name = column.rpartition(".")
            table = tables.get(schema_table)
            if name == "id" or name.endswith("_id"):
                problems.append(f"{where}: a dictionary names seed columns; use the _code column, never an id")
            elif table is None or name not in table.seed.columns:
                problems.append(f"{where}: not a seed column of that table (links are written <name>_code)")
            for index, link in enumerate((entry or {}).get("terms") or []):
                code, key, role = link.get("list"), link.get("key"), link.get("role")
                if code not in lists:
                    problems.append(f"{where}: terms[{index}]: unknown term list {code!r}")
                elif key not in _available(code, lists):
                    problems.append(f"{where}: terms[{index}]: {code} has no group, pattern or heading rule {key!r}")
                if role not in ROLES:
                    problems.append(f"{where}: terms[{index}]: role {role!r} must be one of {sorted(ROLES)}")
    return problems
