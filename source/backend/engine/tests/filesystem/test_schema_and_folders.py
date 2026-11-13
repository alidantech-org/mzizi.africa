"""Fresh schema, folder hierarchy, inheritance, access rules, file/version integrity, tags, scoped permissions (mzizi_new)."""

from __future__ import annotations

import psycopg
import pytest
from fs_helpers import new_account, sub

from mzizi_engine.filesystem import Conflict, DatabaseAuthorizer, FilesystemService, PermissionDenied


def rejected(conn, sql, params=()):
    try:
        with conn.transaction():
            conn.execute(sql, params)
    except psycopg.Error as error:
        return error
    raise AssertionError(f"expected rejection: {sql}")


def test_the_schema_has_exactly_the_seven_tables_and_no_objects_or_file_type_tables(conn):
    tables = [
        r["table_name"]
        for r in conn.execute(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'filesystem' AND table_type = 'BASE TABLE' ORDER BY 1"
        ).fetchall()
    ]
    assert tables == ["file_relations", "file_versions", "files", "folders", "taggings", "tags", "uploads"]
    assert not conn.execute(
        "SELECT 1 FROM information_schema.columns c JOIN information_schema.tables t USING (table_schema, table_name) WHERE c.table_schema = 'filesystem' AND t.table_type = 'BASE TABLE' AND column_name IN ('path', 'extracted_from_file_id', 'processed', 'bucket', 'endpoint', 'presigned_url', 'file_type_id')"
    ).fetchone()
    assert (
        conn.execute(
            "SELECT count(*) AS n FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = 'filesystem' WHERE c.relkind = 'r' AND (obj_description(c.oid) IS NULL OR NOT EXISTS (SELECT 1 FROM pg_constraint k WHERE k.conrelid = c.oid AND k.contype = 'p'))"
        ).fetchone()["n"]
        == 0
    )
    cols = {
        r["column_name"]
        for r in conn.execute(
            "SELECT column_name FROM information_schema.columns WHERE table_schema = 'filesystem' AND table_name = 'file_versions'"
        ).fetchall()
    }
    assert {
        "s3_key",
        "sha256",
        "size_bytes",
        "extension",
        "content_type",
        "original_filename",
        "provenance",
        "created_by",
        "created_at",
        "revision",
        "file_id",
    } <= cols


def test_paths_are_derived_names_are_unique_per_parent_including_roots_and_cycles_are_refused(conn, repo, root):
    a = sub(repo, root, "a")
    b = sub(repo, a, "b")
    assert repo.folder_path(b["id"]) == f"/{root['name']}/a/b"
    assert (
        rejected(conn, "INSERT INTO filesystem.folders (parent_id, name) VALUES (%s, 'a')", (root["id"],)).sqlstate
        == "23505"
    )
    rname = f"rootdup-{root['name']}"
    repo.create_folder(None, rname, {}, None)
    try:
        assert rejected(conn, "INSERT INTO filesystem.folders (name) VALUES (%s)", (rname,)).sqlstate == "23505"
    finally:
        conn.execute("DELETE FROM filesystem.folders WHERE name = %s", (rname,))
    assert "cycle" in str(
        rejected(conn, "UPDATE filesystem.folders SET parent_id = %s WHERE id = %s", (b["id"], root["id"]))
    )
    assert (
        rejected(conn, "INSERT INTO filesystem.folders (parent_id, name) VALUES (%s, 'x/y')", (root["id"],)).sqlstate
        == "23514"
    )
    assert (
        rejected(conn, "INSERT INTO filesystem.folders (name) VALUES ('raw')").sqlstate == "23514"
    )  # the historical raw collection is not a logical root


