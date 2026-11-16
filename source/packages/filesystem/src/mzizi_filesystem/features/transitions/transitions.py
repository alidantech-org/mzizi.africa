"""Relocation: moves, renames and access changes. The object key is the registry path, so when rows change, bytes follow.

Inside one transaction the rows change, every live version whose stored key no longer equals its computed key is copied to the
new key and verified, and the version is repointed. If a copy fails the transaction rolls back and nothing changed. Old keys
are not deleted here: they are returned, and `delete_unreferenced_keys` removes only those no live version still references.
"""

from __future__ import annotations

from pydantic import Field

from mzizi_filesystem.features.keys.keys import InvalidNameError, archive_key, check_name, current_key, is_protected
from mzizi_filesystem.features.register.storage import holds
from mzizi_filesystem.features.registry.ports import RegistryRepository
from mzizi_filesystem.features.store.store import ObjectStore, StoreError
from mzizi_filesystem.shared.config import FilesystemConfig
from mzizi_filesystem.shared.contracts import (
    Access,
    FileChange,
    FileRecord,
    FolderChange,
    FolderRecord,
    Frozen,
    VersionRecord,
)


class RelocationError(ValueError):
    """The change is not allowed: a missing target, a name already taken, a cycle or a protected key."""


class RelocationReport(Frozen):
    target_id: str
    change: str
    versions_relocated: int = Field(ge=0)
    copied_keys: tuple[str, ...]
    #: Keys that no longer describe any version; safe to remove with `delete_unreferenced_keys`.
    superseded_keys: tuple[str, ...]


