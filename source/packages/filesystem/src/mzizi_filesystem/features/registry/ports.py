"""The persistence port of the registry. The engine implements it over its database; the package never opens a connection."""

from __future__ import annotations

from contextlib import AbstractContextManager
from typing import Protocol

from mzizi_filesystem.shared.contracts import FileRecord, FolderRecord, NewFolder, VersionRecord


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
