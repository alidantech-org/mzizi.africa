"""Registering bytes at caller-chosen placements: versions, retention, duplicates, recovery and lineage."""

from __future__ import annotations

import pytest
from memory_registry import MemoryRegistry

from mzizi_filesystem import MemoryObjectStore
from mzizi_filesystem.features.lineage.lineage import LineageError, ancestry, derivatives, relate
from mzizi_filesystem.features.placement.contracts import Placement
from mzizi_filesystem.features.register.contracts import (
    DuplicatePolicy,
    NameConflictPolicy,
    Outcome,
    RegisterRequest,
)
from mzizi_filesystem.features.register.registrar import Registrar
from mzizi_filesystem.shared.config import FilesystemConfig
from mzizi_filesystem.shared.contracts import Access, RelationRecord, Retention

CONFIG = FilesystemConfig(
    bucket="test",
    region="r",
    public_endpoint=None,
    protected_prefixes=("public/raw/",),
    reserved_roots=("tmp",),
    temp_prefix="private/tmp/",
)


def request(
    *folders: str,
    name: str = "report.csv",
    access: Access = Access.PUBLIC,
    retention: Retention = Retention.PRESERVE_HISTORY,
    **options,
) -> RegisterRequest:
    base = {
        "file_code": None,
        "declared_type": None,
        "original_filename": None,
        "provenance": {"task": "test"},
        "on_name_conflict": NameConflictPolicy.NEW_VERSION,
        "on_duplicate": DuplicatePolicy.KEEP_BOTH,
        "pinned": False,
        "dry_run": False,
    }
    placement = Placement(
        folders=folders or ("kenya", "budget"),
        file_name=name,
        access=access,
        retention=retention,
        role_id="role",
        authorization=None,
    )
    return RegisterRequest(placement=placement, **{**base, **options})


@pytest.fixture
def parts():
    repo, store = MemoryRegistry(), MemoryObjectStore(bucket="test")
    return repo, store, Registrar(repo, store, CONFIG)


def test_a_new_file_creates_folders_the_file_and_the_first_version_at_a_readable_key(parts) -> None:
    repo, store, registrar = parts
    result = registrar.register(request(), b"a,b\n1,2\n")
    assert result.outcome is Outcome.CREATED and result.revision == 1
    assert result.key == "public/kenya/budget/report.csv" and store.head(result.key) is not None
    assert sorted(f.code for f in repo.folders.values()) == ["kenya", "kenya.budget"]
    assert next(iter(repo.files.values())).current_version_id == result.version_id


def test_placement_is_the_callers_not_the_packages(parts) -> None:
    repo, _, registrar = parts
    registrar.register(request("somewhere", "else", "entirely"), b"x,y\n")
    assert sorted(f.name for f in repo.folders.values()) == ["else", "entirely", "somewhere"]


def test_identical_bytes_are_unchanged_and_a_missing_object_is_recovered(parts) -> None:
    _, store, registrar = parts
    first = registrar.register(request(), b"a\n1\n")
    again = registrar.register(request(), b"a\n1\n")
    assert again.outcome is Outcome.UNCHANGED and again.version_id == first.version_id and not again.recovered
    store.delete(first.key)
    healed = registrar.register(request(), b"a\n1\n")
    assert healed.outcome is Outcome.UNCHANGED and healed.recovered and store.head(first.key) is not None


def test_changed_bytes_make_a_new_revision_and_preserve_the_old_one_at_an_archive_key(parts) -> None:
    repo, store, registrar = parts
    registrar.register(request(), b"a\n1\n")
    updated = registrar.register(request(), b"a\n2\n")
    assert updated.outcome is Outcome.UPDATED and updated.revision == 2
    assert updated.archived_key == "public/kenya/budget/_versions/report.csv/r0001/report.csv"
    assert store.get(updated.archived_key) == b"a\n1\n" and store.get(updated.key) == b"a\n2\n"
    assert sorted(v.revision for v in repo.versions.values()) == [1, 2]