class Relocator:
    def __init__(self, repository: RegistryRepository, store: ObjectStore, config: FilesystemConfig) -> None:
        self._repo, self._store, self._config = repository, store, config

    def change_access(self, folder_id: str, access: Access, authorization: str) -> RelocationReport:
        """Give a folder and everything below it a new access class. Changing access needs a recorded authorization."""
        if not authorization.strip():
            raise RelocationError("changing access needs a recorded authorization")
        folder = self._folder(folder_id)
        change = FolderChange(name=None, parent_id=None, clear_parent=False, access=access, authorization=authorization)
        return self._relocate(folder, f"access {folder.access.value} -> {access.value}", change, access)

    def move_folder(self, folder_id: str, new_parent_id: str | None, new_name: str | None) -> RelocationReport:
        folder = self._folder(folder_id)
        name = new_name or folder.name
        self._check_name(name)
        parent = self._folder(new_parent_id) if new_parent_id else None
        if parent is not None and (parent.id == folder.id or folder.id in self._ancestor_ids(parent)):
            raise RelocationError("a folder cannot move into itself or its own descendant")
        if self._repo.find_folder(parent.id if parent else None, name) not in (None, folder):
            raise RelocationError(f"{name!r} already exists in the target folder")
        change = FolderChange(
            name=new_name,
            parent_id=parent.id if parent else None,
            clear_parent=parent is None,
            access=None,
            authorization=None,
        )
        return self._relocate(folder, f"move {folder.name} -> {name}", change, None)

    def move_file(self, file_id: str, new_folder_id: str | None, new_name: str | None) -> RelocationReport:
        file = self._repo.get_file(file_id)
        if file is None:
            raise RelocationError(f"file {file_id} does not exist")
        name = new_name or file.name
        self._check_name(name)
        folder_id = new_folder_id or file.folder_id
        self._folder(folder_id)
        if self._repo.find_file(folder_id, name) not in (None, file):
            raise RelocationError(f"{name!r} already exists in the target folder")
        report = RelocationReport(
            target_id=file.id,
            change=f"move file {file.name} -> {name}",
            versions_relocated=0,
            copied_keys=(),
            superseded_keys=(),
        )
        with self._repo.transaction():
            self._repo.update_file(file.id, FileChange(name=new_name, folder_id=new_folder_id))
            return self._rekey(report, (self._repo.get_file(file.id) or file,), None)

    def delete_unreferenced_keys(self, keys: tuple[str, ...]) -> int:
        """Delete only keys no live version references; protected keys are refused by the store. Returns the count."""
        doomed = [key for key in keys if not self._repo.key_referenced(key)]
        for key in doomed:
            if is_protected(key, self._config.protected_prefixes):
                raise StoreError(f"refusing to delete protected key {key}")
        return self._store.delete_many(doomed) if doomed else 0

    # ---- internals -------------------------------------------------------------------------------------
    def _relocate(
        self, folder: FolderRecord, label: str, change: FolderChange, access: Access | None
    ) -> RelocationReport:
        report = RelocationReport(
            target_id=folder.id, change=label, versions_relocated=0, copied_keys=(), superseded_keys=()
        )
        with self._repo.transaction():
            subtree = self._subtree(folder.id)
            self._repo.update_folder(folder.id, change)
            if access is not None:
                for below in subtree[1:]:
                    self._repo.update_folder(
                        below.id,
                        FolderChange(name=None, parent_id=None, clear_parent=False, access=access, authorization=None),
                    )
            files = tuple(file for member in subtree for file in self._repo.files_in(member.id))
            return self._rekey(report, files, access)

    def _rekey(
        self, report: RelocationReport, files: tuple[FileRecord, ...], access: Access | None
    ) -> RelocationReport:
        copied: list[str] = []
        superseded: list[str] = []
        for file in files:
            versions = self._repo.list_versions(file.id)
            current = file.current_version_id
            folder_path = self._folder_path(file.folder_id)
            for version in versions:
                new_access = access or version.access
                expected = (
                    current_key(new_access, folder_path, file.name)
                    if version.id == current
                    else archive_key(new_access, folder_path, file.name, version.revision)
                )
                if expected == version.s3_key and new_access is version.access:
                    continue
                self._copy(version, expected)
                self._repo.update_version(version.id, expected, new_access)
                copied.append(expected)
                if expected != version.s3_key:
                    superseded.append(version.s3_key)
        return report.model_copy(
            update={
                "versions_relocated": len(copied),
                "copied_keys": tuple(copied),
                "superseded_keys": tuple(superseded),
            }
        )

    def _copy(self, version: VersionRecord, new_key: str) -> None:
        if is_protected(new_key, self._config.protected_prefixes):
            raise StoreError(f"{new_key} is inside a protected archive")
        if new_key == version.s3_key:
            return
        if holds(self._store, new_key, version.sha256, version.size_bytes):
            return
        if self._store.head(new_key) is not None:
            raise StoreError(f"{new_key} already holds different bytes; refusing to overwrite it")
        self._store.copy(version.s3_key, new_key, version.content_type, version.sha256)
        if not holds(self._store, new_key, version.sha256, version.size_bytes):
            raise StoreError(f"verification failed after copying {version.s3_key} to {new_key}")

    def _subtree(self, folder_id: str) -> tuple[FolderRecord, ...]:
        root = self._folder(folder_id)
        found, frontier = [root], [root]
        while frontier:
            for child in self._repo.child_folders(frontier.pop().id):
                found.append(child)
                frontier.append(child)
        return tuple(found)

    def _folder(self, folder_id: str) -> FolderRecord:
        folder = self._repo.get_folder(folder_id)
        if folder is None:
            raise RelocationError(f"folder {folder_id} does not exist")
        return folder

    def _ancestor_ids(self, folder: FolderRecord) -> set[str]:
        ids: set[str] = set()
        while folder.parent_id is not None:
            ids.add(folder.parent_id)
            folder = self._folder(folder.parent_id)
        return ids

    def _folder_path(self, folder_id: str) -> str:
        names: list[str] = []
        folder: FolderRecord | None = self._folder(folder_id)
        while folder is not None:
            names.append(folder.name)
            folder = self._folder(folder.parent_id) if folder.parent_id else None
        return "/" + "/".join(reversed(names))

    @staticmethod
    def _check_name(name: str) -> None:
        try:
            check_name(name)
        except InvalidNameError as problem:
            raise RelocationError(str(problem)) from problem
