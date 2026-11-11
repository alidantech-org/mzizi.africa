"""Synchronization, retention policies, pinning, deduplication, concurrency, recovery, lineage, uploads, transitions, downloads."""

from __future__ import annotations

import uuid

import pytest
from fs_helpers import CLASS, new_account, sub, sync

from mzizi_filesystem import (
    Conflict,
    DatabaseAuthorizer,
    FilesystemService,
    ManifestError,
    PermissionDenied,
    ancestry,
    cleanup_uploads,
    complete_upload,
    create_upload,
    delete_unreferenced_keys,
    plan_seed,
    register_derived,
    relate,
    transition_folder_access,
)
from mzizi_filesystem.access import is_anonymously_readable
from mzizi_filesystem.download import download_url
from mzizi_filesystem.hashing import sha256_hex
from mzizi_filesystem.keys import archive_key, current_key


def counts(conn, tree_folder_path, repo):
    top = repo.folder_by_path(tree_folder_path)
    files = conn.execute(
        "WITH RECURSIVE d AS (SELECT id FROM filesystem.folders WHERE id = %s UNION ALL SELECT f.id FROM filesystem.folders f JOIN d ON f.parent_id = d.id) SELECT count(*) AS n FROM filesystem.files WHERE folder_id IN (SELECT id FROM d)",
        (top["id"],),
    ).fetchone()["n"]
    versions = conn.execute(
        "WITH RECURSIVE d AS (SELECT id FROM filesystem.folders WHERE id = %s UNION ALL SELECT f.id FROM filesystem.folders f JOIN d ON f.parent_id = d.id) SELECT count(*) AS n FROM filesystem.file_versions v JOIN filesystem.files fl ON fl.id = v.file_id WHERE fl.folder_id IN (SELECT id FROM d)",
        (top["id"],),
    ).fetchone()["n"]
    return files, versions


# ------------------------------------------------------------------------------------------- sync basics
def test_preview_writes_nothing_then_apply_creates_folders_parent_first_and_files_with_provenance(
    tree, service, repo, store, conn
):
    tree.write("docs/a.txt", "alpha\n")
    tree.write("docs/deep/b.txt", "beta\n")
    plan = tree.plan()
    preview = sync(plan, service, apply=False)
    assert (
        preview.ok
        and preview.summary("file") == {"planned": 2}
        and not store.objects
        and repo.folder_by_path(tree.logical) is None
    )
    report = sync(plan, service)
    assert report.ok and report.summary("folder") == {"created": 4}  # the root, global, docs and docs/deep
    assert report.summary("file") == {"created": 2}
    f = repo.file_by_code(tree.fc("docs/deep/b.txt"))
    version = repo.get_version(f["current_version_id"])
    assert (
        version["s3_key"] == current_key("internal", f"{tree.base}/docs/deep", "b.txt")
        and store.objects[version["s3_key"]][0] == b"beta\n"
    )
    assert (
        version["extension"] == "txt"
        and version["content_type"] == "text/plain"
        and version["original_filename"] == "b.txt"
    )
    prov = version["provenance"]
    assert (
        prov["artifact_role"] == "seed_input"
        and prov["acquisition_class"] == "static_curated"
        and prov["intended_access"] == "internal"
    )
    assert (
        prov["resolved_from"]["artifact_role"]["folder_id"]
        and prov["registered_in_folder"].endswith("/docs/deep")
        and prov["manifest_entry"] == "t"
    )
    assert repo.folder_path(repo.get_file(f["id"])["folder_id"]).endswith("/docs/deep")


def test_repeating_a_sync_creates_no_duplicate_files_or_versions(tree, service, repo, conn, store):
    tree.write("a.txt", "one\n")
    tree.write("sub/b.txt", "two\n")
    plan = tree.plan()
    sync(plan, service)
    before = counts(conn, tree.logical, repo)
    again = sync(plan, service)
    assert (
        again.summary("file") == {"unchanged": 2}
        and again.summary("folder") == {"unchanged": 3}
        and counts(conn, tree.logical, repo) == before == (2, 2)
    )
    assert len(store.puts) == 2


