"""A read-only view of the database for people: domains, tables, paged rows and curated data lists.

Everything runs in a read-only transaction with a statement timeout. Table and column names are never taken from the caller
as SQL text: they are checked against the catalogue first and then quoted as identifiers.
"""

from __future__ import annotations

import datetime
import decimal
import uuid
from pathlib import Path
from typing import Literal

import yaml
from psycopg import sql
from pydantic import BaseModel

from mzizi_engine.jsonvalue import JsonValue
from mzizi_engine.persistence.postgres.connection import Connection, connect

HIDDEN_SCHEMAS = ("pg_catalog", "information_schema", "public", "tiger", "tiger_data", "topology")
LONG_TYPES = ("geometry", "geography", "jsonb", "json", "bytea")
CELL_LIMIT = 300
MAX_LIMIT = 500
DATALISTS = Path(__file__).parent / "datalists"


class BrowseError(Exception):
    def __init__(self, status: int, message: str) -> None:
        super().__init__(message)
        self.status = status


class ColumnInfo(BaseModel):
    name: str
    type: str
    nullable: bool
    primary: bool


class TableInfo(BaseModel):
    name: str
    rows: int
    columns: int
    describe: str


class DomainInfo(BaseModel):
    domain: str
    tables: tuple[TableInfo, ...]


class TablePage(BaseModel):
    domain: str
    table: str
    columns: tuple[ColumnInfo, ...]
    rows: tuple[dict[str, JsonValue], ...]
    total: int
    limit: int
    offset: int
    order: str
    direction: Literal["asc", "desc"]
    search: str


class DataList(BaseModel):
    code: str
    domain: str
    title: str
    describe: str
    columns: tuple[str, ...]
    sql: str


class DataListPage(BaseModel):
    list: DataList
    rows: tuple[dict[str, JsonValue], ...]
    total: int
    limit: int
    offset: int


def _cell(value: object) -> JsonValue:
    match value:
        case None | bool() | int() | float() | str():
            return value if not isinstance(value, str) else value[:CELL_LIMIT]
        case decimal.Decimal():
            return float(value)
        case datetime.datetime() | datetime.date() | datetime.time():
            return value.isoformat()
        case uuid.UUID():
            return str(value)
        case bytes() | memoryview():
            return f"<{len(value)} bytes>"
        case dict() | list():
            return str(value)[:CELL_LIMIT]
        case _:
            return str(value)[:CELL_LIMIT]


def _row(row: dict[str, object]) -> dict[str, JsonValue]:
    return {key: _cell(value) for key, value in row.items()}


