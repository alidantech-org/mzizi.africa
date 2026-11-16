"""Turns a caller's placement request into the folders to reuse and create. Pure planning: nothing is written."""

from __future__ import annotations

from mzizi_filesystem.codes import child_code, code_segment, is_code
from mzizi_filesystem.features.placement.contracts import FolderStep, Placement, PlacementPlan
from mzizi_filesystem.features.placement.errors import PlacementError
from mzizi_filesystem.features.registry.ports import FolderLookup
from mzizi_filesystem.keys import NameError_, check_name
from mzizi_filesystem.shared.config import FilesystemConfig
from mzizi_filesystem.shared.contracts import FolderRecord


def plan_placement(placement: Placement, repository: FolderLookup, config: FilesystemConfig) -> PlacementPlan:
    """Walk the requested folders from the top, reusing those that exist and planning the rest.

    Names are checked, codes are derived from names, and a new folder whose access differs from its parent's must carry the
    placement's recorded authorization. The package never invents a folder: every name comes from the caller.
    """
    try:
        check_name(placement.file_name)
        for index, name in enumerate(placement.folders):
            check_name(name, root=index == 0)
    except NameError_ as problem:
        raise PlacementError(str(problem)) from problem
    if placement.folders[0] in config.reserved_roots:
        raise PlacementError(f"{placement.folders[0]!r} is a reserved top-level folder")
    steps: list[FolderStep] = []
    parent: FolderRecord | None = None
    searching = True
    for name in placement.folders:
        found = repository.find_folder(parent.id if parent else None, name) if searching else None
        code = found.code if found else _code(parent, name)
        steps.append(FolderStep(name=name, code=code, existing=found))
        if found is None:
            searching = False
            if parent is not None and parent.access != placement.access and not placement.authorization:
                raise PlacementError(
                    f"folder {name!r} would be {placement.access.value} under a {parent.access.value} parent "
                    "without a recorded authorization"
                )
        parent = found if found else _stand_in(parent, name, code, placement)
    return PlacementPlan(steps=tuple(steps), file_name=placement.file_name)


def _code(parent: FolderRecord | None, name: str) -> str:
    code = code_segment(name) if parent is None else child_code(parent.code, name)
    if not code or not is_code(code):
        raise PlacementError(f"folder name {name!r} does not produce a valid code")
    return code


def _stand_in(parent: FolderRecord | None, name: str, code: str, placement: Placement) -> FolderRecord:
    """A not-yet-created folder, so the next step can derive its code and check its access against it."""
    return FolderRecord(
        id=f"planned:{code}",
        parent_id=parent.id if parent else None,
        code=code,
        name=name,
        access=placement.access,
        authorization=placement.authorization,
        role_id=placement.role_id,
    )
