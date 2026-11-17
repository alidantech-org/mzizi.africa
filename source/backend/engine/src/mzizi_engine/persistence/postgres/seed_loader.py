"""Load the seed CSVs into PostgreSQL, and be safe to run again and again.

What it does, in the order it does it:

1. Checks every CSV with `mzizi_manifest.features.data.check.check_data`. Any problem stops the run before a write.
2. Turns each row into a stored row. The id is derived from the table and the natural key, so a row has the same id every run;
   a link is written as the target's id, derived the same way, so the loader never has to look an id up.
3. Upserts each table in load order with `INSERT ... ON CONFLICT (id) DO UPDATE`, changing a row only when a seeded column
   really differs (`IS DISTINCT FROM`), so a run with no edits writes nothing, a small edit changes only that row, and the
   row's `version` and `updated_at` move only then.
4. Writes the provenance of every seeded record as a `source.relationships` row (the record, prepared from the exact CSV
   artifact) with one `source.citations` row for the CSV line. The artifact is named by the file's content hash, so a later
   edit of the CSV never makes earlier provenance point at the new bytes.
5. Reports, per table, rows inserted, updated, unchanged and rows present in the database that no seed file names. It never
   deletes: a row that left the seed is reported, and removing it is a separate decision.

A dry run (the default) does the same work inside a transaction and rolls it back, so its counts are exact. Columns a seed does
not mention are left alone, so a new column added to a table changes nothing until a CSV mentions it; a column removed from the
schema is rejected by the check until the CSV is fixed.
"""

from __future__ import annotations

import hashlib
import json
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import UTC, datetime
from pathlib import Path
from uuid import UUID

from psycopg import sql

from mzizi_engine.persistence.postgres.connection import Connection
from mzizi_manifest.features.codes.glossary import Glossary, load_glossary
from mzizi_manifest.features.codes.grammar import stored_code
from mzizi_manifest.features.data.check import Row, check_data
from mzizi_manifest.features.data.datasets import artifact_code, is_catalogue
from mzizi_manifest.features.database.tables import SUBJECT_ALIAS, Table, load_tables
from mzizi_manifest.features.seeds.ids import stable_id
from mzizi_manifest.shared.paths import SCHEMA_ROOT

type Cell = str | int | None

RELATIONSHIPS = "source.relationships"
CITATIONS = "source.citations"
ARTIFACTS = "source.artifacts"
VALUES = "reference.values"
#: Reference values the provenance rows use: the kind of connection and of locator.
PREPARED_FROM = "src.relationship.kind.prepared-from"
CSV_LINE = "src.locator.kind.csv-line"


@dataclass(frozen=True)
class DesiredRow:
    id: UUID
    values: dict[str, Cell]
    #: The ids of rows in the same table this row points at (self-links), which must be written first.
    needs: frozenset[UUID] = frozenset()


@dataclass
class TableReport:
    table: str
    inserted: int = 0
    updated: int = 0
    unchanged: int = 0
    #: Rows in the table that no seed names (never deleted).
    absent: int = 0


@dataclass
class SeedReport:
    applied: bool
    problems: list[str] = field(default_factory=list)
    tables: list[TableReport] = field(default_factory=list)

    @property
    def ok(self) -> bool:
        return not self.problems

    @property
    def changed(self) -> bool:
        return any(t.inserted or t.updated for t in self.tables)


def identity_path(table: Table, row: Row) -> str:
    """The row's identity: the `code` cell, or the natural key cells joined by `|` for a table with no code."""
    if table.natural_key == ("code",):
        return row.values["code"]
    return "|".join(row.values.get(name, "") for name in table.natural_key)


def row_id(table: Table, row: Row) -> UUID:
    return stable_id(table.qualified_name, identity_path(table, row))


def _cell(value: str) -> Cell:
    return value if value != "" else None