def test_inheritance_nearest_explicit_value_wins_and_resolved_from_names_the_source(repo, root):
    a = sub(repo, root, "a", artifact_role="report")
    b = sub(repo, a, "b", preparation="ai_prepared", is_seed=True)
    c = sub(repo, b, "c")
    eff = repo.effective(c["id"])
    assert (eff["access"], eff["artifact_role"], eff["preparation"], eff["is_seed"], eff["acquisition_class"]) == (
        "internal",
        "report",
        "ai_prepared",
        True,
        "static_curated",
    )
    assert (
        eff["resolved_from"]["access"] == str(root["id"])
        and eff["resolved_from"]["artifact_role"] == str(a["id"])
        and eff["resolved_from"]["preparation"] == str(b["id"])
    )
    loose = repo.create_folder(None, f"loose-{root['name']}", {}, None)
    try:
        e2 = repo.effective(loose["id"])
        assert (
            e2["access"] == "internal"
            and e2["access_defaulted"] is True
            and e2["artifact_role"] is None
            and e2["is_seed"] is False
        )
    finally:
        repo.conn.execute("DELETE FROM filesystem.folders WHERE id = %s", (loose["id"],))


def test_access_cannot_widen_below_a_strict_parent_unless_allowed_and_public_needs_authorization(conn, repo, root):
    strict = sub(repo, root, "strict", access="restricted", allow_weaker_children=False)
    assert "widen" in str(
        rejected(
            conn,
            "INSERT INTO filesystem.folders (parent_id, name, access) VALUES (%s, 'weak', 'internal')",
            (strict["id"],),
        )
    )
    ok = sub(repo, strict, "stricter", access="private")
    assert repo.effective(ok["id"])["access"] == "private"
    assert (
        rejected(
            conn, "INSERT INTO filesystem.folders (parent_id, name, access) VALUES (%s, 'pub', 'public')", (root["id"],)
        ).sqlstate
        == "23514"
    )
    pub = repo.create_folder(
        root["id"],
        "pub",
        {"access": "public", "access_authorization": {"by": "owner", "date": "2026-11-08", "reference": "decision-1"}},
        None,
    )
    assert repo.effective(pub["id"])["access"] == "public"
    # a parent made stricter than an explicitly weaker descendant is refused
    weak_root = sub(repo, root, "wr", access="internal", allow_weaker_children=True)
    sub(repo, weak_root, "child", access="internal")
    assert "weaker" in str(
        rejected(
            conn,
            "UPDATE filesystem.folders SET access = 'restricted', allow_weaker_children = false WHERE id = %s",
            (weak_root["id"],),
        )
    )


def test_the_file_and_first_version_are_created_together_and_the_current_version_must_belong_to_the_file(
    conn, repo, root, service
):
    r = service.register(root["id"], "a.txt", b"hello\n")
    assert r.outcome == "created" and r.revision == 1
    file = repo.get_file(r.file_id)
    assert file["current_version_id"] == r.version_id and file["last_revision"] == 1
    other = service.register(root["id"], "b.txt", b"other\n")
    assert (
        rejected(
            conn, "UPDATE filesystem.files SET current_version_id = %s WHERE id = %s", (other.version_id, r.file_id)
        ).sqlstate
        == "23503"
    )
    # a bare file with no version cannot commit
    assert "no current version" in str(
        rejected(conn, "INSERT INTO filesystem.files (folder_id, name) VALUES (%s, 'orphan')", (root["id"],))
    )
    # immutability of a registered revision
    assert "immutable" in str(
        rejected(conn, "UPDATE filesystem.file_versions SET sha256 = repeat('b', 64) WHERE id = %s", (r.version_id,))
    )
    assert "not newer" in str(
        rejected(
            conn,
            "INSERT INTO filesystem.file_versions (file_id, revision, s3_key, sha256, size_bytes, content_type, provenance) VALUES (%s, 1, 'internal/x', repeat('a',64), 1, 'text/plain', '{}')",
            (r.file_id,),
        )
    )
    assert (
        rejected(
            conn,
            "INSERT INTO filesystem.file_versions (file_id, revision, s3_key, sha256, size_bytes, content_type, provenance) VALUES (%s, 5, 'ftp://x', repeat('a',64), 1, 'text/plain', '{}')",
            (r.file_id,),
        ).sqlstate
        == "23514"
    )


