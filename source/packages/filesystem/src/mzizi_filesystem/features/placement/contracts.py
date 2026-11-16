"""A placement is asked for by the caller: the engine decides folders, names and access from the task it is doing."""

from __future__ import annotations

from pydantic import Field

from mzizi_filesystem.shared.contracts import Access, FolderRecord, Frozen, Retention


class Placement(Frozen):
    #: Folder names from the top of the registry down. The caller derives them from its task and manifests.
    folders: tuple[str, ...] = Field(min_length=1)
    file_name: str
    access: Access
    retention: Retention
    #: Reference value stamped on every folder this placement creates.
    role_id: str
    #: Recorded justification, required when a new folder's access differs from its parent's.
    authorization: str | None


class FolderStep(Frozen):
    name: str
    code: str
    #: The folder when it already exists; `None` when the placement will create it.
    existing: FolderRecord | None


class PlacementPlan(Frozen):
    steps: tuple[FolderStep, ...]
    file_name: str

    @property
    def creates(self) -> tuple[FolderStep, ...]:
        return tuple(step for step in self.steps if step.existing is None)