def test_replace_current_retires_the_superseded_version_unless_it_is_pinned(parts) -> None:
    repo, _, registrar = parts
    registrar.register(request(retention=Retention.REPLACE_CURRENT), b"a\n1\n")
    updated = registrar.register(request(retention=Retention.REPLACE_CURRENT), b"a\n2\n")
    assert updated.archived_key is None and len(repo.retired) == 1 and len(repo.versions) == 1
    registrar.register(request(retention=Retention.REPLACE_CURRENT, pinned=True), b"a\n3\n")
    kept = registrar.register(request(retention=Retention.REPLACE_CURRENT), b"a\n4\n")
    assert kept.archived_key is not None and len(repo.retired) == 2


def test_name_conflict_policies(parts) -> None:
    repo, _, registrar = parts
    registrar.register(request(), b"a\n1\n")
    assert (
        registrar.register(request(on_name_conflict=NameConflictPolicy.REJECT), b"a\n2\n").outcome is Outcome.CONFLICT
    )
    both = registrar.register(request(on_name_conflict=NameConflictPolicy.KEEP_BOTH), b"a\n2\n")
    assert both.outcome is Outcome.CREATED and "~" in both.key and len(repo.files) == 2


def test_duplicates_follow_the_policy_and_never_cross_access_classes(parts) -> None:
    repo, _, registrar = parts
    first = registrar.register(request("a"), b"same\n")
    copied = registrar.register(request("b"), b"same\n")
    assert copied.outcome is Outcome.CREATED and copied.server_copied and copied.duplicate_of_key == first.key
    assert (
        registrar.register(request("c", on_duplicate=DuplicatePolicy.REUSE_EXISTING), b"same\n").outcome
        is Outcome.DUPLICATE
    )
    assert registrar.register(request("d", on_duplicate=DuplicatePolicy.REJECT), b"same\n").outcome is Outcome.CONFLICT
    private = registrar.register(request("e", access=Access.PRIVATE), b"same\n")
    assert private.duplicate_of_key is None and not private.server_copied
    assert len(repo.files) == 3


def test_protected_prefixes_dry_runs_and_bad_content_are_refused_without_writing(parts) -> None:
    repo, store, registrar = parts
    assert registrar.register(request("public", "raw", "x"), b"a\n").outcome is Outcome.CREATED
    guarded = Registrar(repo, store, CONFIG.model_copy(update={"protected_prefixes": ("public/kenya/",)}))
    assert guarded.register(request(name="n.csv"), b"a\n").outcome is Outcome.FAILED
    planned = registrar.register(request("plan", dry_run=True), b"a\n")
    assert planned.outcome is Outcome.PLANNED and store.head(planned.key) is None
    assert not any(f.name == "plan" for f in repo.folders.values())
    bad = registrar.register(request(name="x.pdf"), b"not a pdf")
    assert bad.outcome is Outcome.FAILED and "signature" in bad.detail


def test_lineage_relates_exact_versions_and_refuses_cycles(parts) -> None:
    repo, _, registrar = parts
    raw = registrar.register(request("raw_src", name="a.csv"), b"a\n1\n")
    cleaned = registrar.register(request("clean", name="a.csv"), b"a\n11\n")
    final = registrar.register(request("final", name="a.csv"), b"a\n111\n")
    edge = lambda s, d: RelationRecord(
        source_version_id=s, derived_version_id=d, kind_id="derived", processing_provenance={}
    )
    assert relate(repo, edge(raw.version_id, cleaned.version_id)) is True
    assert relate(repo, edge(raw.version_id, cleaned.version_id)) is False
    relate(repo, edge(cleaned.version_id, final.version_id))
    assert [r.source_version_id for r in ancestry(repo, final.version_id, 10)] == [cleaned.version_id, raw.version_id]
    assert [r.derived_version_id for r in derivatives(repo, raw.version_id)] == [cleaned.version_id]
    with pytest.raises(LineageError, match="derivative"):
        relate(repo, edge(final.version_id, raw.version_id))
    with pytest.raises(LineageError, match="itself"):
        relate(repo, edge(raw.version_id, raw.version_id))
    with pytest.raises(LineageError, match="does not exist"):
        relate(repo, edge(raw.version_id, "missing"))
