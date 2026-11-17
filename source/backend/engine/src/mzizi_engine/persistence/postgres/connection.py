"""One place the engine opens a PostgreSQL connection. Rows arrive as dicts and are parsed into generated row models."""

from __future__ import annotations

import psycopg
from psycopg.rows import DictRow, dict_row

type Connection = psycopg.Connection[DictRow]


def connect(url: str, *, autocommit: bool = False) -> Connection:
    if not url:
        raise ValueError("a database URL is required")
    return psycopg.connect(url, autocommit=autocommit, row_factory=dict_row) # type: ignore
