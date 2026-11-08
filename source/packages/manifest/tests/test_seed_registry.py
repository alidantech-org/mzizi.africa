"""Seed registry: real-registry validity, folder-metadata inheritance and manifest rules (synthetic seed roots)."""
from __future__ import annotations

import json
import re
from pathlib import Path

import pytest

from mzizi_manifest import seed_registry as reg
from mzizi_manifest.paths import REPO_ROOT, SEED_ROOT

BASE = "access: internal\nallow_weaker_children: true\n"
FULL = "role: seed_input\nacquisition_class: static_curated\npreparation: human_prepared\n"


def make(tmp_path: Path, files: dict[str, str]) -> Path:
    for path, text in files.items():
        target = tmp_path / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(text, encoding="utf-8")
    return tmp_path


# ------------------------------------------------------------------------ the real registry
def test_real_manifest_folder_metadata_consumers_and_dependencies_validate():
    result = reg.validate_manifest()
    assert result.errors == []
    assert len(result.manifest["entries"]) > 40


def test_the_lock_is_current_and_never_claims_an_upload():
    result = reg.validate_manifest()
    lock = reg.build_lock(result.manifest)
    assert reg.dump_lock(lock) == (SEED_ROOT / "manifest.lock.json").read_text(encoding="utf-8")
    for entry in lock["entries"]:
        for file in entry["files"]:
            assert file["upload_status"] == "not_uploaded"
            assert file["object_key"].startswith(f"{file['effective']['access']}/seeds/")


def test_every_adopted_artifact_has_effective_origin_preparation_and_access():
    for file in reg.artifact_files():
        effective, errors = reg.resolve_effective(file)
        assert errors == []
        assert effective["role"] and effective["acquisition_class"] and effective["preparation"] and effective["access"]
        assert effective["access"] != "public"


def test_deeper_folders_and_explicit_overrides_win_and_record_where_they_came_from():
    media, _ = reg.resolve_effective("global/reference/media-formats.json")
    assert media["acquisition_class"] == "internally_derived"
    assert "overrides/media-formats.json" in media["resolved_from"]["acquisition_class"]
    assert media["resolved_from"]["access"] == "_folder.yaml"
    assert media["scope"] == {"kind": "global"}
    assert reg.resolve_effective("global/reference/site-tags.json")[0]["acquisition_class"] == "static_curated"
    assert reg.resolve_effective("ke/governance/ke-governance-structure.json")[0]["scope"] == {"kind": "jurisdiction", "code": "ke"}


def test_test_fixtures_are_classified_but_are_not_manifest_entries():
    files = reg.fixture_files()
    assert len(files) > 50
    covered = {f for e in reg.load_manifest()["entries"] for f in reg.expand_entry(e)}
    for file in files:
        effective, errors = reg.resolve_effective(file)
        assert errors == [] and effective["role"] == "test_fixture" and effective["access"] == "internal"
        assert file not in covered
    assert reg.resolve_effective("fixtures/extraction/geoboundaries/KEN-ADM1-metadata.json")[0]["acquisition_class"] == "externally_collected"


def test_no_fixture_sample_example_or_data_directory_sits_inside_source_code():
    offenders = []
    for root in (REPO_ROOT / "source" / "packages", REPO_ROOT / "source" / "backend", REPO_ROOT / "source" / "apps" / "api"):
        for path in root.rglob("*"):
            if not path.is_dir() or {"node_modules", ".venv", "__pycache__", ".git"} & set(path.parts):
                continue
            if path.name in {"fixtures", "samples", "examples", "pilots", "mappings"} or (path.name == "data" and path.parent.name == "tests"):
                offenders.append(str(path.relative_to(REPO_ROOT)))
    assert offenders == []


def test_no_secret_and_no_large_file_sit_under_seed():
    for file in reg.artifact_files():
        assert (SEED_ROOT / file).stat().st_size < reg.MAX_BYTES
    assert "/generated/" in (SEED_ROOT / ".gitignore").read_text()


# ------------------------------------------------------------------------ rules on synthetic roots
def test_nearest_folder_wins_per_field_and_ancestors_fill_the_rest(tmp_path):
    root = make(tmp_path, {"_folder.yaml": BASE, "global/_folder.yaml": "scope: {kind: global}\n" + FULL, "global/a/_folder.yaml": "preparation: ai_prepared\n", "global/a/x.csv": "a\n", "global/y.csv": "a\n"})
    effective, _ = reg.resolve_effective("global/a/x.csv", root)
    assert effective["preparation"] == "ai_prepared" and effective["role"] == "seed_input" and effective["access"] == "internal"
    assert effective["resolved_from"]["preparation"] == "global/a/_folder.yaml"
    assert reg.resolve_effective("global/y.csv", root)[0]["preparation"] == "human_prepared"