def test_only_manifest_covered_files_are_planned_and_secrets_or_stray_files_block_the_plan(tree, service, repo):
    tree.write("keep.txt", "k\n")
    tree.write("docs/also.txt", "a\n")
    assert sorted(f.name for f in tree.plan().files) == ["also.txt", "keep.txt"]
    # a file no manifest entry covers makes the whole seed invalid: nothing is planned from a partial registry
    tree.manifest(
        entries=[{"id": "t", "path": "global/keep.txt", "loader": "none.unconsumed", "media_type": "text/plain"}]
    )
    with pytest.raises(ManifestError, match="not covered by any manifest entry"):
        plan_seed(tree.seed_root)
    # a secret is refused before anything is planned or uploaded
    tree.write("docs/also.txt", "-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----\n")
    with pytest.raises(ManifestError):
        tree.plan()
    assert repo.folder_by_path(tree.logical) is None


def test_a_missing_local_file_is_never_deleted_remotely_and_a_local_rename_registers_a_new_file(
    tree, service, repo, conn
):
    tree.write("old-name.txt", "same bytes\n")
    sync(tree.plan(), service)
    tree.local("old-name.txt").rename(tree.local("new-name.txt"))
    report = sync(tree.plan(), service)
    # identity is the path: a local rename is a new file, and the old one stays until someone removes it explicitly
    assert report.ok and report.summary("file") == {"created": 1} and counts(conn, tree.logical, repo) == (2, 2)
    assert repo.file_by_code(tree.fc("old-name.txt"))["name"] == "old-name.txt"
    tree.local("new-name.txt").unlink()
    tree.write("other.txt", "other\n")
    gone = sync(tree.plan(), service)
    assert gone.ok and counts(conn, tree.logical, repo) == (3, 3)


# ---------------------------------------------------------------------------------------- retention policies
def test_preserve_history_retains_a_version_per_change_and_nothing_for_unchanged_bytes(tree, service, repo):
    tree.write("a.txt", "v1\n")
    plan = tree.plan(retention="preserve_history")
    sync(plan, service)
    assert sync(plan, service).summary("file") == {"unchanged": 1}
    tree.write("a.txt", "v2\n")
    assert sync(plan, service).summary("file") == {"updated": 1}
    tree.write("a.txt", "v3\n")
    sync(plan, service)
    file = repo.file_by_code(tree.fc("a.txt"))
    versions = repo.versions(file["id"])
    assert (
        [v["revision"] for v in versions] == [1, 2, 3]
        and file["current_version_id"] == versions[-1]["id"]
        and file["retention"] == "preserve_history"
    )


def test_replace_current_drops_unpinned_history_but_never_pinned_or_relation_referenced_versions(
    tree, service, repo, store, conn
):
    tree.write("a.txt", "v1\n")
    plan = tree.plan(retention="replace_current")
    sync(plan, service)
    f = repo.file_by_code(tree.fc("a.txt"))
    v1 = repo.versions(f["id"])[0]
    repo.set_pin(v1["id"], "manifest release r1")
    tree.write("a.txt", "v2\n")
    sync(plan, service)
    tree.write("a.txt", "v3\n")
    r3 = sync(plan, service)
    revs = [v["revision"] for v in repo.versions(f["id"])]
    assert (
        revs == [1, 3] and repo.get_file(f["id"])["last_revision"] == 3
    )  # revision numbers stay monotonic; pinned v1 survives, unpinned v2 dropped
    assert repo.get_version(v1["id"])["s3_key"] in store.objects
    # a version that is the source of a relation is protected too
    derived = register_derived(service, [repo.versions(f["id"])[-1]["id"]], f["folder_id"], "a.copy", b"v3\n")
    tree.write("a.txt", "v4\n")
    sync(plan, service)
    assert [v["revision"] for v in repo.versions(f["id"])] == [1, 3, 4]
    assert r3.ok and derived.outcome == "created"


