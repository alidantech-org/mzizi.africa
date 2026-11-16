"""Registers a local directory tree under folders the caller names. The tree's own directory names become subfolders."""

from __future__ import annotations

from pathlib import Path

from pydantic import Field

from mzizi_filesystem.features.placement.contracts import Placement
from mzizi_filesystem.features.register.contracts import (
    DuplicatePolicy,
    NameConflictPolicy,
    Outcome,
    RegisterRequest,
)
from mzizi_filesystem.features.register.registrar import Registrar
from mzizi_filesystem.shared.contracts import Access, Frozen, Retention


class DirectorySpec(Frozen):
    #: Folder names the whole tree goes under, chosen by the caller from its task.
    base_folders: tuple[str, ...] = Field(min_length=1)
    access: Access
    retention: Retention
    role_id: str
    authorization: str | None
    skip_hidden: bool
    #: Recorded in each file's provenance so the registration can be traced to its sync.
    label: str
    created_by: dict[str, str]


class SyncItem(Frozen):
    relative_path: str
    outcome: Outcome
    detail: str


class SyncReport(Frozen):
    dry_run: bool
    items: tuple[SyncItem, ...]

    def count(self, outcome: Outcome) -> int:
        return sum(1 for item in self.items if item.outcome is outcome)

    @property
    def ok(self) -> bool:
        return all(item.outcome not in (Outcome.FAILED, Outcome.CONFLICT) for item in self.items)


def plan_directory(root: Path, spec: DirectorySpec) -> tuple[tuple[Path, Placement], ...]:
    """Every file under `root` with the placement it would get, in a stable order."""
    pairs: list[tuple[Path, Placement]] = []
    for path in sorted(p for p in root.rglob("*") if p.is_file()):
        relative = path.relative_to(root)
        if spec.skip_hidden and any(part.startswith(".") for part in relative.parts):
            continue
        folders = (*spec.base_folders, *relative.parts[:-1])
        pairs.append(
            (
                path,
                Placement(
                    folders=folders,
                    file_name=relative.name,
                    access=spec.access,
                    retention=spec.retention,
                    role_id=spec.role_id,
                    authorization=spec.authorization,
                ),
            )
        )
    return tuple(pairs)


def sync_directory(registrar: Registrar, root: Path, spec: DirectorySpec, *, dry_run: bool) -> SyncReport:
    items: list[SyncItem] = []
    for path, placement in plan_directory(root, spec):
        relative = str(path.relative_to(root))
        request = RegisterRequest(
            placement=placement,
            file_code=None,
            declared_type=None,
            original_filename=None,
            provenance={"sync": spec.label, "source_path": relative},
            created_by=spec.created_by,
            on_name_conflict=NameConflictPolicy.NEW_VERSION,
            on_duplicate=DuplicatePolicy.KEEP_BOTH,
            pinned=False,
            dry_run=dry_run,
        )
        result = registrar.register(request, path)
        items.append(SyncItem(relative_path=relative, outcome=result.outcome, detail=result.detail))
    return SyncReport(dry_run=dry_run, items=tuple(items))