def _desired(
    table: Table,
    row: Row,
    tables_by_id: dict[str, Table],
    glossary: Glossary,
) -> DesiredRow:
    values: dict[str, Cell] = {}
    needs: set[UUID] = set()
    own_id = row_id(table, row)
    for name, raw in row.values.items():
        stored = table.stored_name(name)
        column = table.columns.get(stored)
        if column is None:
            continue
        if name == SUBJECT_ALIAS and table.has_subject:
            values["subject_id"] = str(stable_id(row.values.get("subject_table", ""), raw)) if raw else None
        elif column.link is not None:
            target = tables_by_id[column.link.table_id]
            if raw == "":
                values[stored] = None
                continue
            target_id = stable_id(target.qualified_name, raw)
            values[stored] = str(target_id)
            if target.qualified_name == table.qualified_name and target_id != own_id:
                needs.add(target_id)
        elif name == "code" and column.kind == "text":
            values[stored] = stored_code(glossary.tables[table.qualified_name], raw)
        else:
            values[stored] = _cell(raw)
    return DesiredRow(own_id, values, frozenset(needs))


def _ordered(rows: list[DesiredRow]) -> list[DesiredRow]:
    """Rows that other rows of the same table point at come first."""
    present = {r.id for r in rows}
    placed: set[UUID] = set()
    out: list[DesiredRow] = []
    pending = rows
    while pending:
        later: list[DesiredRow] = []
        for item in pending:
            if all(n in placed or n not in present for n in item.needs):
                out.append(item)
                placed.add(item.id)
            else:
                later.append(item)
        if len(later) == len(pending):
            out.extend(later)  # a cycle among rows; the check forbids it, the database will say so
            break
        pending = later
    return out


def _upsert(conn: Connection, table: Table, rows: list[DesiredRow], report: TableReport) -> None:
    if not rows:
        return
    schema, name = table.qualified_name.split(".", 1)
    present = set(table.columns)
    system = [c for c in ("version", "created_at", "updated_at") if c in present]
    data_columns = sorted({c for r in rows for c in r.values} - {"id"})
    all_columns = ["id", *data_columns, *system]
    target = sql.SQL("{}.{}").format(sql.Identifier(schema), sql.Identifier(name))
    placeholders = []
    for c in all_columns:
        if c == "version":
            placeholders.append(sql.SQL("1"))
        elif c in ("created_at", "updated_at"):
            placeholders.append(sql.SQL("now()"))
        else:
            placeholders.append(sql.SQL("%s"))
    differs = sql.SQL(" OR ").join(
        sql.SQL("t.{c} IS DISTINCT FROM EXCLUDED.{c}").format(c=sql.Identifier(c)) for c in data_columns
    )
    updates = [sql.SQL("{c} = EXCLUDED.{c}").format(c=sql.Identifier(c)) for c in data_columns]
    if "version" in present:
        updates.append(sql.SQL("version = t.version + 1"))  # type: ignore
    if "updated_at" in present:
        updates.append(sql.SQL("updated_at = now()"))  # type: ignore
    if data_columns:
        statement = sql.SQL(
            "INSERT INTO {target} AS t ({cols}) VALUES ({vals}) ON CONFLICT (id) DO UPDATE SET {sets} WHERE {differs} "
            "RETURNING (xmax = 0) AS inserted"
        ).format(
            target=target,
            cols=sql.SQL(", ").join(sql.Identifier(c) for c in all_columns),
            vals=sql.SQL(", ").join(placeholders),
            sets=sql.SQL(", ").join(updates),
            differs=differs,
        )
    else:
        statement = sql.SQL(
            "INSERT INTO {target} AS t ({cols}) VALUES ({vals}) ON CONFLICT (id) DO NOTHING RETURNING true AS inserted"
        ).format(
            target=target,
            cols=sql.SQL(", ").join(sql.Identifier(c) for c in all_columns),
            vals=sql.SQL(", ").join(placeholders),
        )
    params_columns = [c for c in all_columns if c not in ("version", "created_at", "updated_at")]
    with conn.cursor() as cursor:
        for item in rows:
            params = [str(item.id) if c == "id" else item.values.get(c) for c in params_columns]
            cursor.execute(statement, params)
            result = cursor.fetchone()
            if result is None:
                report.unchanged += 1
            elif result["inserted"]:
                report.inserted += 1
            else:
                report.updated += 1
        cursor.execute(
            sql.SQL("SELECT count(*) AS n FROM {target} WHERE id <> ALL(%s::uuid[])").format(target=target),
            [[str(r.id) for r in rows]],
        )
        found = cursor.fetchone()
        report.absent = int(found["n"]) if found else 0