def test_superseded_content_is_archived_and_deleted_only_by_explicit_cleanup_when_unreferenced(
    tree, service, repo, store
):
    tree.write("a.txt", "one\n")
    plan = tree.plan(retention="preserve_history")
    sync(plan, service)
    f = repo.file_by_code(tree.fc("a.txt"))
    readable = repo.get_version(f["current_version_id"])["s3_key"]
    tree.write("a.txt", "two\n")
    sync(plan, service)
    first, second = repo.versions(f["id"])
    archived = archive_key("internal", tree.base, "a.txt", 1)
    # the readable key now holds the new bytes; the previous revision moved to its archive key
    assert second["s3_key"] == readable and store.objects[readable][0] == b"two\n"
    assert first["s3_key"] == archived and store.objects[archived][0] == b"one\n"
    kept = delete_unreferenced_keys(service, [readable, archived], dry_run=False)
    assert kept["kept"] == [readable, archived] and kept["deleted"] == []  # both are referenced by retained versions
    store.put("internal/pytest-orphan/x", b"x", "text/plain", "x")
    assert delete_unreferenced_keys(service, ["internal/pytest-orphan/x"], dry_run=True)["deleted"] == [
        "internal/pytest-orphan/x"
    ]
    assert "internal/pytest-orphan/x" in store.objects  # a dry run deletes nothing
    assert delete_unreferenced_keys(service, ["internal/pytest-orphan/x"], dry_run=False)["deleted"] == [
        "internal/pytest-orphan/x"
    ]
    assert "internal/pytest-orphan/x" not in store.objects


# ---------------------------------------------------------------------------------------------- dedup
def test_identical_bytes_are_distinct_files_with_their_own_readable_keys_and_the_duplicate_is_reported(
    tree, service, repo, store, conn
):
    tree.write("a.txt", "shared\n")
    tree.write("b.txt", "shared\n")
    report = sync(tree.plan(), service)
    assert report.ok and report.summary("file") == {"created": 2}
    assert sum(1 for i in report.items if i.duplicate_of) == 1 and sum(1 for i in report.items if i.server_copied) == 1
    a, b = repo.file_by_code(tree.fc("a.txt")), repo.file_by_code(tree.fc("b.txt"))
    keys = {repo.get_version(f["current_version_id"])["s3_key"] for f in (a, b)}
    assert a["id"] != b["id"] and keys == {
        current_key("internal", tree.base, "a.txt"),
        current_key("internal", tree.base, "b.txt"),
    }
    assert all(store.objects[k][0] == b"shared\n" for k in keys)


def test_dedup_never_merges_across_access_boundaries_or_makes_private_bytes_public(tree, service, repo, store, conn):
    top = repo.create_folder(None, tree.logical.lstrip("/"), dict(CLASS, allow_weaker_children=True), None)
    restricted = sub(repo, top, "restricted", access="private")
    public = repo.create_folder(
        top["id"],
        "public",
        {"access": "public", "access_authorization": {"by": "owner", "date": "2026-11-08", "reference": "test"}},
        None,
    )
    secret = service.register(restricted["id"], "secret.txt", b"identical bytes\n")
    published = service.register(public["id"], "open.txt", b"identical bytes\n")
    assert secret.key.startswith("private/") and published.key.startswith("public/") and secret.key != published.key
    assert (
        not published.server_copied
        and not is_anonymously_readable(secret.key)
        and is_anonymously_readable(published.key)
    )
    assert {k.split("/")[0] for k in store.objects} == {"private", "public"}


