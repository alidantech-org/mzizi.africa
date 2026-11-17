"""An in-memory RegistryRepository for package tests: no database, same rules the port promises."""

from __future__ import annotations

from collections.abc import Iterator
from contextlib import contextmanager
from datetime import UTC, datetime

from mzizi_filesystem.shared.contracts import (
    Access,
    FileChange,
    FileRecord,
    FolderChange,
    FolderRecord,
    NewFile,
    NewFolder,
    NewVersion,
    VersionRecord,
)


class MemoryRegistry:
    def __init__(self) -> None:
        self.folders: dict[str, FolderRecord] = {}
        self.files: dict[str, FileRecord] = {}
        self.versions: dict[str, VersionRecord] = {}
        self.retired: list[str] = []
        self.ever: dict[str, int] = {}
        self._next = 0

    def _id(self, prefix: str) -> str:
        self._next += 1
        return f"{prefix}{self._next}"

    @contextmanager
    def transaction(self) -> Iterator[None]:
        yield

    def get_folder(self, folder_id: str) -> FolderRecord | None:
        return self.folders.get(folder_id)

    def find_folder(self, parent_id: str | None, name: str) -> FolderRecord | None:
        return next((f for f in self.folders.values() if f.parent_id == parent_id and f.name == name), None)

    def create_folder(self, folder: NewFolder) -> FolderRecord:
        record = FolderRecord(id=self._id("fo"), **folder.model_dump())
        self.folders[record.id] = record
        return record

    def get_file(self, file_id: str) -> FileRecord | None:
        return self.files.get(file_id)

    def find_file(self, folder_id: str, name: str) -> FileRecord | None:
        return next((f for f in self.files.values() if f.folder_id == folder_id and f.name == name), None)

    def create_file(self, file: NewFile) -> FileRecord:
        record = FileRecord(id=self._id("fi"), current_version_id=None, **file.model_dump())
        self.files[record.id] = record
        return record

    def add_version(self, version: NewVersion) -> VersionRecord:
        data = version.model_dump(exclude={"provenance", "created_by"})
        record = VersionRecord(id=self._id("ve"), verified_at=datetime.now(UTC), **data)
        self.versions[record.id] = record
        self.ever[version.file_id] = max(self.ever.get(version.file_id, 0), version.revision)
        return record

    def set_current_version(self, file_id: str, version_id: str) -> FileRecord:
        record = self.files[file_id].model_copy(update={"current_version_id": version_id})
        self.files[file_id] = record
        return record

    def get_version(self, version_id: str) -> VersionRecord | None:
        return self.versions.get(version_id)

    def list_versions(self, file_id: str) -> tuple[VersionRecord, ...]:
        return tuple(sorted((v for v in self.versions.values() if v.file_id == file_id), key=lambda v: v.revision))

    def repoint_version(self, version_id: str, s3_key: str) -> VersionRecord:
        record = self.versions[version_id].model_copy(update={"s3_key": s3_key})
        self.versions[version_id] = record
        return record

    def retire_version(self, version_id: str) -> None:
        self.retired.append(version_id)
        del self.versions[version_id]

    def find_same_content(
        self, access: Access, sha256: str, size_bytes: int, excluding_file_id: str | None
    ) -> VersionRecord | None:
        return next(
            (
                v
                for v in self.versions.values()
                if v.access is access
                and v.sha256 == sha256
                and v.size_bytes == size_bytes
                and v.file_id != excluding_file_id
            ),
            None,
        )

    def next_revision(self, file_id: str) -> int:
        return self.ever.get(file_id, 0) + 1

    def child_folders(self, parent_id: str | None) -> tuple[FolderRecord, ...]:
        return tuple(f for f in self.folders.values() if f.parent_id == parent_id)

    def files_in(self, folder_id: str) -> tuple[FileRecord, ...]:
        return tuple(f for f in self.files.values() if f.folder_id == folder_id)

    def update_folder(self, folder_id: str, change: FolderChange) -> FolderRecord:
        current = self.folders[folder_id]
        update: dict[str, object] = {}
        if change.name is not None:
            update["name"] = change.name
        if change.parent_id is not None or change.clear_parent:
            update["parent_id"] = change.parent_id
        if change.access is not None:
            update["access"] = change.access
        if change.authorization is not None:
            update["authorization"] = change.authorization
        self.folders[folder_id] = current.model_copy(update=update)
        return self.folders[folder_id]

    def update_file(self, file_id: str, change: FileChange) -> FileRecord:
        current = self.files[file_id]
        update: dict[str, object] = {}
        if change.name is not None:
            update["name"] = change.name
        if change.folder_id is not None:
            update["folder_id"] = change.folder_id
        self.files[file_id] = current.model_copy(update=update)
        return self.files[file_id]

    def update_version(self, version_id: str, s3_key: str, access: Access) -> VersionRecord:
        self.versions[version_id] = self.versions[version_id].model_copy(update={"s3_key": s3_key, "access": access})
        return self.versions[version_id]

    def key_referenced(self, s3_key: str) -> bool:
        return any(v.s3_key == s3_key for v in self.versions.values())
