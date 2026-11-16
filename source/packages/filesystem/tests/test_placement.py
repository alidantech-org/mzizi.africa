"""Placement planning with an in-memory registry: caller-supplied folders, derived codes and the access rule."""

from __future__ import annotations

import pytest

from mzizi_filesystem.features.placement.contracts import Placement
from mzizi_filesystem.features.placement.errors import PlacementError
from mzizi_filesystem.features.placement.plan import plan_placement
from mzizi_filesystem.shared.config import FilesystemConfig
from mzizi_filesystem.shared.contracts import Access, FolderRecord, Retention

CONFIG = FilesystemConfig(
    bucket="b",
    region="r",
    public_endpoint=None,
    protected_prefixes=("public/raw/",),
    reserved_roots=("raw", "tmp"),
    temp_prefix="private/tmp/",
)


class Folders:
    def __init__(self, *folders: FolderRecord) -> None:
        self.items = list(folders)

    def find_folder(self, parent_id: str | None, name: str) -> FolderRecord | None:
        return next((f for f in self.items if f.parent_id == parent_id and f.name == name), None)


def folder(id: str, parent: str | None, code: str, name: str, access: Access = Access.PUBLIC) -> FolderRecord:
    return FolderRecord(
        id=id, parent_id=parent, code=code, name=name, access=access, authorization=None, role_id="role"
    )


def ask(*folders: str, access: Access = Access.PUBLIC, authorization: str | None = None) -> Placement:
    return Placement(
        folders=folders,
        file_name="report.pdf",
        access=access,
        retention=Retention.PRESERVE_HISTORY,
        role_id="role",
        authorization=authorization,
    )


def plan(placement: Placement, repo: Folders):
    return plan_placement(placement, repo, CONFIG)


def test_existing_folders_are_reused_and_missing_ones_are_planned_with_derived_codes() -> None:
    repo = Folders(folder("1", None, "kenya", "Kenya"))
    result = plan(ask("Kenya", "Budget Reports", "2025"), repo)
    assert [s.existing is not None for s in result.steps] == [True, False, False]
    assert [s.code for s in result.steps] == ["kenya", "kenya.budget-reports", "kenya.budget-reports.2025"]
    assert [s.name for s in result.creates] == ["Budget Reports", "2025"]


def test_the_package_invents_no_folder_names() -> None:
    result = plan(ask("anything", "the caller", "wants"), Folders())
    assert [s.name for s in result.steps] == ["anything", "the caller", "wants"]


def test_bad_names_and_reserved_roots_are_refused() -> None:
    with pytest.raises(PlacementError):
        plan(ask("Kenya", "a/b"), Folders())
    with pytest.raises(PlacementError, match="reserved"):
        plan(ask("raw", "x"), Folders())
    with pytest.raises(PlacementError):
        plan(ask("!!!"), Folders())


def test_a_new_folder_with_different_access_needs_a_recorded_authorization() -> None:
    repo = Folders(folder("1", None, "kenya", "Kenya", Access.PUBLIC))
    with pytest.raises(PlacementError, match="authorization"):
        plan(ask("Kenya", "Drafts", access=Access.PRIVATE), repo)
    ok = plan(ask("Kenya", "Drafts", access=Access.PRIVATE, authorization="owner approved drafts"), repo)
    assert [s.name for s in ok.creates] == ["Drafts"]