def test_missing_origin_is_flagged_and_missing_access_defaults_to_non_public(tmp_path):
    bad = make(tmp_path / "a", {"global/_folder.yaml": "scope: {kind: global}\nrole: seed_input\n", "global/x.csv": "a\n"})
    assert "no acquisition_class resolved" in "".join(reg.resolve_effective("global/x.csv", bad)[1])
    ok = make(tmp_path / "b", {"global/_folder.yaml": "scope: {kind: global}\n" + FULL, "global/x.csv": "a\n"})
    effective, _ = reg.resolve_effective("global/x.csv", ok)
    assert effective["access"] == "internal" and effective["access_defaulted"] is True


def test_a_nested_folder_cannot_weaken_a_restriction_and_public_needs_authorization(tmp_path):
    root = make(tmp_path / "a", {"_folder.yaml": "access: restricted\n", "global/_folder.yaml": "scope: {kind: global}\n" + FULL, "global/p/_folder.yaml": "access: internal\n", "global/p/x.csv": "a\n"})
    assert "weakens access" in "".join(reg.resolve_effective("global/p/x.csv", root)[1])
    no_auth = make(tmp_path / "b", {"_folder.yaml": BASE, "global/_folder.yaml": "scope: {kind: global}\n" + FULL + "access: public\n", "global/x.csv": "a\n"})
    assert "public access needs an authorization block" in "".join(reg.validate_descriptors(no_auth))
    ok = make(tmp_path / "c", {"_folder.yaml": BASE, "global/_folder.yaml": "scope: {kind: global}\n" + FULL + "access: public\nauthorization: {by: owner, date: 2026-11-08, reference: test}\n", "global/x.csv": "a\n"})
    assert reg.validate_descriptors(ok) == []
    assert reg.resolve_effective("global/x.csv", ok)[0]["access"] == "public"


def test_stronger_nested_folders_are_allowed_and_file_overrides_need_a_reason_and_cannot_publish(tmp_path):
    root = make(tmp_path / "a", {"_folder.yaml": BASE, "global/_folder.yaml": "scope: {kind: global}\n" + FULL, "global/s/_folder.yaml": "access: private\n", "global/s/x.csv": "a\n",
                                  "global/o/_folder.yaml": "overrides:\n  x.csv: {preparation: ai_prepared}\n", "global/o/x.csv": "a\n"})
    assert reg.resolve_effective("global/s/x.csv", root)[0]["access"] == "private"
    assert "override for x.csv needs a reason" in "".join(reg.validate_descriptors(root))
    pub = make(tmp_path / "b", {"_folder.yaml": BASE, "global/_folder.yaml": "scope: {kind: global}\n" + FULL, "global/o/_folder.yaml": "overrides:\n  x.csv: {access: public, reason: nope}\n", "global/o/x.csv": "a\n"})
    assert "cannot make a file public" in "".join(reg.validate_descriptors(pub))


def test_scope_must_match_the_top_level_folder(tmp_path):
    root = make(tmp_path, {"_folder.yaml": BASE, "ke/_folder.yaml": "scope: {kind: jurisdiction, code: za}\n" + FULL, "ke/x.csv": "a\n"})
    assert "does not match its top-level folder" in "".join(reg.resolve_effective("ke/x.csv", root)[1])


def test_manifest_rejects_traversal_unknown_loaders_duplicate_keys_and_uncovered_files(tmp_path):
    manifest = (
        "schema_version: 1\nrelease: t\nbucket: mzizi\nregion: us-east-1\nentries:\n"
        "  - {id: g.k, path: global/k.csv, media_type: text/csv, loader: auth.baseline, target: t, database_target_state: test_only, key_columns: [code], depends_on: [], consumers: [], sync_policy: x}\n"
        "  - {id: g.bad, path: ../outside.csv, media_type: text/csv, loader: shell.exec, target: t, database_target_state: test_only, depends_on: [g.missing], consumers: [], sync_policy: x}\n"
    )
    root = make(tmp_path, {"_folder.yaml": BASE, "global/_folder.yaml": "scope: {kind: global}\n" + FULL, "global/k.csv": "code,v\na,1\na,2\n", "global/stray.csv": "a\n", "manifest.yaml": manifest})
    errors = "\n".join(reg.validate_manifest(root, root).errors)
    for expected in ("duplicate natural key", "loader shell.exec is not allowlisted", "escapes the seed root", "depends on unknown entry g.missing", "global/stray.csv: not covered by any manifest entry"):
        assert expected in errors


def test_the_auth_baseline_files_resolve_to_internal_human_and_ai_assisted():
    effective, _ = reg.resolve_effective("global/auth/roles.csv")
    assert (effective["role"], effective["preparation"], effective["access"]) == ("seed_input", "human_and_ai_assisted", "internal")
