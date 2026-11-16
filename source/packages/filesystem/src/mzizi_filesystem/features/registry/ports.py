"""The persistence port of the registry. The engine implements it over its database; the package never opens a connection."""

from __future__ import annotations

from contextlib import AbstractContextManager
from typing import Protocol

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


class FolderLookup(Protocol):
    def find_folder(self, parent_id: str | None, name: str) -> FolderRecord | None:
        """The live folder called `name` directly under `parent_id` (`None` means the top of the registry)."""
        ...


class RegistryRepository(FolderLookup, Protocol):
    def transaction(self) -> AbstractContextManager[None]:
        """All writes of one logical operation share one transaction."""
        ...

    def get_folder(self, folder_id: str) -> FolderRecord | None: ...

    def create_folder(self, folder: NewFolder) -> FolderRecord: ...

    def get_file(self, file_id: str) -> FileRecord | None: ...

    def find_file(self, folder_id: str, name: str) -> FileRecord | None: ...

    def list_versions(self, file_id: str) -> tuple[VersionRecord, ...]:
        """Every version of a file, oldest revision first."""
        ...

    def create_file(self, file: NewFile) -> FileRecord: ...

    def add_version(self, version: NewVersion) -> VersionRecord: ...

    def set_current_version(self, file_id: str, version_id: str) -> FileRecord: ...

    def get_version(self, version_id: str) -> VersionRecord | None: ...

    def repoint_version(self, version_id: str, s3_key: str) -> VersionRecord:
        """A superseded version keeps its bytes but moves to its archive key."""
        ...

    def retire_version(self, version_id: str) -> None:
        """Remove a superseded version that retention does not keep. Never called for a pinned version."""
        ...

    def find_same_content(
        self, access: Access, sha256: str, size_bytes: int, excluding_file_id: str | None
    ) -> VersionRecord | None:
        """A version of another file with exactly these bytes in the same access class (dedup never crosses access)."""
        ...

    def add_relation(self, relation: RelationRecord) -> bool:
        """Record one relation; `False` when exactly this relation already exists."""
        ...

    def relations_from(self, version_id: str) -> tuple[RelationRecord, ...]:
        """Relations whose source is this version."""
        ...

    def relations_to(self, version_id: str) -> tuple[RelationRecord, ...]:
        """Relations whose derived version is this one."""
        ...