def load_seed(conn: Connection, seed_root: Path, *, apply: bool, schema_root: Path = SCHEMA_ROOT) -> SeedReport:
    """Load every seed CSV under `seed_root`. With `apply` false the work is done and rolled back."""
    report = SeedReport(applied=apply)
    checked = check_data(seed_root, schema_root)
    if checked.problems:
        report.problems = list(checked.problems)
        return report
    tables = load_tables(schema_root)
    by_id = {t.id: t for t in tables.values()}
    glossary = load_glossary(schema_root)
    desired: dict[str, list[DesiredRow]] = {}
    relationships: list[DesiredRow] = []
    citations: list[DesiredRow] = []
    codes = glossary.tables
    artifacts: dict[Path, str] = {}
    for name in checked.order:
        table = tables[name]
        rows = [_desired(table, row, by_id, glossary) for row in checked.rows[name]]
        desired[name] = _ordered(rows)
        for row, item in zip(checked.rows[name], rows, strict=True):
            if is_catalogue(seed_root, row.file):
                continue
            artifact = artifacts.setdefault(row.file, artifact_code(seed_root, row.file))
            digest = hashlib.sha256(f"{name}|{item.id}|{artifact}|{row.line}".encode()).hexdigest()[:16]
            path = f"p-{digest}"
            relationship_id = stable_id(RELATIONSHIPS, path)
            relationships.append(
                DesiredRow(
                    relationship_id,
                    {
                        "code": stored_code(codes[RELATIONSHIPS], path),
                        "kind_id": str(stable_id(VALUES, PREPARED_FROM)),
                        "subject_table": name,
                        "subject_id": str(item.id),
                        "input_artifact_id": str(stable_id(ARTIFACTS, artifact)),
                        "method": "Loaded from the seed CSV row.",
                    },
                )
            )
            citations.append(
                DesiredRow(
                    stable_id(CITATIONS, path),
                    {
                        "code": stored_code(codes[CITATIONS], path),
                        "artifact_id": str(stable_id(ARTIFACTS, artifact)),
                        "subject_table": RELATIONSHIPS,
                        "subject_id": str(relationship_id),
                        "locator_kind_id": str(stable_id(VALUES, CSV_LINE)),
                        "locator": json.dumps({"line": row.line}, sort_keys=True),
                        "recorded_at": datetime.fromtimestamp(row.file.stat().st_mtime, UTC).isoformat(),
                    },
                )
            )
    try:
        for name in checked.order:
            table_report = TableReport(name)
            _upsert(conn, tables[name], desired[name], table_report)
            report.tables.append(table_report)
        if ARTIFACTS in desired:
            for table_name, rows in ((RELATIONSHIPS, relationships), (CITATIONS, citations)):
                provenance_report = TableReport(table_name)
                _upsert(conn, tables[table_name], rows, provenance_report)
                report.tables.append(provenance_report)
    except Exception:
        conn.rollback()
        raise
    if apply:
        conn.commit()
    else:
        conn.rollback()
    return report


def summarise(report: SeedReport) -> str:
    """A readable run report."""
    lines = [f"{'applied' if report.applied else 'dry run (rolled back)'}"]
    totals: defaultdict[str, int] = defaultdict(int)
    for t in report.tables:
        lines.append(
            f"{t.table:34} +{t.inserted:<6} ~{t.updated:<5} ={t.unchanged:<6}"
            + (f" not in seed: {t.absent}" if t.absent else "")
        )
        totals["inserted"] += t.inserted
        totals["updated"] += t.updated
        totals["unchanged"] += t.unchanged
    lines.append(f"total: {totals['inserted']} inserted, {totals['updated']} updated, {totals['unchanged']} unchanged")
    return "\n".join(lines)