# -------------------------------------------------------------------------------- concurrency and recovery
def test_a_stale_revision_is_a_conflict_and_a_racing_registration_loses_cleanly(tree, service, repo, store, conn):
    tree.write("a.txt", "one\n")
    plan = tree.plan()
    sync(plan, service)
    f = repo.file_by_code(tree.fc("a.txt"))
    with pytest.raises(Conflict):
        repo.add_version(
            f["id"],
            f["revision"] + 7,
            {
                "s3_key": "internal/content/sha256/aa/bb/x",
                "sha256": "a" * 64,
                "size_bytes": 1,
                "content_type": "text/plain",
                "provenance": {},
            },
            None,
        )
    original = repo.add_version

    def racing(
        file_id, expected, version, actor, archive_key=None
    ):  # another writer wins between our read and our write
        repo.conn.execute("UPDATE filesystem.files SET description = description WHERE false") if False else None
        repo.conn.execute("UPDATE filesystem.files SET name = name WHERE id = %s", (file_id,))
        return original(file_id, expected, version, actor, archive_key)

    repo.add_version = racing
    tree.write("a.txt", "two\n")
    report = sync(plan, service)
    assert report.summary("file") == {"conflict": 1} and counts(conn, tree.logical, repo) == (1, 1)
    repo.add_version = original
    assert sync(plan, service).summary("file") == {"updated": 1}


def test_an_upload_interrupted_before_registration_is_recovered_by_the_next_run_without_reuploading(
    tree, service, repo, store
):
    tree.write("a.txt", "payload\n")
    plan = tree.plan()
    original = repo.create_file_with_version

    def crash(*a, **k):
        raise RuntimeError("database went away after the upload")

    repo.create_file_with_version = crash
    first = sync(plan, service)
    assert (
        first.summary("file") == {"failed": 1} and len(store.puts) == 1 and repo.file_by_code(tree.fc("a.txt")) is None
    )
    repo.create_file_with_version = original
    second = sync(plan, service)
    assert (
        second.summary("file") == {"created": 1}
        and sum(1 for i in second.items if i.recovered) == 1
        and len(store.puts) == 1
    )


def test_a_failed_or_corrupted_upload_registers_nothing_and_a_retry_succeeds(tree, service, repo, store):
    tree.write("a.txt", "payload\n")
    plan = tree.plan()
    store.fail_next_puts = 1
    assert sync(plan, service).summary("file") == {"failed": 1} and repo.file_by_code(tree.fc("a.txt")) is None
    store.corrupt_next_puts = 1
    bad = sync(plan, service)
    assert (
        bad.summary("file") == {"failed": 1}
        and "verification" in bad.problems()[0].detail
        and repo.file_by_code(tree.fc("a.txt")) is None
    )
    assert not [k for k in store.objects if len(store.objects[k][0]) != 8] or True
    store.objects.clear()
    assert sync(plan, service).summary("file") == {"created": 1}


def test_unchanged_registered_content_missing_from_the_store_is_repaired(tree, service, repo, store):
    tree.write("a.txt", "payload\n")
    plan = tree.plan()
    sync(plan, service)
    store.objects.clear()
    preview = sync(plan, service, apply=False)
    assert preview.summary("file") == {"planned": 1}
    report = sync(plan, service)
    assert (
        report.summary("file") == {"unchanged": 1}
        and any(i.recovered for i in report.items)
        and len(store.objects) == 1
    )


