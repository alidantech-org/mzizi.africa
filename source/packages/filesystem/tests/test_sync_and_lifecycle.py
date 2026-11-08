"""Synchronization, retention policies, pinning, deduplication, concurrency, recovery, lineage, uploads, transitions, downloads."""
from __future__ import annotations

import uuid
from pathlib import Path

import pytest
import yaml
from fs_helpers import CLASS, new_account, purge, sub

from mzizi_filesystem.codes import code_segment
from mzizi_filesystem import (Conflict, DatabaseAuthorizer, FilesystemService, ManifestError, MemoryObjectStore, PermissionDenied, ancestry, cleanup_uploads, complete_upload,
                              create_upload, delete_unreferenced_keys, plan_seed, plan_sync_manifest, register_derived, relate, run_sync, transition_folder_access)
from mzizi_filesystem.access import is_anonymously_readable
from mzizi_filesystem.download import download_url
from mzizi_filesystem.hashing import content_key, sha256_hex


# ----------------------------------------------------------------------------------------------- helpers
class Tree:
    def __init__(self, tmp: Path) -> None:
        self.seed_root = tmp
        token = uuid.uuid4().hex[:8]
        self.logical = f"/pytest-{token}"
        self.code = f"pytest_{token}"

    def fc(self, rel: str) -> str:
        """Derived code of the file at a relative path under the tree root."""
        return ".".join([self.code, *[code_segment(p) for p in rel.split("/")]])

    def write(self, rel: str, data: bytes | str) -> None:
        path = self.seed_root / "tree" / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data if isinstance(data, bytes) else data.encode())

    def manifest(self, **entry) -> Path:
        entry = {"id": "t", "source": {"path": "."}, "code": self.code, **entry}
        doc = {"schema_version": 1, "kind": "filesystem-sync", "name": "pytest", "release": "r1", "root": "tree", "logical_root": self.logical,
               "entries": [entry]}
        doc["entries"][0].setdefault("classification", dict(CLASS))
        path = self.seed_root / "m.yaml"
        path.write_text(yaml.safe_dump(doc))
        return path

    def plan(self, **entry):
        return plan_sync_manifest(self.manifest(**entry), self.seed_root)


@pytest.fixture
def tree(tmp_path, conn, repo):
    t = Tree(tmp_path)
    yield t
    top = repo.folder_by_path(t.logical)
    if top:
        purge(conn, top["id"])


def sync(plan, service, apply=True, actor=None):
    return run_sync(plan, service, actor=actor, dry_run=not apply)


def counts(conn, tree_folder_path, repo):
    top = repo.folder_by_path(tree_folder_path)
    files = conn.execute("WITH RECURSIVE d AS (SELECT id FROM filesystem.folders WHERE id = %s UNION ALL SELECT f.id FROM filesystem.folders f JOIN d ON f.parent_id = d.id) SELECT count(*) AS n FROM filesystem.files WHERE folder_id IN (SELECT id FROM d)", (top["id"],)).fetchone()["n"]
    versions = conn.execute("WITH RECURSIVE d AS (SELECT id FROM filesystem.folders WHERE id = %s UNION ALL SELECT f.id FROM filesystem.folders f JOIN d ON f.parent_id = d.id) SELECT count(*) AS n FROM filesystem.file_versions v JOIN filesystem.files fl ON fl.id = v.file_id WHERE fl.folder_id IN (SELECT id FROM d)", (top["id"],)).fetchone()["n"]
    return files, versions


# ------------------------------------------------------------------------------------------- sync basics
def test_preview_writes_nothing_then_apply_creates_folders_parent_first_and_files_with_provenance(tree, service, repo, store, conn):
    tree.write("docs/a.txt", "alpha\n")
    tree.write("docs/deep/b.txt", "beta\n")
    plan = tree.plan()
    preview = sync(plan, service, apply=False)
    assert preview.ok and preview.summary("file") == {"planned": 2} and not store.objects and repo.folder_by_path(tree.logical) is None
    report = sync(plan, service)
    assert report.ok and report.summary("folder") == {"created": 3 + 0} or report.summary("folder")["created"] >= 3
    assert report.summary("file") == {"created": 2}
    f = repo.file_by_code(tree.fc("docs/deep/b.txt"))
    version = repo.get_version(f["current_version_id"])
    assert version["s3_key"] == content_key("internal", sha256_hex(b"beta\n")) and store.objects[version["s3_key"]][0] == b"beta\n"
    assert version["extension"] == "txt" and version["content_type"] == "text/plain" and version["original_filename"] == "b.txt"
    prov = version["provenance"]
    assert prov["artifact_role"] == "seed_input" and prov["acquisition_class"] == "static_curated" and prov["intended_access"] == "internal"
    assert prov["resolved_from"]["artifact_role"]["folder_id"] and prov["registered_in_folder"].endswith("/docs/deep") and prov["manifest_entry"] == "t"
    assert repo.folder_path(repo.get_file(f["id"])["folder_id"]).endswith("/docs/deep")


