"""The database form of the name lookup: trigram similarity and edit distance over the names a table's dictionary declares.

The Python `NameIndex` and this query follow the same tiers (exact, similar by `pg_trgm`, near by `fuzzystrmatch`), so the lookup
built from seed CSVs can be replaced by one over the loaded tables without changing what a caller sees. Accents and case are
folded with `unaccent` and `lower` on both sides."""

from __future__ import annotations

from dataclasses import dataclass

from psycopg import sql

from mzizi_engine.persistence.postgres.connection import Connection
from mzizi_manifest.features.database.tables import Table
from mzizi_patterns.shared.contracts import LookupSource

TRIGRAM_FLOOR = 0.3  # the database returns a wide set; the tiers' own floors are applied by the caller


@dataclass(frozen=True)
class Stored:
    """The stored identifiers a lookup source resolves to."""

    names_table: tuple[str, str]
    text_column: str
    link_column: str
    target_table: tuple[str, str]
    kind_column: str = ""


@dataclass(frozen=True)
class SqlCandidate:
    code: str
    text: str
    similarity: float
    distance: int
    kind: str


def _split(qualified: str) -> tuple[str, str]:
    schema, _, table = qualified.partition(".")
    return schema, table


def resolve_source(source: LookupSource, tables: dict[str, Table]) -> Stored:
    """Map a seed-column lookup source to stored tables and columns (`feature_code` is stored as `feature_id`)."""
    names = tables[source.table]
    link = names.columns[names.stored_name(source.code)]
    assert link.link is not None, f"{source.table}.{source.code} is not a link column"
    target = next(t for t in tables.values() if t.id == link.link.table_id)
    kind = ""
    if source.kind:
        kind = target.stored_name(source.kind.column)
    return Stored(_split(names.qualified_name), source.text, link.name, _split(target.qualified_name), kind)


def candidates_sql(stored: Stored) -> sql.Composed:
    names = sql.Identifier(*stored.names_table)
    target = sql.Identifier(*stored.target_table)
    folded = sql.SQL("unaccent(lower(n.{}))").format(sql.Identifier(stored.text_column))
    kind = sql.SQL("coalesce(k.code, '')") if stored.kind_column else sql.SQL("''")
    join_kind = (
        sql.SQL("LEFT JOIN reference.values k ON k.id = t.{}").format(sql.Identifier(stored.kind_column))
        if stored.kind_column
        else sql.SQL("")
    )
    return sql.SQL(
        "SELECT t.code AS code, n.{text} AS text, similarity({folded}, %(q)s) AS similarity, "
        "levenshtein(left({folded}, 255), left(%(q)s, 255)) AS distance, {kind} AS kind "
        "FROM {names} n JOIN {target} t ON t.id = n.{link} {join_kind} "
        "WHERE {folded} %% %(q)s OR {folded} = %(q)s ORDER BY similarity DESC, distance ASC LIMIT %(limit)s"
    ).format(
        text=sql.Identifier(stored.text_column),
        folded=folded,
        kind=kind,
        names=names,
        target=target,
        link=sql.Identifier(stored.link_column),
        join_kind=join_kind,
    )


def similar(conn: Connection, stored: Stored, key: str, limit: int = 20) -> list[SqlCandidate]:
    """Records whose name is the key or similar to it, best first. `key` is the folded text (kind words already removed)."""
    with conn.cursor() as cursor:
        cursor.execute("SELECT set_limit(%s::real)", (TRIGRAM_FLOOR,))
        cursor.execute(candidates_sql(stored), {"q": key, "limit": limit})
        return [
            SqlCandidate(r["code"], r["text"], float(r["similarity"]), int(r["distance"]), r["kind"])
            for r in cursor.fetchall()
        ]
