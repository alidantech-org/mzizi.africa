"""Seed publication against mocked S3: created, unchanged, updated, deduplicated, recovered, conflict and failed outcomes."""
from __future__ import annotations

import pytest
from conftest import FULL, build_seed_root

from mzizi_filesystem import JsonLedgerRegistry, MemoryObjectStore, MemoryRegistry, publish_seeds, sha256_hex


def run(root, store, registry, **kwargs):
    return publish_seeds(store, registry, seed_root=root, dry_run=kwargs.pop("dry_run", False), **kwargs)


def test_dry_run_plans_and_writes_nothing(seed_root):
    store, registry = MemoryObjectStore(), MemoryRegistry()
    report = run(seed_root, store, registry, dry_run=True)
    assert report.ok and report.dry_run
    assert report.summary() == {"planned": 2}
    assert store.objects == {} and registry.events() == [] and registry.get_item("seed/g.a/global/a.csv") is None


def test_apply_uploads_verifies_and_registers_with_provenance(seed_root):
    store, registry = MemoryObjectStore(), MemoryRegistry()
    report = run(seed_root, store, registry)
    assert report.ok and report.summary() == {"created": 2}
    assert all(o.verified for o in report.outcomes)
    item = registry.get_item("seed/g.a/global/a.csv")
    assert item.seed is True and item.mode == "versioned" and item.access == "internal"
    prov = item.provenance
    assert prov["acquisition_class"] == "static_curated" and prov["preparation"] == "human_prepared" and prov["intended_access"] == "internal"
    assert prov["manifest_release"] == "r1" and prov["artifact_sha256"] == sha256_hex(b"code\nx\n")
    assert prov["resolved_from"]["role"] == "global/_folder.yaml" and prov["generator"]["model"] is None
    key = item.current["key"]
    assert key.startswith("internal/seeds/") and store.objects[key][0] == b"code\nx\n" and key in store.objects


def test_rerun_with_unchanged_inputs_is_idempotent(seed_root):
    store, registry = MemoryObjectStore(), MemoryRegistry()
    run(seed_root, store, registry)
    puts = len(store.puts)
    again = run(seed_root, store, registry)
    assert again.summary() == {"unchanged": 2} and len(store.puts) == puts


def test_identical_bytes_are_deduplicated_within_an_access_boundary_but_identities_stay_distinct(tmp_path):
    root = build_seed_root(tmp_path, {"global/a.csv": "same\n", "global/b.csv": "same\n"}, [{"id": "g.a", "path": "global/a.csv"}, {"id": "g.b", "path": "global/b.csv"}])
    store, registry = MemoryObjectStore(), MemoryRegistry()
    report = run(root, store, registry)
    assert report.summary() == {"created": 1, "deduplicated": 1}
    assert len(store.objects) == 1
    a, b = registry.get_item("seed/g.a/global/a.csv"), registry.get_item("seed/g.b/global/b.csv")
    assert a.identity != b.identity and a.current["key"] == b.current["key"]


def test_dedup_never_merges_across_access_boundaries(tmp_path):
    root = build_seed_root(tmp_path, {"global/a.csv": "same\n", "global/r/b.csv": "same\n"}, [{"id": "g.a", "path": "global/a.csv"}, {"id": "g.b", "path": "global/r/b.csv"}], extra_folders={"global/r/_folder.yaml": "access: restricted\n"})
    store, registry = MemoryObjectStore(), MemoryRegistry()
    assert run(root, store, registry).summary() == {"created": 2}
    assert {k.split("/")[0] for k in store.objects} == {"internal", "restricted"}


def test_changed_bytes_in_the_same_release_are_a_conflict_and_nothing_is_overwritten(seed_root):
    store, registry = MemoryObjectStore(), MemoryRegistry()
    run(seed_root, store, registry)
    original_keys = set(store.objects)
    (seed_root / "global" / "a.csv").write_text("code\nCHANGED\n")
    report = run(seed_root, store, registry)
    assert not report.ok and report.count("conflict") == 1 and report.count("unchanged") == 1
    assert "immutable" in next(o for o in report.outcomes if o.outcome == "conflict").detail
    assert set(store.objects) == original_keys


