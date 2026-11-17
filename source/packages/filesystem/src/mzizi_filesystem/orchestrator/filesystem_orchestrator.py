"""FilesystemOrchestrator: everything the filesystem can do, behind one class with typed inputs and outputs.

The engine builds it with a configuration, a persistence adapter (`RegistryRepository`), an object store and a media catalog,
and registers it with the runtime. Which folders, names, access and retention apply is always the caller's decision.
"""

from __future__ import annotations

from pathlib import Path
from typing import BinaryIO

from mzizi_filesystem.features.download.download import DownloadLink, download_link, open_version
from mzizi_filesystem.features.media.catalog import MediaCatalog
from mzizi_filesystem.features.placement.contracts import Placement, PlacementPlan
from mzizi_filesystem.features.placement.plan import plan_placement
from mzizi_filesystem.features.register.contracts import RegisterRequest, RegisterResult
from mzizi_filesystem.features.register.registrar import Registrar
from mzizi_filesystem.features.register.storage import Source
from mzizi_filesystem.features.registry.ports import RegistryRepository
from mzizi_filesystem.features.store.store import ObjectStore
from mzizi_filesystem.features.sync.sync import DirectorySpec, SyncReport, sync_directory
from mzizi_filesystem.features.transitions.transitions import RelocationReport, Relocator
from mzizi_filesystem.features.upload.upload import UploadTicket, begin_upload, discard_upload, finish_upload
from mzizi_filesystem.shared.config import FilesystemConfig
from mzizi_filesystem.shared.contracts import Access, VersionRecord


class FilesystemOrchestrator:
    def __init__(
        self, config: FilesystemConfig, repository: RegistryRepository, store: ObjectStore, catalog: MediaCatalog
    ) -> None:
        self._config, self._repo, self._store = config, repository, store
        self._registrar = Registrar(repository, store, config, catalog)
        self._relocator = Relocator(repository, store, config)

    # ---- registering ------------------------------------------------------------------------------------
    def plan(self, placement: Placement) -> PlacementPlan:
        return plan_placement(placement, self._repo, self._config)

    def register(self, request: RegisterRequest, source: Source) -> RegisterResult:
        return self._registrar.register(request, source)

    def sync_directory(self, root: Path, spec: DirectorySpec, *, dry_run: bool) -> SyncReport:
        return sync_directory(self._registrar, root, spec, dry_run=dry_run)

    # ---- uploads and downloads --------------------------------------------------------------------------
    def begin_upload(self, file_name: str, content_type: str, expires_seconds: int) -> UploadTicket:
        return begin_upload(self._store, self._config, file_name, content_type, expires_seconds)

    def finish_upload(self, temp_key: str, request: RegisterRequest) -> RegisterResult:
        return finish_upload(self._registrar, self._store, self._config, temp_key, request)

    def discard_upload(self, temp_key: str) -> None:
        discard_upload(self._store, self._config, temp_key)

    def download_link(self, version_id: str, expires_seconds: int) -> DownloadLink:
        return download_link(self._repo, self._store, version_id, expires_seconds)

    def open_version(self, version_id: str) -> tuple[BinaryIO, VersionRecord]:
        return open_version(self._repo, self._store, version_id)

    # ---- relocation -------------------------------------------------------------------------------------
    def change_access(self, folder_id: str, access: Access, authorization: str) -> RelocationReport:
        return self._relocator.change_access(folder_id, access, authorization)

    def move_folder(self, folder_id: str, new_parent_id: str | None, new_name: str | None) -> RelocationReport:
        return self._relocator.move_folder(folder_id, new_parent_id, new_name)

    def move_file(self, file_id: str, new_folder_id: str | None, new_name: str | None) -> RelocationReport:
        return self._relocator.move_file(file_id, new_folder_id, new_name)

    def delete_unreferenced_keys(self, keys: tuple[str, ...]) -> int:
        return self._relocator.delete_unreferenced_keys(keys)

    # ---- runtime lifecycle ------------------------------------------------------------------------------
    def start(self) -> None:
        """Nothing to open: the repository and store belong to the caller."""

    def stop(self) -> None:
        """Nothing to close."""
