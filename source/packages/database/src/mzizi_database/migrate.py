"""Apply ordered SQL files with checksums (public.migrations) to the rewrite database; verified reset of that database only."""

from __future__ import annotations

import hashlib
from pathlib import Path

import psycopg
import yaml

from .connection import REWRITE_DATABASE, DatabaseSafetyError, assert_rewrite_session, connect, rewrite_url


def schema_root() -> Path:
    import os

    return (
        Path(os.environ.get("MZIZI_SCHEMA_ROOT") or Path(__file__).resolve().parents[5] / "source" / "schema")
        / "database"
    )


def migration_files(root: Path | None = None) -> list[tuple[str, str, str]]:
    """(name, sql, sha256) in the order listed by migrations.yaml."""
    base = root or schema_root()
    names = yaml.safe_load((base / "migrations.yaml").read_text(encoding="utf-8"))["migrations"]
    out = []
    for name in names:
        sql = (base / name).read_text(encoding="utf-8")
        out.append((name, sql, hashlib.sha256(sql.encode()).hexdigest()))
    return out


def _admin_url(url: str) -> str:
    from urllib.parse import urlparse, urlunparse

    return urlunparse(urlparse(url)._replace(path="/postgres"))


def ensure_database(url: str | None = None) -> None:
    url = url or rewrite_url()
    with psycopg.connect(_admin_url(url), autocommit=True) as admin:
        if not admin.execute("SELECT 1 FROM pg_database WHERE datname = %s", (REWRITE_DATABASE,)).fetchone():
            admin.execute(f"CREATE DATABASE {REWRITE_DATABASE}")


def apply_migrations(root: Path | None = None, url: str | None = None) -> list[str]:
    """Creates mzizi_new if missing and applies pending migrations; a changed applied file is an error (reset instead)."""
    url = url or rewrite_url()
    ensure_database(url)
    applied: list[str] = []
    with connect(url) as conn:
        assert_rewrite_session(conn)
        conn.execute(
            "CREATE TABLE IF NOT EXISTS public.migrations (name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())"
        )
        conn.commit()
        done = {
            r["name"]: r["checksum"] for r in conn.execute("SELECT name, checksum FROM public.migrations").fetchall()
        }
        for name, sql, checksum in migration_files(root):
            if name in done:
                if done[name] != checksum:
                    raise DatabaseSafetyError(
                        f"{name} changed after it was applied; run reset (mzizi_new is disposable)"
                    )
                continue
            with conn.transaction():
                conn.execute(sql)
                conn.execute("INSERT INTO public.migrations (name, checksum) VALUES (%s, %s)", (name, checksum))
            applied.append(name)
    return applied


def reset_database(url: str | None = None) -> None:
    """Drops and recreates mzizi_new only, after verifying the host and (when it exists) current_database()."""
    url = url or rewrite_url()
    try:
        with connect(url) as probe:
            assert_rewrite_session(probe)
    except psycopg.OperationalError as error:
        if "does not exist" not in str(error):
            raise
    with psycopg.connect(_admin_url(url), autocommit=True) as admin:
        admin.execute(f"DROP DATABASE IF EXISTS {REWRITE_DATABASE} WITH (FORCE)")
        admin.execute(f"CREATE DATABASE {REWRITE_DATABASE}")