def test_a_new_release_registers_a_new_immutable_version_and_keeps_the_old_one(tmp_path):
    root = build_seed_root(tmp_path, {"global/a.csv": "v1\n"}, [{"id": "g.a", "path": "global/a.csv"}], release="r1")
    store, registry = MemoryObjectStore(), MemoryRegistry()
    run(root, store, registry)
    (root / "global" / "a.csv").write_text("v2\n")
    build_seed_root(tmp_path, {}, [{"id": "g.a", "path": "global/a.csv"}], release="r2")
    report = run(root, store, registry)
    assert report.ok and report.summary() == {"created": 1, "unchanged": 0} or report.summary() == {"created": 1}
    item = registry.get_item("seed/g.a/global/a.csv")
    assert set(item.versions) == {"r1", "r2"} and item.versions["r1"]["sha256"] != item.versions["r2"]["sha256"]
    assert item.versions["r1"]["key"] in store.objects  # the pinned release is never mutated or removed


def test_current_mode_moves_a_pointer_without_a_new_version_and_old_bytes_remain(tmp_path):
    root = build_seed_root(tmp_path, {"global/a.csv": "one\n"}, [{"id": "g.a", "path": "global/a.csv", "publication_mode": "current"}])
    store, registry = MemoryObjectStore(), MemoryRegistry()
    assert run(root, store, registry).summary() == {"created": 1}
    first = registry.get_item("seed/g.a/global/a.csv")
    (root / "global" / "a.csv").write_text("two\n")
    report = run(root, store, registry)
    assert report.summary() == {"updated": 1}
    second = registry.get_item("seed/g.a/global/a.csv")
    assert second.revision == first.revision + 1 and second.versions == {} and second.current["sha256"] != first.current["sha256"]
    assert first.current["key"] in store.objects and second.current["key"] in store.objects


def test_a_concurrent_pointer_update_is_a_conflict_not_a_lost_write(tmp_path):
    root = build_seed_root(tmp_path, {"global/a.csv": "one\n"}, [{"id": "g.a", "path": "global/a.csv", "publication_mode": "current"}])
    store, registry = MemoryObjectStore(), MemoryRegistry()
    run(root, store, registry)
    (root / "global" / "a.csv").write_text("two\n")
    original_save = registry.save_item

    def racing_save(item, expected):  # another writer bumps the revision between read and write
        stored = registry.get_item(item.identity)
        stored.revision += 1
        registry._items[item.identity] = stored
        return original_save(item, expected)

    registry.save_item = racing_save
    report = run(root, store, registry)
    assert report.count("conflict") == 1 and "concurrent change" in report.outcomes[0].detail


def test_an_interrupted_upload_is_recovered_without_reuploading(seed_root):
    store, registry = MemoryObjectStore(), MemoryRegistry()
    first = run(seed_root, store, registry)
    key = registry.get_item("seed/g.a/global/a.csv").current["key"]
    fresh_registry = MemoryRegistry()  # the earlier run uploaded but its registration was lost
    puts_before = len(store.puts)
    report = run(seed_root, store, fresh_registry)
    assert first.ok and report.summary() == {"recovered": 2} and len(store.puts) == puts_before
    assert fresh_registry.get_item("seed/g.a/global/a.csv").current["key"] == key


def test_a_failed_upload_registers_nothing_and_a_retry_succeeds(seed_root):
    store, registry = MemoryObjectStore(), MemoryRegistry()
    store.fail_next_puts = 1
    report = run(seed_root, store, registry)
    assert report.count("failed") == 1 and report.count("created") == 1 and not report.ok
    failed = next(o for o in report.outcomes if o.outcome == "failed")
    assert registry.get_item(failed.identity) is None
    retry = run(seed_root, store, registry)
    assert retry.ok and retry.summary() == {"created": 1, "unchanged": 1}


def test_corrupted_upload_fails_verification_and_is_never_reported_as_success(seed_root):
    store, registry = MemoryObjectStore(), MemoryRegistry()
    store.corrupt_next_puts = 1
    report = run(seed_root, store, registry)
    bad = next(o for o in report.outcomes if o.outcome == "failed")
    assert "verification failed" in bad.detail and not bad.verified and registry.get_item(bad.identity) is None


def test_a_lock_that_no_longer_matches_the_file_is_refused(seed_root, monkeypatch):
    from mzizi_manifest import seed_registry as seeds

    real = seeds.build_lock

    def stale(manifest, root):
        lock = real(manifest, root)
        (root / "global" / "a.csv").write_text("changed after lock\n")
        return lock

    monkeypatch.setattr(seeds, "build_lock", stale)
    report = run(seed_root, MemoryObjectStore(), MemoryRegistry())
    assert report.count("failed") >= 1 and "lock" in next(o for o in report.outcomes if o.outcome == "failed").detail