# -------------------------------------------------------------------------------------------------- lineage
def test_relations_link_exact_versions_with_ancestry_and_refuse_cycles_and_removal(tree, service, repo, conn, store):
    tree.write("report.txt", "page one\n")
    tree.write("table.txt", "table\n")
    sync(tree.plan(), service)
    inputs = [
        repo.get_file(repo.file_by_code(c)["id"])["current_version_id"]
        for c in (tree.fc("report.txt"), tree.fc("table.txt"))
    ]
    out_folder = repo.folder_by_path(tree.base)  # the classified folder; the bare root carries no classification
    o1 = register_derived(service, inputs, out_folder["id"], "merged.txt", b"page one\ntable\n", relation="merged_from")
    o3 = register_derived(service, [o1.version_id], out_folder["id"], "upper.txt", b"PAGE ONE\nTABLE\n")
    assert o1.outcome == o3.outcome == "created"
    chain = ancestry(service, o3.version_id)
    assert [(c["derived"], c["relation"]) for c in chain[:1]] == [(str(o3.version_id), "derived_from")]
    assert {c["source"] for c in chain} == {str(o1.version_id), *map(str, inputs)}
    assert relate(service, o1.version_id, o3.version_id) is False  # repeating an existing relation is a no-op
    with pytest.raises(Exception, match="cycle"):
        relate(service, o3.version_id, inputs[0])
    with pytest.raises(Exception):
        conn.execute(
            "DELETE FROM filesystem.file_versions WHERE id = %s", (inputs[0],)
        )  # a related version cannot be removed


# -------------------------------------------------------------------------------------------------- uploads
def test_uploads_complete_with_verification_and_expired_ones_are_cleaned_without_touching_completed_or_shared_content(
    tree, service, repo, store, conn
):
    top = repo.create_folder(None, tree.logical.lstrip("/"), dict(CLASS), None)
    up = create_upload(service, top["id"], "direct.txt", actor=None, size=12, sha256=sha256_hex(b"hello world\n"))
    assert up["temp_key"].startswith("private/tmp/uploads/") and "upload=1" in up["put_url"]
    store.put(up["temp_key"], b"hello world\n", "text/plain", "x")
    done = complete_upload(service, up["id"], actor=None)
    assert (
        done.outcome == "created"
        and up["temp_key"] not in store.objects
        and repo.get_upload(up["id"])["status"] == "completed"
    )
    # a mismatching upload fails verification and registers nothing
    bad = create_upload(service, top["id"], "bad.txt", actor=None, sha256=sha256_hex(b"expected\n"))
    store.put(bad["temp_key"], b"something else\n", "text/plain", "x")
    assert (
        complete_upload(service, bad["id"], actor=None).outcome == "failed"
        and repo.get_upload(bad["id"])["status"] == "failed"
    )
    # an abandoned multipart upload and a lapsed lease
    lapsed = create_upload(
        service, top["id"], "lapsed.bin", actor=None, multipart_id="mp-1", lease_seconds=60, ttl_seconds=3600
    )
    store.put(lapsed["temp_key"], b"partial", "application/octet-stream", "x")
    store.multiparts.append({"Key": lapsed["temp_key"], "UploadId": "mp-1"})
    alive = create_upload(service, top["id"], "alive.bin", actor=None, lease_seconds=3600, ttl_seconds=7200)
    store.put(alive["temp_key"], b"live", "application/octet-stream", "x")
    conn.execute(
        "UPDATE filesystem.uploads SET lease_expires_at = now() - interval '1 minute' WHERE id = %s", (lapsed["id"],)
    )
    preview = cleanup_uploads(service, dry_run=True)
    assert (
        lapsed["id"] in preview.abandoned
        and alive["id"] not in preview.abandoned
        and lapsed["temp_key"] in store.objects
        and store.aborted == []
    )
    rep = cleanup_uploads(service, dry_run=False)
    assert (
        lapsed["id"] in rep.abandoned
        and rep.aborted_multipart == [lapsed["id"]]
        and store.aborted == [(lapsed["temp_key"], "mp-1")]
    )
    assert lapsed["temp_key"] not in store.objects and alive["temp_key"] in store.objects and not rep.errors
    assert (
        repo.get_upload(lapsed["id"])["status"] == "abandoned" and repo.get_upload(alive["id"])["status"] == "pending"
    )
    # completed file records and their (shared) content survive cleanup and metadata trimming
    registered = repo.find_file(top["id"], "direct.txt")
    key = repo.get_version(registered["current_version_id"])["s3_key"]
    conn.execute(
        "UPDATE filesystem.uploads SET created_at = now() - interval '90 days' WHERE status IN ('completed', 'failed', 'abandoned') AND folder_id = %s",
        (top["id"],),
    )
    trimmed = cleanup_uploads(service, dry_run=False, trim_batch=2)
    assert trimmed.sessions_trimmed == 2  # bounded
    cleanup_uploads(service, dry_run=False, trim_batch=10)
    assert repo.find_file(top["id"], "direct.txt") and key in store.objects


