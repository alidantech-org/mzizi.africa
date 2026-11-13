"""Root seed manifest: planning, registration of real seed artifacts and the single-manifest rule."""

from __future__ import annotations

import pytest
from fs_helpers import sync

from mzizi_engine.filesystem import ManifestError, load_plan, plan_seed


def test_the_root_seed_manifest_plans_folders_and_files_with_seed_provenance_and_excludes_fixtures():
    plan = plan_seed()
    codes = {f.code for f in plan.files}
    assert len(plan.files) > 100 and "seed.global.auth.roles_csv" in codes
    assert not any("/_fixtures" in f.folder_path or "/_examples" in f.folder_path for f in plan.files)
    assert not any("raw" in f.folder_path.split("/") for f in plan.files)
    media = next(f for f in plan.files if f.name == "media-formats.json")
    assert media.provenance_extra["effective_overrides"][
        "acquisition_class"
    ] == "internally_derived" and media.pin_reason.startswith("manifest release")
    roles = next(f for f in plan.folders if f.path == "/seed/global/auth")
    assert roles.fields["artifact_role"] == "seed_input" and roles.fields["metadata"]["review"]["status"] == "reviewed"
    ke = next(f for f in plan.folders if f.path == "/seed/countries/ke")
    assert ke.fields["jurisdiction_code"] == "ke"


def test_seed_sync_registers_seed_artifacts_with_their_flag_origin_access_and_overrides(service, repo, store, conn):
    plan = plan_seed(entry_ids={"global.auth.roles", "global.reference.media-formats"})
    report = sync(plan, service)
    try:
        assert report.ok and report.summary("file") in ({"created": 2}, {"unchanged": 2})
        f = repo.file_by_code("seed.global.reference.media_formats_json")
        version = repo.get_version(f["current_version_id"])
        prov = version["provenance"]
        assert (
            prov["seed"] is True
            and prov["acquisition_class"] == "internally_derived"
            and prov["overridden_fields"] == ["acquisition_class", "preparation"]
        )
        assert (
            prov["intended_access"] == "internal"
            and prov["manifest_release"]
            and version["pinned"]
            and version["s3_key"].startswith("internal/")
        )
        assert repo.effective(f["folder_id"])["is_seed"] is True
        assert sync(plan, service).summary("file") == {"unchanged": 2}
    finally:
        pass


def test_only_the_root_seed_manifest_is_synchronized_and_reserved_roots_are_refused(tmp_path, tree):
    tree.write("a.txt", "x")
    for reserved in ("/raw", "/tmp", "/content"):
        with pytest.raises(ManifestError):
            tree.plan(logical_root=reserved)
    other = tree.seed_root.parent / f"{tree.code}.yaml"  # outside the seed root, so it is not a stray seed file
    other.write_text(tree.manifest().read_text())
    with pytest.raises(ManifestError, match="can be synchronized"):
        load_plan(other, tree.seed_root)
    assert [f.name for f in load_plan(tree.seed_root / "manifest.yaml", tree.seed_root).files] == ["a.txt"]
