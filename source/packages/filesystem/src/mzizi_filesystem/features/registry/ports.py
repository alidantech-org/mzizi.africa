"""The persistence port of the registry. The engine implements it over its database; the package never opens a connection."""

from __future__ import annotations

from contextlib import AbstractContextManager
from typing import Protocol

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

    def next_revision(self, file_id: str) -> int:
        """The next revision number of a file, counting retired versions so a revision is never reused."""
        ...

    def child_folders(self, parent_id: str | None) -> tuple[FolderRecord, ...]:
        """Live folders directly under a folder (`None` means the top of the registry)."""
        ...

    def files_in(self, folder_id: str) -> tuple[FileRecord, ...]:
        """Live files directly in a folder."""
        ...

    def update_folder(self, folder_id: str, change: FolderChange) -> FolderRecord: ...

    def update_file(self, file_id: str, change: FileChange) -> FileRecord: ...

    def update_version(self, version_id: str, s3_key: str, access: Access) -> VersionRecord:
        """Point a version at the key and access class that now describe where its bytes live."""
        ...

    def key_referenced(self, s3_key: str) -> bool:
        """True when any live version still points at this key."""
        ...
