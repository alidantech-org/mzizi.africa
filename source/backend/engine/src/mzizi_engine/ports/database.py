"""The database port: what the engine's filesystem module needs from a connection.

No package may know a database exists (`.docs/rules/typed-code.md`); the engine is the only place that does. This
module is that one place for the engine too: `Connection` and `Cursor` are left open as a `Protocol` so the concrete
connection can change (today: psycopg against PostgreSQL; later: a client of the Rust database service) without the
filesystem modules that depend on this port changing at all.

`Row` is `Mapping[str, Any]` because a database row is the one genuinely dynamic shape at this boundary (its columns
come from whatever query ran); this module is the parsing boundary for that dynamism, not a place it should spread
from. Callers past this module work with named fields, never a bare row.
"""

from __future__ import annotations

import os
from collections.abc import Mapping, Sequence
from contextlib import AbstractContextManager
from types import TracebackType
from typing import Any, Protocol, Self, cast

type Row = Mapping[str, Any]
type Params = Sequence[Any] | Mapping[str, Any] | None

#: The disposable rewrite database this port talks to until it moves behind the Rust database service.
DEFAULT_REWRITE_URL = "postgres://postgres@localhost:5432/mzizi_new"


class Cursor(Protocol):
    rowcount: int

    def fetchone(self) -> Row | None: ...
    def fetchall(self) -> list[Row]: ...


class Connection(Protocol):
    def execute(self, query: str, params: Params = None) -> Cursor: ...
    def transaction(
        self, savepoint_name: str | None = None, *, force_rollback: bool = False
    ) -> AbstractContextManager[object]: ...
    def close(self) -> None: ...
    def __enter__(self) -> Self: ...
    def __exit__(
        self, exc_type: type[BaseException] | None, exc: BaseException | None, traceback: TracebackType | None
    ) -> None: ...


class RequiredRowMissing(LookupError):
    """A query that must return a row returned none."""


def required(row: Row | None) -> Row:
    """The row, or raises when a lookup the caller has already established must exist comes back empty."""
    if row is None:
        raise RequiredRowMissing("expected a row but none was found")
    return row


def rewrite_url() -> str:
    """The connection URL for the disposable rewrite database (`REWRITE_DATABASE_URL`, default: local `mzizi_new`)."""
    return os.environ.get("REWRITE_DATABASE_URL") or DEFAULT_REWRITE_URL


def connect(url: str | None, *, autocommit: bool = False) -> Connection:
    """The psycopg adapter for this port. A missing URL is refused the same way a missing configuration always is.

    psycopg's own `execute` is overloaded with extra keyword-only parameters we never pass, which mypy cannot match
    against this Protocol structurally; the `cast` states what every caller of this port already relies on.
    """
    if not url:
        raise ValueError("a database URL is required")
    import psycopg
    from psycopg.rows import dict_row

    connection = psycopg.connect(url, autocommit=autocommit, row_factory=dict_row)
    return cast(Connection, connection)
