import os
import subprocess
from pathlib import Path

import psycopg
import pytest

DATABASE_ENGINE = Path(__file__).resolve().parents[2] / "database"
SCRATCH = os.environ.get("TEST_SCRATCH_DB", "mzizi_test")


def scratch_database(name: str) -> str:
    """A scratch database migrated and reference-seeded by the database engine (skipped without TEST_DATABASE_URL)."""
    admin = os.environ.get("TEST_DATABASE_URL")
    if not admin:
        pytest.skip("TEST_DATABASE_URL is not set")
    base = admin.rsplit("/", 1)[0]
    with psycopg.connect(admin, autocommit=True) as conn:
        conn.execute(f"DROP DATABASE IF EXISTS {name} WITH (FORCE)")
        conn.execute(f"CREATE DATABASE {name}")
    url = f"{base}/{name}"
    env = {**os.environ, "DATABASE_URL": url}
    for args in (["migrate"], ["seed", "reference"]):
        subprocess.run(["bun", "src/cli.ts", *args], cwd=DATABASE_ENGINE, env=env, check=True, capture_output=True)
    return url


@pytest.fixture(scope="session")
def database_url():
    return scratch_database(SCRATCH)


@pytest.fixture()
def conn(database_url):
    from mzizi_data.db import connect

    with connect(database_url) as connection:
        yield connection
        connection.rollback()


@pytest.fixture()
def store(conn, tmp_path):
    from mzizi_data.files import LocalDirectoryStore

    return LocalDirectoryStore(conn, tmp_path / "objects")
