"""Database safety rules that need no server."""
import pytest

from mzizi_database import DatabaseSafetyError, connect, rewrite_url
from mzizi_database.migrate import migration_files


def test_only_mzizi_databases_may_be_touched():
    for url in ("postgres://postgres@localhost/postgres", "postgres://postgres@localhost/defytickets", "postgres://postgres@localhost/other_mzizi"):
        with pytest.raises(DatabaseSafetyError, match="only mzizi"):
            connect(url)
    with pytest.raises(DatabaseSafetyError, match="DATABASE_URL"):
        connect(None)


def test_the_rewrite_url_must_be_exactly_mzizi_new_on_a_local_host(monkeypatch):
    monkeypatch.setenv("REWRITE_DATABASE_URL", "postgres://postgres@localhost/mzizi_dev")
    with pytest.raises(DatabaseSafetyError, match="only mzizi_new"):
        rewrite_url()
    monkeypatch.setenv("REWRITE_DATABASE_URL", "postgres://postgres@db.example.com/mzizi_new")
    with pytest.raises(DatabaseSafetyError, match="non-local"):
        rewrite_url()
    monkeypatch.setenv("REWRITE_DATABASE_URL", "postgres://postgres@127.0.0.1:5432/mzizi_new")
    assert rewrite_url().endswith("/mzizi_new")


def test_the_ordered_migration_list_resolves_with_checksums():
    names = [n for n, _, _ in migration_files()]
    assert names[:4] == ["auth/0001_auth.sql", "auth/0002_auth_functions.sql", "engine/0001_engine.sql", "filesystem/0001_filesystem.sql"]
    assert len(names) == len(set(names))
    assert all(len(checksum) == 64 for _, _, checksum in migration_files())