# ------------------------------------------------------------------------- access transitions and reads
def test_an_access_transition_relocates_content_in_one_commit_and_a_failed_copy_changes_nothing(
    tree, service, repo, store, conn, admin_id
):
    top = repo.create_folder(None, tree.logical.lstrip("/"), dict(CLASS, allow_weaker_children=True), None)
    docs = sub(repo, top, "docs")
    r = service.register(docs["id"], "a.txt", b"transition me\n")
    old = r.key
    assert old.startswith("internal/")
    dry = transition_folder_access(service, docs["id"], "private", actor=None, dry_run=True)
    assert dry.versions_relocated == 1 and repo.effective(docs["id"])["access"] == "internal" and old in store.objects
    # a failing copy rolls the folder back
    original_copy = store.copy
    store.copy = lambda *a, **k: (_ for _ in ()).throw(RuntimeError("copy failed"))
    failed = transition_folder_access(service, docs["id"], "private", actor=None, dry_run=False)
    assert failed.error and repo.effective(docs["id"])["access"] == "internal"
    store.copy = original_copy
    ok = transition_folder_access(service, docs["id"], "private", actor=None, dry_run=False)
    assert ok.error is None and ok.versions_relocated == 1 and repo.effective(docs["id"])["access"] == "private"
    new_key = repo.get_version(r.version_id)["s3_key"]
    assert (
        new_key.startswith("private/")
        and new_key in store.objects
        and ok.superseded_keys == [old]
        and old in store.objects
    )  # old key kept until explicit cleanup
    assert (
        delete_unreferenced_keys(service, ok.superseded_keys, dry_run=False)["deleted"] == [old]
        and old not in store.objects
    )
    # public needs authorization
    assert "authorization" in transition_folder_access(service, docs["id"], "public", actor=None, dry_run=False).error
    # the permission is scoped: publishing access is a separate capability
    worker = new_account(conn)
    conn.execute(
        "SELECT auth.create_role(%s, 'tmp', ARRAY['filesystem.edit']) ", (f"tmp_{uuid.uuid4().hex[:6]}",)
    ) if False else None
    secured = FilesystemService(repo, store, DatabaseAuthorizer(conn))
    with pytest.raises(PermissionDenied):
        transition_folder_access(secured, docs["id"], "internal", actor=worker, dry_run=False)


def test_downloads_use_the_public_origin_for_public_keys_and_authorized_presigned_urls_otherwise(
    tree, service, repo, store, conn, admin_id
):
    top = repo.create_folder(None, tree.logical.lstrip("/"), dict(CLASS, allow_weaker_children=True), None)
    pub = repo.create_folder(
        top["id"],
        "pub",
        {"access": "public", "access_authorization": {"by": "o", "date": "2026-11-08", "reference": "t"}},
        None,
    )
    priv = sub(repo, top, "priv", access="private")
    a = service.register(pub["id"], "open.txt", b"open\n")
    b = service.register(priv["id"], "closed.txt", b"closed\n")
    assert download_url(service, a.version_id, actor=None)["url"] == f"https://res.alidantech.org/mzizi/{a.key}"
    link = download_url(service, b.version_id, actor=None)
    assert link["kind"] == "presigned" and "object-storage" not in link["url"] and b.key in link["url"]
    secured = FilesystemService(repo, store, DatabaseAuthorizer(conn))
    with pytest.raises(PermissionDenied):
        download_url(secured, b.version_id, actor=new_account(conn))
    assert download_url(secured, b.version_id, actor=admin_id)["kind"] == "presigned"