def test_a_version_key_prefix_must_match_its_folders_effective_access(conn, repo, root, service):
    r = service.register(root["id"], "a.txt", b"hello\n")
    assert repo.get_version(r.version_id)["s3_key"].startswith("internal/")
    assert "its registry path requires" in str(
        rejected(
            conn,
            "UPDATE filesystem.file_versions SET s3_key = 'public/content/sha256/aa/bb/x' WHERE id = %s",
            (r.version_id,),
        )
    )
    assert "relocate" in str(
        rejected(conn, "UPDATE filesystem.folders SET access = 'private' WHERE id = %s", (root["id"],))
    )  # a database access change alone cannot change visibility


def test_tags_use_one_vocabulary_with_exactly_one_target_and_no_duplicates(conn, repo, root, service):
    r = service.register(root["id"], "a.txt", b"hello\n")
    assert repo.tag("topic:budget", "file", r.file_id, None) is True
    assert repo.tag("topic:budget", "file", r.file_id, None) is False
    assert repo.tag("topic:budget", "folder", root["id"], None) is True
    assert (
        rejected(
            conn,
            "INSERT INTO filesystem.taggings (tag_id, file_id, folder_id) SELECT id, %s, %s FROM filesystem.tags WHERE name = 'topic:budget'",
            (r.file_id, root["id"]),
        ).sqlstate
        == "23514"
    )
    assert (
        rejected(
            conn, "INSERT INTO filesystem.taggings (tag_id) SELECT id FROM filesystem.tags WHERE name = 'topic:budget'"
        ).sqlstate
        == "23514"
    )
    assert rejected(conn, "INSERT INTO filesystem.tags (name) VALUES ('Bad Name')").sqlstate == "23514"
    conn.execute("DELETE FROM filesystem.taggings WHERE folder_id = %s", (root["id"],))


def test_scoped_permissions_cover_a_folder_and_its_children_and_deny_moves_out_of_scope(
    conn, repo, store, root, admin_id
):
    a, b = sub(repo, root, "a"), sub(repo, root, "b")
    child = sub(repo, a, "child")
    worker = new_account(conn)
    conn.execute(
        "SELECT auth.grant_role(%s, %s, 'filesystem_manager', 'filesystem.folders', %s)", (admin_id, worker, a["id"])
    )
    svc = FilesystemService(repo, store, DatabaseAuthorizer(conn))
    ok = svc.register(a["id"], "in-scope.txt", b"1\n", actor=worker)
    assert ok.outcome == "created"
    assert svc.register(child["id"], "child.txt", b"2\n", actor=worker).outcome == "created"
    denied = svc.register(b["id"], "out.txt", b"3\n", actor=worker)
    assert denied.outcome == "denied" and "out_of_scope" in denied.detail
    # moves: the destination is checked as well as the origin
    with pytest.raises(PermissionDenied, match="proposed_owner"):
        svc.authorizer.for_move(worker, "filesystem.edit", "filesystem.files", ok.file_id, b["id"])
    svc.authorizer.for_move(worker, "filesystem.edit", "filesystem.files", ok.file_id, child["id"])
    # reading needs filesystem.read, granted by the same role; a stranger gets nothing
    stranger = new_account(conn)
    with pytest.raises(PermissionDenied):
        svc.authorizer.for_record(stranger, "filesystem.read", "filesystem.files", ok.file_id)
    # folder creation is scoped too
    with pytest.raises(PermissionDenied):
        svc.authorizer.for_new_child(worker, "filesystem.edit", "filesystem.folders", b["id"])
    svc.authorizer.for_new_child(worker, "filesystem.edit", "filesystem.folders", child["id"])
    with pytest.raises(Conflict):
        repo.set_file_place(ok.file_id, 999, child["id"], "in-scope.txt")
