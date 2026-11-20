"""One place the engine opens a PostgreSQL connection. Rows arrive as dicts and are parsed into generated row models."""

from __future__ import annotations

import psycopg
from psycopg.adapt import Loader
from psycopg.rows import DictRow, dict_row

type Connection = psycopg.Connection[DictRow]


class _JsonAsText(Loader):
    """jsonb columns arrive as their JSON text, which the generated row models declare as `str`."""

    def load(self, data: bytes | bytearray | memoryview) -> str:
        return bytes(data).decode()


def connect(url: str, *, autocommit: bool = False) -> Connection:
    if not url:
        raise ValueError("a database URL is required")
    connection = psycopg.connect(url, autocommit=autocommit, row_factory=dict_row)
    connection.adapters.register_loader("jsonb", _JsonAsText)
    return connection
