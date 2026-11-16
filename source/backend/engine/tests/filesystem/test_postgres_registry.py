"""The filesystem package over the real current PostgreSQL schema.

Needs a scratch database with the Dryv schema applied (`MZIZI_DB_ADMIN_URL=... bun run db migrate`) and its URL in
`MZIZI_FS_TEST_DATABASE_URL`; skipped otherwise. Every test rolls back, so the database stays empty.
"""

from __future__ import annotations

import os
from collections.abc import Iterator
from uuid import uuid4

import pytest

from mzizi_engine.persistence.filesystem import PostgresRegistry
from mzizi_engine.persistence.postgres import Connection, connect
from mzizi_filesystem import (
    Access,
    DuplicatePolicy,
    FilesystemConfig,
    FilesystemOrchestrator,
    MediaCatalog,
    MemoryObjectStore,
    NameConflictPolicy,
    Outcome,
    RegisterRequest,
    Retention,
)
from mzizi_filesystem.features.placement.contracts import Placement
from mzizi_filesystem.shared.contracts import RelationRecord

URL = os.environ.get("MZIZI_FS_TEST_DATABASE_URL")
pytestmark = pytest.mark.skipif(not URL, reason="MZIZI_FS_TEST_DATABASE_URL is not set")

CONFIG = FilesystemConfig(
    bucket="test",
    region="r",
    public_endpoint="https://files.test",
    protected_prefixes=("public/raw/",),
    reserved_roots=("tmp",),
    temp_prefix="private/tmp/",
)


@pytest.fixture
def conn() -> Iterator[Connection]:
    assert URL
    connection = connect(URL)
    try:
        yield connection
    finally:
        connection.rollback()
        connection.close()


@pytest.fixture
def reference(conn: Connection) -> tuple[str, str]:
    """A reference scheme with a folder-role value and a relation-kind value (both are required references)."""
    scheme = uuid4()
    conn.execute(
        "INSERT INTO reference.schemes (id, created_at, updated_at, version, code, title, owner_snapshot) "
        "VALUES (%s, now(), now(), 1, %s, 'test', '{}')",
        (scheme, f"test.{scheme.hex}"),
    )
    ids = []
    for label in ("role", "derived"):
        value = uuid4()
        conn.execute(
            'INSERT INTO reference."values" (id, created_at, updated_at, version, code, label, scheme_id) '
            "VALUES (%s, now(), now(), 1, %s, %s, %s)",
            (value, f"test.{value.hex}", label, scheme),
        )
        ids.append(str(value))
    return ids[0], ids[1]


@pytest.fixture
def fs(conn: Connection) -> FilesystemOrchestrator:
    store = MemoryObjectStore("test", "https://files.test", CONFIG.protected_prefixes)
    return FilesystemOrchestrator(CONFIG, PostgresRegistry(conn), store, MediaCatalog({"pdf": "application/pdf"}))


def ask(
    role: str, *folders: str, name: str = "report.csv", access: Access = Access.PUBLIC, **options: object
) -> RegisterRequest:
    base: dict[str, object] = {
        "file_code": None,
        "declared_type": None,
        "original_filename": None,
        "provenance": {"task": "db test"},
        "created_by": {"actor": "tests"},
        "on_name_conflict": NameConflictPolicy.NEW_VERSION,
        "on_duplicate": DuplicatePolicy.KEEP_BOTH,
        "pinned": False,
        "dry_run": False,
    }
    placement = Placement(
        folders=folders or (f"t{uuid4().hex[:8]}", "docs"),
        file_name=name,
        access=access,
        retention=Retention.PRESERVE_HISTORY,
        role_id=role,
        authorization=None,
    )
    return RegisterRequest(placement=placement, **{**base, **options})  # type: ignore[arg-type]


def test_register_update_and_unchanged_round_trip_through_postgres(
    fs: FilesystemOrchestrator, reference: tuple[str, str]
) -> None:
    role, _ = reference
    root = f"t{uuid4().hex[:8]}"
    created = fs.register(ask(role, root, "docs"), b"a,b\n1,2\n")
    assert created.outcome is Outcome.CREATED and created.revision == 1
    assert fs.register(ask(role, root, "docs"), b"a,b\n1,2\n").outcome is Outcome.UNCHANGED
    updated = fs.register(ask(role, root, "docs"), b"a,b\n3,4\n")
    assert updated.outcome is Outcome.UPDATED and updated.revision == 2 and updated.archived_key
    assert updated.key == f"public/{root}/docs/report.csv"


def test_replace_current_retires_the_old_version_and_a_revision_is_never_reused(
    fs: FilesystemOrchestrator, reference: tuple[str, str]
) -> None:
    role, _ = reference
    root = f"t{uuid4().hex[:8]}"
    request = ask(role, root, "x").model_copy(deep=True)
    placement = request.placement.model_copy(update={"retention": Retention.REPLACE_CURRENT})
    request = request.model_copy(update={"placement": placement})
    assert fs.register(request, b"a\n1\n").revision == 1
    assert fs.register(request, b"a\n2\n").revision == 2
    third = fs.register(request, b"a\n3\n")
    assert third.revision == 3 and third.archived_key is None


def test_lineage_and_relocation_through_postgres(fs: FilesystemOrchestrator, reference: tuple[str, str]) -> None:
    role, kind = reference
    root = f"t{uuid4().hex[:8]}"
    raw = fs.register(ask(role, root, "raw"), b"a\n1\n")
    clean = fs.register(ask(role, root, "clean"), b"a\n10\n")
    edge = RelationRecord(
        source_version_id=raw.version_id or "",
        derived_version_id=clean.version_id or "",
        kind_id=kind,
        processing_provenance={"tool": "t"},
    )
    assert fs.relate(edge) is True and fs.relate(edge) is False
    assert [r.source_version_id for r in fs.ancestry(clean.version_id or "", 5)] == [raw.version_id]
    folder = fs.plan(ask(role, root, "clean").placement).steps[-1].existing
    assert folder is not None
    report = fs.change_access(folder.id, Access.PRIVATE, "owner approved")
    assert report.versions_relocated == 1
    link = fs.download_link(clean.version_id or "", 60)
    assert link.s3_key == f"private/{root}/clean/report.csv" and "files.test" in link.url
    renamed = fs.move_folder(folder.id, None, f"{root}-moved")
    assert renamed.versions_relocated == 1


def test_a_missing_reference_is_a_database_error_not_a_silent_success(fs: FilesystemOrchestrator) -> None:
    import psycopg

    with pytest.raises(psycopg.Error):
        fs.register(ask(str(uuid4()), f"t{uuid4().hex[:8]}"), b"a\n1\n")