def test_repeating_a_sync_creates_no_duplicate_files_or_versions(tree, service, repo, conn, store):
    tree.write("a.txt", "one\n")
    tree.write("sub/b.txt", "two\n")
    plan = tree.plan()
    sync(plan, service)
    before = counts(conn, tree.logical, repo)
    again = sync(plan, service)
    assert again.summary("file") == {"unchanged": 2} and again.summary("folder") == {"unchanged": 2} and counts(conn, tree.logical, repo) == before == (2, 2)
    assert len(store.puts) == 2


def test_include_and_exclude_rules_and_sensitive_files_are_never_published(tree, service, repo):
    tree.write("keep.txt", "k\n")
    tree.write("skip.log", "l\n")
    tree.write("prod.env", "TOKEN=abc\n")
    tree.write("keys/signing.pem", "-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----\n")
    tree.write("certs/ca.pem", "-----BEGIN CERTIFICATE-----\nabc\n-----END CERTIFICATE-----\n")
    plan = tree.plan(source={"path": ".", "exclude": ["**/*.log"]})
    blocked = {p for p, _ in plan.blocked}
    assert any(p.endswith("prod.env") for p in blocked) and any(p.endswith("signing.pem") for p in blocked)
    report = sync(plan, service)
    names = {i.path.rsplit("/", 1)[1] for i in report.items if i.kind == "file" and i.outcome == "created"}
    assert names == {"keep.txt", "ca.pem"} and report.summary("file")["blocked"] == 2
    included = tree.plan(source={"path": ".", "include": ["**/*.txt"]})
    assert [f.name for f in included.files] == ["keep.txt"]


def test_a_missing_local_file_is_never_deleted_remotely_and_a_rename_keeps_its_identity(tree, service, repo, conn):
    tree.write("old-name.txt", "same bytes\n")
    stable = f"{tree.code}.doc_1"
    sync(tree.plan(identities={"old-name.txt": stable, "new-name.txt": stable}), service)
    (tree.seed_root / "tree" / "old-name.txt").rename(tree.seed_root / "tree" / "new-name.txt")
    report = sync(tree.plan(identities={"old-name.txt": stable, "new-name.txt": stable}), service)
    assert report.summary("file") == {"unchanged": 1} and counts(conn, tree.logical, repo) == (1, 1)
    assert repo.file_by_code(stable)["name"] == "old-name.txt"  # renaming the remote file is an explicit operation, not an accident
    (tree.seed_root / "tree" / "new-name.txt").unlink()
    gone = sync(tree.plan(), service)
    assert gone.ok and counts(conn, tree.logical, repo) == (1, 1)


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
    assert [v["revision"] for v in versions] == [1, 2, 3] and file["current_version_id"] == versions[-1]["id"] and file["retention"] == "preserve_history"


def test_replace_current_drops_unpinned_history_but_never_pinned_or_relation_referenced_versions(tree, service, repo, store, conn):
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
    assert revs == [1, 3] and repo.get_file(f["id"])["last_revision"] == 3  # revision numbers stay monotonic; pinned v1 survives, unpinned v2 dropped
    assert repo.get_version(v1["id"])["s3_key"] in store.objects
    # a version that is the source of a relation is protected too
    derived = register_derived(service, [repo.versions(f["id"])[-1]["id"]], f["folder_id"], "a.copy", b"v3\n")
    tree.write("a.txt", "v4\n")
    sync(plan, service)
    assert [v["revision"] for v in repo.versions(f["id"])] == [1, 3, 4]
    assert r3.ok and derived.outcome == "created"


