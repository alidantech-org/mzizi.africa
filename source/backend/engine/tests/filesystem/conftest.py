from __future__ import annotations

import uuid

import pytest
from fs_helpers import CLASS, ISSUER, Tree, purge

from mzizi_engine.filesystem import FilesystemService, Repository
from mzizi_engine.ports import connect, rewrite_url
from mzizi_filesystem import MemoryObjectStore

# Schema migrations are applied separately (`bun run db migrate`); this fixture only connects.


@pytest.fixture
def conn():
    c = connect(rewrite_url(), autocommit=True)
    yield c
    c.close()


@pytest.fixture
def repo(conn):
    return Repository(conn)


@pytest.fixture
def store():
    return MemoryObjectStore()


@pytest.fixture
def service(repo, store):
    return FilesystemService(repo, store)


@pytest.fixture(scope="session")
def admin_id():
    with connect(rewrite_url(), autocommit=True) as c:
        row = c.execute("SELECT account_id FROM auth.resolve_identity(%s, 'fs-admin')", (ISSUER,)).fetchone()
        if row["account_id"]:
            return str(row["account_id"])
        return str(
            c.execute(
                "SELECT auth.bootstrap_admin(%s, 'fs-admin', 'Filesystem test admin', 'admin') AS id", (ISSUER,)
            ).fetchone()["id"]
        )


@pytest.fixture
def root(conn, repo):
    """An explicitly classified internal test folder; its whole tree is purged afterwards."""
    folder = repo.create_folder(
        None, f"pytest-{uuid.uuid4().hex[:8]}", dict(CLASS, description="test root", allow_weaker_children=True), None
    )
    yield folder
    purge(conn, folder["id"])


@pytest.fixture
def tree(tmp_path, conn, repo):
    """A synthetic seed root; whatever it registered is purged afterwards."""
    t = Tree(tmp_path)
    yield t
    top = repo.folder_by_path(t.logical)
    if top:
        purge(conn, top["id"])
