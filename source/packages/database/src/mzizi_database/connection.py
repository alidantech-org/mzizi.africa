"""Safe connections and transactions. Only mzizi and mzizi_* databases are ever touched."""

from __future__ import annotations

import os
from collections.abc import Iterator
from contextlib import contextmanager
from typing import Any
from urllib.parse import urlparse

import psycopg
from psycopg.rows import dict_row

REWRITE_DATABASE = "mzizi_new"
LOCAL_HOSTS = ("localhost", "127.0.0.1", "::1", "[::1]")
DEFAULT_REWRITE_URL = "postgres://postgres@localhost:5432/mzizi_new"

type Row = dict[str, Any]
"""One result row: every connection made here uses psycopg's `dict_row` factory."""

type Connection = psycopg.Connection[Row]
"""A connection whose cursors return `Row` dictionaries."""


class DatabaseSafetyError(RuntimeError):
    """Raised instead of touching a database, host or session this tooling does not manage."""


def required(row: Row | None) -> Row:
    """Return a row that must exist (an aggregate, or a row the caller just wrote); raise LookupError otherwise."""
    if row is None:
        raise LookupError("the query returned no row")
    return row


def database_name(url: str) -> str:
    return urlparse(url).path.lstrip("/")


def connect(url: str | None = None, autocommit: bool = False) -> Connection:
    url = url or os.environ.get("DATABASE_URL")
    if not url:
        raise DatabaseSafetyError("DATABASE_URL is required")
    name = database_name(url)
    if name != "mzizi" and not name.startswith("mzizi_"):
        raise DatabaseSafetyError(f"refusing to touch {name}: only mzizi and mzizi_* databases are managed here")
    return psycopg.connect(url, row_factory=dict_row, autocommit=autocommit)


@contextmanager
def transaction(conn: Connection) -> Iterator[Connection]:
    """Commit on success, roll back on any exception."""
    with conn.transaction():
        yield conn


def rewrite_url() -> str:
    """The URL of the rewrite database: REWRITE_DATABASE_URL, else the local default. Must be exactly mzizi_new on a local host."""
    url = os.environ.get("REWRITE_DATABASE_URL", DEFAULT_REWRITE_URL)
    parsed = urlparse(url)
    if database_name(url) != REWRITE_DATABASE:
        raise DatabaseSafetyError(f"this tooling manages only {REWRITE_DATABASE}, not {database_name(url)}")
    if parsed.hostname not in LOCAL_HOSTS:
        raise DatabaseSafetyError(f"refusing the rewrite database on a non-local host: {parsed.hostname}")
    return url


def assert_rewrite_session(conn: Connection) -> None:
    """Verifies the session is really on mzizi_new before any destructive or schema-changing work."""
    current = required(conn.execute("SELECT current_database() AS db").fetchone())["db"]
    if current != REWRITE_DATABASE:
        raise DatabaseSafetyError(f"connected to {current}, expected {REWRITE_DATABASE}")