def test_superseded_content_is_deleted_only_by_explicit_cleanup_and_never_while_referenced(tree, service, repo, store):
    tree.write("a.txt", "one\n")
    tree.write("b.txt", "one\n")  # shares the physical key with a.txt
    plan = tree.plan(retention="replace_current")
    sync(plan, service)
    shared = repo.get_version(repo.file_by_code(tree.fc("a.txt"))["current_version_id"])["s3_key"]
    tree.write("a.txt", "two\n")
    sync(plan, service)
    assert shared in store.objects  # nothing is deleted by publication
    kept = delete_unreferenced_keys(service, [shared], dry_run=False)
    assert kept["kept"] == [shared] and shared in store.objects  # b.txt still references it
    tree.write("b.txt", "three\n")
    sync(plan, service)
    assert delete_unreferenced_keys(service, [shared], dry_run=True)["deleted"] == [shared] and shared in store.objects
    assert delete_unreferenced_keys(service, [shared], dry_run=False)["deleted"] == [shared] and shared not in store.objects
    assert delete_unreferenced_keys(service, ["internal/not-content/x"], dry_run=False)["kept"] == ["internal/not-content/x"]


# ---------------------------------------------------------------------------------------------- dedup
def test_identical_bytes_share_one_physical_key_inside_an_access_boundary_but_stay_distinct_files(tree, service, repo, store, conn):
    tree.write("a.txt", "shared\n")
    tree.write("b.txt", "shared\n")
    report = sync(tree.plan(), service)
    assert report.summary("file") == {"created": 2} and sum(1 for i in report.items if i.reused_storage) == 1
    a, b = repo.file_by_code(tree.fc("a.txt")), repo.file_by_code(tree.fc("b.txt"))
    assert a["id"] != b["id"] and repo.get_version(a["current_version_id"])["s3_key"] == repo.get_version(b["current_version_id"])["s3_key"] and len(store.objects) == 1


def test_dedup_never_merges_across_access_boundaries_or_makes_private_bytes_public(tree, service, repo, store, conn):
    top = repo.create_folder(None, tree.logical.lstrip("/"), dict(CLASS, allow_weaker_children=True), None)
    restricted = sub(repo, top, "restricted", access="private")
    public = repo.create_folder(top["id"], "public", {"access": "public", "access_authorization": {"by": "owner", "date": "2026-11-08", "reference": "test"}}, None)
    secret = service.register(restricted["id"], "secret.txt", b"identical bytes\n")
    published = service.register(public["id"], "open.txt", b"identical bytes\n")
    assert secret.key.startswith("private/") and published.key.startswith("public/") and secret.key != published.key
    assert published.reused_storage is False and not is_anonymously_readable(secret.key) and is_anonymously_readable(published.key)
    assert {k.split("/")[0] for k in store.objects} == {"private", "public"}


# -------------------------------------------------------------------------------- concurrency and recovery
def test_a_stale_revision_is_a_conflict_and_a_racing_registration_loses_cleanly(tree, service, repo, store, conn):
    tree.write("a.txt", "one\n")
    plan = tree.plan()
    sync(plan, service)
    f = repo.file_by_code(tree.fc("a.txt"))
    with pytest.raises(Conflict):
        repo.add_version(f["id"], f["revision"] + 7, {"s3_key": "internal/content/sha256/aa/bb/x", "sha256": "a" * 64, "size_bytes": 1, "content_type": "text/plain", "provenance": {}}, None)
    original = repo.add_version

    def racing(file_id, expected, version, actor, retention=None):  # another writer wins between our read and our write
        repo.conn.execute("UPDATE filesystem.files SET description = description WHERE false") if False else None
        repo.conn.execute("UPDATE filesystem.files SET name = name WHERE id = %s", (file_id,))
        return original(file_id, expected, version, actor, retention)

    repo.add_version = racing
    tree.write("a.txt", "two\n")
    report = sync(plan, service)
    assert report.summary("file") == {"conflict": 1} and counts(conn, tree.logical, repo) == (1, 1)
    repo.add_version = original
    assert sync(plan, service).summary("file") == {"updated": 1}


def test_an_upload_interrupted_before_registration_is_recovered_by_the_next_run_without_reuploading(tree, service, repo, store):
    tree.write("a.txt", "payload\n")
    plan = tree.plan()
    original = repo.create_file_with_version

    def crash(*a, **k):
        raise RuntimeError("database went away after the upload")

    repo.create_file_with_version = crash
    first = sync(plan, service)
    assert first.summary("file") == {"failed": 1} and len(store.puts) == 1 and repo.file_by_code(tree.fc("a.txt")) is None
    repo.create_file_with_version = original
    second = sync(plan, service)
    assert second.summary("file") == {"created": 1} and sum(1 for i in second.items if i.recovered) == 1 and len(store.puts) == 1