class Browser:
    def __init__(self, url: str | None) -> None:
        self.url = url

    def _open(self) -> Connection:
        if not self.url:
            raise BrowseError(503, "DATABASE_URL (the read-only role) is not configured")
        connection = connect(self.url)
        connection.execute("set transaction read only")
        connection.execute("set local statement_timeout = '8s'")
        return connection

    def domains(self) -> tuple[DomainInfo, ...]:
        with self._open() as db:
            found = db.execute(
                """select n.nspname as domain, c.relname as name, greatest(c.reltuples, 0)::bigint as estimate,
                          (select count(*) from pg_attribute a where a.attrelid = c.oid and a.attnum > 0 and not a.attisdropped) as columns,
                          coalesce(obj_description(c.oid), '') as describe
                   from pg_class c join pg_namespace n on n.oid = c.relnamespace
                   where c.relkind = 'r' and n.nspname <> all(%s) and n.nspname !~ '^pg_' order by 1, 2""",
                (list(HIDDEN_SCHEMAS),),
            ).fetchall()
            grouped: dict[str, list[TableInfo]] = {}
            for row in found:
                total = int(row["estimate"])
                if total <= 0:  # never analysed or empty: ask once so a small table is not reported as empty
                    query = sql.SQL("select count(*) as n from {}.{}").format(
                        sql.Identifier(row["domain"]), sql.Identifier(row["name"])
                    )
                    total = int(db.execute(query).fetchone()["n"])  # type: ignore[index]
                grouped.setdefault(row["domain"], []).append(
                    TableInfo(name=row["name"], rows=total, columns=int(row["columns"]), describe=row["describe"])
                )
        return tuple(DomainInfo(domain=domain, tables=tuple(tables)) for domain, tables in grouped.items())

    def _columns(self, db: Connection, domain: str, table: str) -> tuple[ColumnInfo, ...]:
        rows = db.execute(
            """select a.attname as name, format_type(a.atttypid, a.atttypmod) as type, not a.attnotnull as nullable,
                      coalesce(a.attnum = any(i.indkey), false) as primary
               from pg_attribute a join pg_class c on c.oid = a.attrelid join pg_namespace n on n.oid = c.relnamespace
               left join pg_index i on i.indrelid = c.oid and i.indisprimary
               where n.nspname = %s and c.relname = %s and c.relkind = 'r' and a.attnum > 0 and not a.attisdropped
               order by a.attnum""",
            (domain, table),
        ).fetchall()
        if not rows:
            raise BrowseError(404, f"no table {domain}.{table}")
        return tuple(ColumnInfo(**r) for r in rows)

    def table(
        self, domain: str, table: str, limit: int, offset: int, order: str, direction: str, search: str
    ) -> TablePage:
        limit = max(1, min(limit, MAX_LIMIT))
        with self._open() as db:
            columns = self._columns(db, domain, table)
            names = {c.name for c in columns}
            order_by = order if order in names else (next((c.name for c in columns if c.primary), columns[0].name))
            way = "desc" if direction == "desc" else "asc"
            select = [
                sql.SQL("left({}::text, %s) as {}").format(sql.Identifier(c.name), sql.Identifier(c.name))
                if c.type.split("(")[0] in LONG_TYPES
                else sql.Identifier(c.name)
                for c in columns
            ]
            args: list[object] = [CELL_LIMIT] * sum(c.type.split("(")[0] in LONG_TYPES for c in columns)
            target = sql.SQL("{}.{}").format(sql.Identifier(domain), sql.Identifier(table))
            where: sql.Composable = sql.SQL("")
            filter_args: list[object] = []
            if search.strip():
                where = sql.SQL(" where ") + sql.SQL(" or ").join(
                    sql.SQL("{}::text ilike %s").format(sql.Identifier(c.name))
                    for c in columns
                    if c.type.split("(")[0] not in LONG_TYPES
                )
                filter_args = [f"%{search.strip()}%"] * sum(c.type.split("(")[0] not in LONG_TYPES for c in columns)
            total = db.execute(sql.SQL("select count(*) as n from {}{}").format(target, where), filter_args).fetchone()
            query = sql.SQL("select {} from {}{} order by {} {} limit %s offset %s").format(
                sql.SQL(", ").join(select), target, where, sql.Identifier(order_by), sql.SQL(way)
            )
            rows = db.execute(query, [*args, *filter_args, limit, max(0, offset)]).fetchall()
        return TablePage(
            domain=domain,
            table=table,
            columns=columns,
            rows=tuple(_row(r) for r in rows),
            total=int(total["n"]) if total else 0,
            limit=limit,
            offset=max(0, offset),
            order=order_by,
            direction="desc" if way == "desc" else "asc",
            search=search,
        )

    # -- curated data lists --------------------------------------------------------------------------------------
    @staticmethod
    def lists() -> tuple[DataList, ...]:
        found: list[DataList] = []
        for path in sorted(DATALISTS.glob("*.yml")):
            document = yaml.safe_load(path.read_text(encoding="utf-8"))
            for item in document["lists"]:
                found.append(
                    DataList(
                        code=item["code"],
                        domain=document["domain"],
                        title=item["title"],
                        describe=item["describe"],
                        columns=tuple(item["columns"]),
                        sql=item["sql"].strip(),
                    )
                )
        return tuple(found)

    def datalist(self, domain: str, code: str, limit: int, offset: int) -> DataListPage:
        spec = next((d for d in self.lists() if d.domain == domain and d.code == code), None)
        if spec is None:
            raise BrowseError(404, f"no data list {domain}/{code}")
        limit = max(1, min(limit, MAX_LIMIT))
        with self._open() as db:
            total = db.execute(f"select count(*) as n from ({spec.sql}) as q").fetchone()
            rows = db.execute(f"select * from ({spec.sql}) as q limit %s offset %s", (limit, max(0, offset))).fetchall()
        return DataListPage(
            list=spec,
            rows=tuple(_row(r) for r in rows),
            total=int(total["n"]) if total else 0,
            limit=limit,
            offset=max(0, offset),
        )
