"""The seed plan: the manifest and `_folder.yaml` descriptors decide every placement; nothing is hard-coded here."""

from __future__ import annotations

import pytest

from mzizi_engine.runtime.assembly.filesystem_seed import SeedPlanError, plan_seed
from mzizi_filesystem import Access, Retention
from mzizi_manifest.features.seeds import seed_registry as seeds
from mzizi_manifest.shared.paths import SEED_ROOT


def test_every_manifest_file_gets_a_placement_from_its_descriptors() -> None:
    items = plan_seed()
    manifest = seeds.load_manifest()
    base = tuple(part for part in str(manifest["logical_root"]).split("/") if part)
    assert len(items) > 50 and all((SEED_ROOT / item.path).is_file() for item in items)
    assert all(item.folders[: len(base)] == base and item.file_name == item.path.split("/")[-1] for item in items)
    for item in items[:20]:
        effective, _ = seeds.resolve_effective(item.path)
        assert effective is not None and item.access is Access(effective["access"]) and item.role == effective["role"]
    assert {item.retention for item in items} <= {Retention.PRESERVE_HISTORY, Retention.REPLACE_CURRENT}


def test_provenance_traces_each_file_to_its_manifest_entry_and_release() -> None:
    item = plan_seed()[0]
    assert item.provenance["manifest_entry"] == item.entry_id and item.provenance["path"] == item.path
    assert item.provenance["seed_release"] == str(seeds.load_manifest()["release"])


def test_a_plan_can_be_limited_to_entries_and_unknown_entries_are_refused() -> None:
    first = plan_seed()[0].entry_id
    limited = plan_seed(entries=[first])
    assert limited and {item.entry_id for item in limited} == {first}
    with pytest.raises(SeedPlanError, match="unknown manifest entries"):
        plan_seed(entries=["no.such.entry"])
