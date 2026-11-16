"""An in-memory RegistryRepository for package tests: no database, same rules the port promises."""

from __future__ import annotations

from collections.abc import Iterator
from contextlib import contextmanager
from datetime import UTC, datetime

from mzizi_filesystem.shared.contracts import (
    Access,
    FileRecord,
    FolderRecord,
    NewFile,
    NewFolder,
    NewVersion,
    RelationRecord,
    VersionRecord,
)


class MemoryRegistry:
    def __init__(self) -> None:
        self.folders: dict[str, FolderRecord] = {}
        self.files: dict[str, FileRecord] = {}
        self.versions: dict[str, VersionRecord] = {}
        self.relations: list[RelationRecord] = []
        self.retired: list[str] = []
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
        data = version.model_dump(exclude={"provenance"})
        record = VersionRecord(id=self._id("ve"), verified_at=datetime.now(UTC), **data)
        self.versions[record.id] = record
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

    def add_relation(self, relation: RelationRecord) -> bool:
        if relation in self.relations:
            return False
        self.relations.append(relation)
        return True

    def relations_from(self, version_id: str) -> tuple[RelationRecord, ...]:
        return tuple(r for r in self.relations if r.source_version_id == version_id)

    def relations_to(self, version_id: str) -> tuple[RelationRecord, ...]:
        return tuple(r for r in self.relations if r.derived_version_id == version_id)