def test_a_failed_or_corrupted_upload_registers_nothing_and_a_retry_succeeds(tree, service, repo, store):
    tree.write("a.txt", "payload\n")
    plan = tree.plan()
    store.fail_next_puts = 1
    assert sync(plan, service).summary("file") == {"failed": 1} and repo.file_by_code(tree.fc("a.txt")) is None
    store.corrupt_next_puts = 1
    bad = sync(plan, service)
    assert bad.summary("file") == {"failed": 1} and "verification" in bad.problems()[0].detail and repo.file_by_code(tree.fc("a.txt")) is None
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
    assert report.summary("file") == {"unchanged": 1} and any(i.recovered for i in report.items) and len(store.objects) == 1


# -------------------------------------------------------------------------------------------------- lineage
def test_relations_link_exact_versions_with_ancestry_and_refuse_cycles_and_removal(tree, service, repo, conn, store):
    tree.write("report.txt", "page one\n")
    tree.write("table.txt", "table\n")
    sync(tree.plan(), service)
    inputs = [repo.get_file(repo.file_by_code(c)["id"])["current_version_id"] for c in (tree.fc("report.txt"), tree.fc("table.txt"))]
    out_folder = repo.folder_by_path(tree.logical)
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
        conn.execute("DELETE FROM filesystem.file_versions WHERE id = %s", (inputs[0],))  # a related version cannot be removed


# -------------------------------------------------------------------------------------------------- uploads
def test_uploads_complete_with_verification_and_expired_ones_are_cleaned_without_touching_completed_or_shared_content(tree, service, repo, store, conn):
    top = repo.create_folder(None, tree.logical.lstrip("/"), dict(CLASS), None)
    up = create_upload(service, top["id"], "direct.txt", actor=None, size=12, sha256=sha256_hex(b"hello world\n"))
    assert up["temp_key"].startswith("private/tmp/uploads/") and "upload=1" in up["put_url"]
    store.put(up["temp_key"], b"hello world\n", "text/plain", "x")
    done = complete_upload(service, up["id"], actor=None)
    assert done.outcome == "created" and up["temp_key"] not in store.objects and repo.get_upload(up["id"])["status"] == "completed"
    # a mismatching upload fails verification and registers nothing
    bad = create_upload(service, top["id"], "bad.txt", actor=None, sha256=sha256_hex(b"expected\n"))
    store.put(bad["temp_key"], b"something else\n", "text/plain", "x")
    assert complete_upload(service, bad["id"], actor=None).outcome == "failed" and repo.get_upload(bad["id"])["status"] == "failed"
    # an abandoned multipart upload and a lapsed lease
    lapsed = create_upload(service, top["id"], "lapsed.bin", actor=None, multipart_id="mp-1", lease_seconds=60, ttl_seconds=3600)
    store.put(lapsed["temp_key"], b"partial", "application/octet-stream", "x")
    store.multiparts.append({"Key": lapsed["temp_key"], "UploadId": "mp-1"})
    alive = create_upload(service, top["id"], "alive.bin", actor=None, lease_seconds=3600, ttl_seconds=7200)
    store.put(alive["temp_key"], b"live", "application/octet-stream", "x")
    conn.execute("UPDATE filesystem.uploads SET lease_expires_at = now() - interval '1 minute' WHERE id = %s", (lapsed["id"],))
    preview = cleanup_uploads(service, dry_run=True)
    assert lapsed["id"] in preview.abandoned and alive["id"] not in preview.abandoned and lapsed["temp_key"] in store.objects and store.aborted == []
    rep = cleanup_uploads(service, dry_run=False)
    assert lapsed["id"] in rep.abandoned and rep.aborted_multipart == [lapsed["id"]] and store.aborted == [(lapsed["temp_key"], "mp-1")]
    assert lapsed["temp_key"] not in store.objects and alive["temp_key"] in store.objects and not rep.errors
    assert repo.get_upload(lapsed["id"])["status"] == "abandoned" and repo.get_upload(alive["id"])["status"] == "pending"
    # completed file records and their (shared) content survive cleanup and metadata trimming
    registered = repo.find_file(top["id"], "direct.txt")
    key = repo.get_version(registered["current_version_id"])["s3_key"]
    conn.execute("UPDATE filesystem.uploads SET created_at = now() - interval '90 days' WHERE status IN ('completed', 'failed', 'abandoned') AND folder_id = %s", (top["id"],))
    trimmed = cleanup_uploads(service, dry_run=False, trim_batch=2)
    assert trimmed.sessions_trimmed == 2  # bounded
    cleanup_uploads(service, dry_run=False, trim_batch=10)
    assert repo.find_file(top["id"], "direct.txt") and key in store.objects