def test_public_requires_authorization_and_public_keys_live_under_public(tmp_path):
    folders = {"global/pub/_folder.yaml": "access: public\nauthorization: {by: owner, date: 2026-11-08, reference: decision-1}\n"}
    root = build_seed_root(tmp_path, {"global/pub/a.csv": "p\n"}, [{"id": "g.pub", "path": "global/pub/a.csv"}], extra_folders=folders)
    store, registry = MemoryObjectStore(), MemoryRegistry()
    report = run(root, store, registry)
    assert report.ok and next(iter(store.objects)).startswith("public/")
    unauthorized = build_seed_root(tmp_path / "x", {"global/pub/a.csv": "p\n"}, [{"id": "g.pub", "path": "global/pub/a.csv"}], extra_folders={"global/pub/_folder.yaml": "access: public\n"})
    bad = run(unauthorized, MemoryObjectStore(), MemoryRegistry())
    assert not bad.ok and "authorization" in bad.outcomes[0].detail


def test_reclassifying_a_registered_item_is_a_conflict_not_a_silent_move(tmp_path):
    root = build_seed_root(tmp_path, {"global/a.csv": "x\n"}, [{"id": "g.a", "path": "global/a.csv"}])
    store, registry = MemoryObjectStore(), MemoryRegistry()
    run(root, store, registry)
    build_seed_root(tmp_path, {}, [{"id": "g.a", "path": "global/a.csv"}], release="r2", extra_folders={"global/_folder.yaml": "scope: {kind: global}\n" + FULL + "access: restricted\n"})
    report = run(root, store, registry)
    assert report.count("conflict") == 1 and "reclassification" in report.outcomes[0].detail


def test_fixed_key_overwrite_is_explicit_journaled_and_refuses_shared_keys(tmp_path):
    entry = {"id": "g.a", "path": "global/a.csv", "publication_mode": "fixed_key", "fixed_key": "internal/seeds/fixed/a.csv", "allow_overwrite": True}
    root = build_seed_root(tmp_path, {"global/a.csv": "one\n"}, [entry])
    store, registry = MemoryObjectStore(), MemoryRegistry()
    assert run(root, store, registry).summary() == {"created": 1}
    (root / "global" / "a.csv").write_text("two\n")
    report = run(root, store, registry)
    assert report.summary() == {"updated": 1} and store.objects["internal/seeds/fixed/a.csv"][0] == b"two\n"
    assert store.objects["internal/seeds/fixed/a.csv"][3] == "no-cache"
    assert [e["kind"] for e in registry.events(report.outcomes[0].identity)][-2:] == ["overwrite_started", "overwrite_completed"]
    # a second identity using the same key must be refused
    registry.save_item(__import__("mzizi_filesystem").ItemRecord("seed/other", "versioned", "internal", True, {}, current={"sha256": "x", "size": 1, "key": "internal/seeds/fixed/a.csv"}), None)
    (root / "global" / "a.csv").write_text("three\n")
    shared = run(root, store, registry)
    assert shared.count("conflict") == 1 and "shared" in shared.outcomes[0].detail
    assert store.objects["internal/seeds/fixed/a.csv"][0] == b"two\n"
    no_flag = build_seed_root(tmp_path / "n", {"global/a.csv": "x\n"}, [{**entry, "allow_overwrite": False}])
    assert run(no_flag, MemoryObjectStore(), MemoryRegistry()).count("failed") == 1


def test_an_invalid_manifest_blocks_publication(tmp_path):
    root = build_seed_root(tmp_path, {"global/a.csv": "x\n", "global/stray.csv": "y\n"}, [{"id": "g.a", "path": "global/a.csv"}])
    store = MemoryObjectStore()
    report = run(root, store, MemoryRegistry())
    assert not report.ok and store.objects == {} and "not covered" in report.outcomes[0].detail


def test_the_ledger_registry_persists_and_resumes_across_instances(seed_root, tmp_path):
    ledger = tmp_path.with_name(tmp_path.name + "-ledger") / "registry.json"
    store = MemoryObjectStore()
    run(seed_root, store, JsonLedgerRegistry(ledger))
    again = run(seed_root, store, JsonLedgerRegistry(ledger))
    assert again.summary() == {"unchanged": 2} and ledger.exists()
    assert JsonLedgerRegistry(ledger).get_item("seed/g.a/global/a.csv").revision == 1
    assert [e["kind"] for e in JsonLedgerRegistry(ledger).events()].count("created") == 2


def test_a_real_seed_dry_run_of_the_repository_plans_every_artifact_without_writing():
    store, registry = MemoryObjectStore(), MemoryRegistry()
    report = publish_seeds(store, registry, dry_run=True)
    assert report.ok and report.summary() == {"planned": report.count("planned")} and report.count("planned") > 100
    assert store.objects == {} and registry.events() == []
