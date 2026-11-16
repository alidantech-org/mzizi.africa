"""Seed sync: register the files `seed/manifest.yaml` lists, in the folders its `_folder.yaml` files describe.

The manifest and the folder descriptors decide everything: the logical root, each file's folders, its access class, whether it
is versioned and pinned, and its role. This module only turns them into placements for the filesystem package. A dry run
(the default) plans and registers nothing; applying writes bytes to the object store and rows to the `filesystem` schema.
"""

from __future__ import annotations

from collections import Counter
from collections.abc import Sequence
from pathlib import Path

from pydantic import BaseModel, ConfigDict

from mzizi_filesystem import (
    Access,
    DuplicatePolicy,
    FilesystemOrchestrator,
    NameConflictPolicy,
    RegisterRequest,
    Retention,
)
from mzizi_filesystem.features.placement.contracts import Placement
from mzizi_manifest.features.seeds import seed_registry as seeds
from mzizi_manifest.shared.paths import SEED_ROOT


class SeedItem(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    path: str
    entry_id: str
    folders: tuple[str, ...]
    file_name: str
    access: Access
    retention: Retention
    pinned: bool
    role: str
    authorization: str
    provenance: dict[str, str]


class SeedPlanError(ValueError):
    """The manifest or a folder descriptor is invalid, or a requested entry does not exist."""


def plan_seed(root: Path = SEED_ROOT, entries: Sequence[str] = ()) -> tuple[SeedItem, ...]:
    """Every file to register, from the validated manifest; `entries` limits the plan to those manifest entry ids."""
    result = seeds.validate_manifest(root)
    if result.errors or result.manifest is None:
        raise SeedPlanError("; ".join(result.errors[:5]) or "the seed manifest could not be read")
    manifest = result.manifest
    wanted = set(entries)
    known = {entry["id"] for entry in manifest.get("entries") or []}
    if wanted - known:
        raise SeedPlanError(f"unknown manifest entries: {', '.join(sorted(wanted - known))}")
    base = tuple(part for part in str(manifest["logical_root"]).split("/") if part)
    items: list[SeedItem] = []
    for entry in manifest.get("entries") or []:
        if wanted and entry["id"] not in wanted:
            continue
        for path in seeds.expand_entry(entry, root):
            effective, problems = seeds.resolve_effective(path, root)
            if effective is None:
                raise SeedPlanError("; ".join(problems))
            parts = path.split("/")
            source = effective["resolved_from"].get("access", "default")
            items.append(
                SeedItem(
                    path=path,
                    entry_id=entry["id"],
                    folders=(*base, *parts[:-1]),
                    file_name=parts[-1],
                    access=Access(effective["access"]),
                    retention=Retention.PRESERVE_HISTORY
                    if seeds.entry_versioning(entry, manifest) == "versioned"
                    else Retention.REPLACE_CURRENT,
                    pinned=seeds.entry_pinned(entry, manifest),
                    role=effective["role"],
                    authorization=f"seed release {manifest['release']}: access {effective['access']} from {source}",
                    provenance={
                        "seed_release": str(manifest["release"]),
                        "manifest_entry": entry["id"],
                        "loader": str(entry.get("loader", "")),
                        "path": path,
                        "role": effective["role"],
                        "acquisition_class": effective["acquisition_class"],
                        "preparation": effective["preparation"],
                    },
                )
            )
    return tuple(items)


class SeedSyncReport(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    dry_run: bool
    release: str
    files: int
    outcomes: dict[str, int]
    problems: tuple[str, ...]

    @property
    def ok(self) -> bool:
        return not self.problems


def run_seed_sync(
    fs: FilesystemOrchestrator,
    items: Sequence[SeedItem],
    role_ids: dict[str, str],
    root: Path,
    *,
    apply: bool,
    release: str,
    created_by: dict[str, str],
) -> SeedSyncReport:
    """Register each planned file. Problems (a refused placement, bad bytes) are reported per file, not raised."""
    outcomes: Counter[str] = Counter()
    problems: list[str] = []
    for item in items:
        request = RegisterRequest(
            placement=Placement(
                folders=item.folders,
                file_name=item.file_name,
                access=item.access,
                retention=item.retention,
                role_id=role_ids.get(item.role, "dry-run"),
                authorization=item.authorization,
            ),
            file_code=None,
            declared_type=None,
            original_filename=None,
            provenance=item.provenance,
            created_by=created_by,
            on_name_conflict=NameConflictPolicy.NEW_VERSION,
            on_duplicate=DuplicatePolicy.KEEP_BOTH,
            pinned=item.pinned,
            dry_run=not apply,
        )
        result = fs.register(request, root / item.path)
        outcomes[result.outcome.value] += 1
        if result.outcome.value in ("failed", "conflict"):
            problems.append(f"{item.path}: {result.outcome.value}: {result.detail}")
    return SeedSyncReport(
        dry_run=not apply, release=release, files=len(items), outcomes=dict(outcomes), problems=tuple(problems[:50])
    )
