"""Database access for the data engine. Only mzizi_* databases are ever touched."""
from __future__ import annotations

import os
from urllib.parse import urlparse

import psycopg
from psycopg.rows import dict_row


def connect(url: str | None = None) -> psycopg.Connection:
    url = url or os.environ.get("DATABASE_URL")
    if not url:
        raise RuntimeError("DATABASE_URL is required")
    database = urlparse(url).path.lstrip("/")
    if not database.startswith("mzizi_"):
        raise RuntimeError(f"refusing to touch {database}: only mzizi_* databases are managed here")
    return psycopg.connect(url, row_factory=dict_row)
