"""Registrar: puts bytes at the key their placement implies, then records the folders, file and version that describe them.

Order matters. The bytes are stored and verified first; the database rows are written afterwards in one transaction. A crash
between the two leaves bytes at their readable key and no row, which the next run recognises (`recovered`) and completes.
Which folders, names, access and retention apply is the caller's decision (see `Placement`); nothing here names one.
"""

from __future__ import annotations

import io
from pathlib import Path

from mzizi_filesystem import catalog
from mzizi_filesystem.access import check_key_matches_access
from mzizi_filesystem.codes import child_code
from mzizi_filesystem.features.placement.contracts import Placement, PlacementPlan
from mzizi_filesystem.features.placement.errors import PlacementError
from mzizi_filesystem.features.placement.plan import plan_placement
from mzizi_filesystem.features.register.contracts import (
    DuplicatePolicy,
    NameConflictPolicy,
    Outcome,
    RegisterRequest,
    RegisterResult,
)
from mzizi_filesystem.features.register.storage import holds, write
from mzizi_filesystem.features.registry.ports import RegistryRepository
from mzizi_filesystem.hashing import hash_file, hash_stream
from mzizi_filesystem.keys import NameError_, archive_key, current_key, sibling_name
from mzizi_filesystem.shared.config import FilesystemConfig
from mzizi_filesystem.shared.contracts import FileRecord, FolderRecord, NewFile, NewFolder, NewVersion, VersionRecord
from mzizi_filesystem.store import ObjectStore, StoreError