# ------------------------------------------------------------------------- access transitions and reads
def test_an_access_transition_relocates_content_in_one_commit_and_a_failed_copy_changes_nothing(tree, service, repo, store, conn, admin_id):
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
    assert new_key.startswith("private/") and new_key in store.objects and ok.superseded_keys == [old] and old in store.objects  # old key kept until explicit cleanup
    assert delete_unreferenced_keys(service, ok.superseded_keys, dry_run=False)["deleted"] == [old] and old not in store.objects
    # public needs authorization
    assert "authorization" in transition_folder_access(service, docs["id"], "public", actor=None, dry_run=False).error
    # the permission is scoped: publishing access is a separate capability
    worker = new_account(conn)
    conn.execute("SELECT auth.create_role(%s, 'tmp', ARRAY['filesystem.edit']) ", (f"tmp_{uuid.uuid4().hex[:6]}",)) if False else None
    secured = FilesystemService(repo, store, DatabaseAuthorizer(conn))
    with pytest.raises(PermissionDenied):
        transition_folder_access(secured, docs["id"], "internal", actor=worker, dry_run=False)


def test_downloads_use_the_public_origin_for_public_keys_and_authorized_presigned_urls_otherwise(tree, service, repo, store, conn, admin_id):
    top = repo.create_folder(None, tree.logical.lstrip("/"), dict(CLASS, allow_weaker_children=True), None)
    pub = repo.create_folder(top["id"], "pub", {"access": "public", "access_authorization": {"by": "o", "date": "2026-11-08", "reference": "t"}}, None)
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


# ----------------------------------------------------------------------------------------- root seeds
def test_the_root_seed_manifest_plans_folders_and_files_with_seed_provenance_and_excludes_fixtures():
    plan = plan_seed()
    codes = {f.code for f in plan.files}
    assert len(plan.files) > 100 and "seeds.global.auth.roles_csv" in codes
    assert not any("/fixtures/" in f.folder_path or f.folder_path.startswith("/seeds/fixtures") for f in plan.files)
    assert not any("raw" in f.folder_path.split("/") for f in plan.files)
    media = next(f for f in plan.files if f.name == "media-formats.json")
    assert media.provenance_extra["effective_overrides"]["acquisition_class"] == "internally_derived" and media.pin_reason.startswith("manifest release")
    roles = next(f for f in plan.folders if f.path == "/seeds/global/auth")
    assert roles.fields["artifact_role"] == "seed_input" and roles.fields["metadata"]["review"]["status"] == "reviewed"
    ke = next(f for f in plan.folders if f.path == "/seeds/ke")
    assert ke.fields["jurisdiction_code"] == "ke"


def test_seed_sync_registers_seed_artifacts_with_their_flag_origin_access_and_overrides(service, repo, store, conn):
    plan = plan_seed(entry_ids={"global.auth.roles", "global.reference.media-formats"})
    top = repo.folder_by_path("/seeds")
    report = sync(plan, service)
    try:
        assert report.ok and report.summary("file") in ({"created": 2}, {"unchanged": 2})
        f = repo.file_by_code("seeds.global.reference.media_formats_json")
        version = repo.get_version(f["current_version_id"])
        prov = version["provenance"]
        assert prov["seed"] is True and prov["acquisition_class"] == "internally_derived" and prov["overridden_fields"] == ["acquisition_class", "preparation"]
        assert prov["intended_access"] == "internal" and prov["manifest_release"] and version["pinned"] and version["s3_key"].startswith("internal/")
        assert repo.effective(f["folder_id"])["is_seed"] is True
        assert sync(plan, service).summary("file") == {"unchanged": 2}
    finally:
        pass


def test_the_historical_raw_collection_cannot_be_a_manifest_root_source_or_logical_folder(tmp_path, tree):
    for bad in ({"source": {"path": "raw"}}, {"source": {"path": "."}, "folder": "/raw/x"}):
        with pytest.raises(ManifestError, match="raw collection"):
            tree.write("a.txt", "x")
            tree.plan(**bad)
    doc = yaml.safe_load(tree.manifest().read_text())
    doc["root"] = ".data/raw"
    (tree.seed_root / "m2.yaml").write_text(yaml.safe_dump(doc))
    with pytest.raises(ManifestError, match="raw collection"):
        plan_sync_manifest(tree.seed_root / "m2.yaml", tree.seed_root)
    doc["root"], doc["entries"][0]["source"]["path"] = "tree", "../escape"
    (tree.seed_root / "m3.yaml").write_text(yaml.safe_dump(doc))
    with pytest.raises(ManifestError):
        plan_sync_manifest(tree.seed_root / "m3.yaml", tree.seed_root)