class Registrar:
    def __init__(self, repository: RegistryRepository, store: ObjectStore, config: FilesystemConfig) -> None:
        self._repo, self._store, self._config = repository, store, config

    def register(self, request: RegisterRequest, source: Path | bytes) -> RegisterResult:
        try:
            return self._register(request, source)
        except (NameError_, PlacementError, catalog.ContentTypeError) as problem:
            return _result(Outcome.FAILED, detail=str(problem))
        except (StoreError, OSError) as problem:
            return _result(Outcome.FAILED, detail=str(problem))

    def _register(self, request: RegisterRequest, source: Path | bytes) -> RegisterResult:
        placement = request.placement
        plan = plan_placement(placement, self._repo, self._config)
        sha, size, head = _digest(source)
        name = placement.file_name
        _, content_type = catalog.resolve(name, head, request.declared_type)
        folder = plan.steps[-1].existing if not plan.creates else None
        file = self._repo.find_file(folder.id, name) if folder else None
        current = self._repo.get_version(file.current_version_id) if file and file.current_version_id else None
        same = bool(current and current.sha256 == sha and current.size_bytes == size)
        original = request.original_filename or name
        if file is not None and not same and request.on_name_conflict is not NameConflictPolicy.NEW_VERSION:
            if request.on_name_conflict is NameConflictPolicy.REJECT:
                return _result(Outcome.CONFLICT, detail=f"{name} already exists in the folder with different content")
            name = sibling_name(name, sha)
            file = self._repo.find_file(folder.id, name) if folder else None
            current = self._repo.get_version(file.current_version_id) if file and file.current_version_id else None
            same = bool(current and current.sha256 == sha and current.size_bytes == size)
        folder_path = "/" + "/".join(step.name for step in plan.steps)
        access = placement.access
        key = current_key(access.value, folder_path, name)
        check_key_matches_access(key, access.value)
        if key.startswith(self._config.protected_prefixes):
            raise StoreError(f"{key} is inside a protected archive and cannot be registered")
        base = _result(Outcome.PLANNED, key=key, sha256=sha, size_bytes=size)
        if same and file is not None and current is not None:
            return self._unchanged(base, file, current, source, content_type, request.dry_run)
        twin = self._repo.find_same_content(access, sha, size, file.id if file else None)
        if twin is not None and file is None:
            if request.on_duplicate is DuplicatePolicy.REUSE_EXISTING:
                return base.model_copy(
                    update={
                        "outcome": Outcome.DUPLICATE,
                        "detail": f"identical content is already registered at {twin.s3_key}",
                        "file_id": twin.file_id,
                        "version_id": twin.id,
                        "revision": twin.revision,
                        "key": twin.s3_key,
                        "duplicate_of_key": twin.s3_key,
                    }
                )
            if request.on_duplicate is DuplicatePolicy.REJECT:
                return _result(Outcome.CONFLICT, detail=f"identical content is already registered at {twin.s3_key}")
        keep_old = bool(file and current and (file.retention.value == "preserve_history" or current.pinned))
        old_key = archive_key(access.value, folder_path, name, current.revision) if keep_old and current else None
        if request.dry_run:
            return base.model_copy(update={"archived_key": old_key, "duplicate_of_key": twin.s3_key if twin else None})
        recovered, copied = self._place(key, source, sha, size, content_type, current, old_key, twin)
        with self._repo.transaction():
            folder = self._create_missing_folders(plan, placement)
            created = file is None
            if file is None:
                code = request.file_code or child_code(folder.code, name) or name
                file = self._repo.create_file(
                    NewFile(folder_id=folder.id, code=code, name=name, retention=placement.retention)
                )
                revision = 1
            else:
                revision = max(v.revision for v in self._repo.list_versions(file.id)) + 1
            version = self._repo.add_version(
                NewVersion(
                    file_id=file.id,
                    revision=revision,
                    s3_key=key,
                    sha256=sha,
                    size_bytes=size,
                    content_type=content_type,
                    original_filename=original,
                    access=access,
                    pinned=request.pinned,
                    provenance=request.provenance,
                )
            )
            self._repo.set_current_version(file.id, version.id)
            if current is not None:
                if old_key is not None:
                    self._repo.repoint_version(current.id, old_key)
                elif not current.pinned:
                    self._repo.retire_version(current.id)
        return base.model_copy(
            update={
                "outcome": Outcome.CREATED if created else Outcome.UPDATED,
                "file_id": file.id,
                "version_id": version.id,
                "revision": version.revision,
                "archived_key": old_key,
                "duplicate_of_key": twin.s3_key if twin else None,
                "recovered": recovered,
                "server_copied": copied,
            }
        )

    def _create_missing_folders(self, plan: PlacementPlan, placement: Placement) -> FolderRecord:
        parent: FolderRecord | None = None
        for step in plan.steps:
            parent = step.existing or self._repo.create_folder(
                NewFolder(
                    parent_id=parent.id if parent else None,
                    code=step.code,
                    name=step.name,
                    access=placement.access,
                    authorization=placement.authorization,
                    role_id=placement.role_id,
                )
            )
        assert parent is not None
        return parent

    def _unchanged(
        self,
        base: RegisterResult,
        file: FileRecord,
        current: VersionRecord,
        source: Path | bytes,
        content_type: str,
        dry_run: bool,
    ) -> RegisterResult:
        found = base.model_copy(
            update={"file_id": file.id, "version_id": current.id, "revision": current.revision, "key": current.s3_key}
        )
        if holds(self._store, current.s3_key, current.sha256, current.size_bytes):
            return found.model_copy(update={"outcome": Outcome.UNCHANGED})
        if dry_run:
            return found.model_copy(update={"detail": "registered content is missing from the store"})
        if self._store.head(current.s3_key) is not None:
            raise StoreError(
                f"{current.s3_key} holds bytes that differ from its registered version; resolve it by hand"
            )
        write(self._store, current.s3_key, source, current.sha256, current.size_bytes, content_type)
        return found.model_copy(
            update={
                "outcome": Outcome.UNCHANGED,
                "recovered": True,
                "detail": "registered content was missing from the store; re-uploaded and verified",
            }
        )

    def _place(
        self,
        key: str,
        source: Path | bytes,
        sha: str,
        size: int,
        content_type: str,
        current: VersionRecord | None,
        old_key: str | None,
        twin: VersionRecord | None,
    ) -> tuple[bool, bool]:
        """Put the new bytes at the readable key. Returns (recovered, server_copied)."""
        store = self._store
        if holds(store, key, sha, size):  # an interrupted earlier run already wrote them
            if old_key and current and not holds(store, old_key, current.sha256, current.size_bytes):
                raise StoreError(
                    f"{key} already holds the new bytes but the superseded revision is missing from {old_key}"
                )
            return True, False
        if store.head(key) is not None:
            if not (current and current.s3_key == key and holds(store, key, current.sha256, current.size_bytes)):
                raise StoreError(
                    f"{key} holds an object that is not the registered current version; refusing to overwrite it"
                )
            if old_key and not holds(store, old_key, current.sha256, current.size_bytes):
                if store.head(old_key) is not None:
                    raise StoreError(f"{old_key} holds unexpected bytes; refusing to overwrite it")
                store.copy(key, old_key, current.content_type, current.sha256)
                if not holds(store, old_key, current.sha256, current.size_bytes):
                    raise StoreError(f"verification failed after preserving the superseded revision at {old_key}")
        if twin is not None and holds(store, twin.s3_key, sha, size):
            store.copy(twin.s3_key, key, content_type, sha)
            if not holds(store, key, sha, size):
                raise StoreError(f"verification failed after copying {twin.s3_key} to {key}")
            return False, True
        write(store, key, source, sha, size, content_type)
        return False, False


def _digest(source: Path | bytes) -> tuple[str, int, bytes]:
    if isinstance(source, Path):
        sha, size = hash_file(source)
        with open(source, "rb") as handle:
            return sha, size, handle.read(4096)
    sha, size = hash_stream(io.BytesIO(source))
    return sha, size, source[:4096]


def _result(
    outcome: Outcome,
    *,
    detail: str = "",
    key: str | None = None,
    sha256: str | None = None,
    size_bytes: int | None = None,
) -> RegisterResult:
    return RegisterResult(
        outcome=outcome,
        detail=detail,
        file_id=None,
        version_id=None,
        revision=None,
        key=key,
        sha256=sha256,
        size_bytes=size_bytes,
        duplicate_of_key=None,
        archived_key=None,
        recovered=False,
        server_copied=False,
    )
