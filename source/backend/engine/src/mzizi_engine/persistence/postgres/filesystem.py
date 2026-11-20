"""The engine's implementation of the filesystem package's `RegistryRepository`, over the current Dryv `filesystem` tables.

Rows are parsed into the Dryv-generated row models (`api/schemas/postgres/filesystem`) and mapped to the package's records.
Dryv does not generate Python repositories yet, so the small amount of SQL lives here, and only here. When it can, this module
is replaced by generated code without the package changing.
"""

from __future__ import annotations

import json
from collections.abc import Iterator
from contextlib import contextmanager
from uuid import UUID, uuid4

from mzizi_engine.api.schemas.postgres.filesystem.entities.file_versions import FileVersionsRow
from mzizi_engine.api.schemas.postgres.filesystem.entities.files import FilesRow
from mzizi_engine.api.schemas.postgres.filesystem.entities.folders import FoldersRow
from mzizi_engine.persistence.postgres.connection import Connection
from mzizi_filesystem.shared.contracts import (
    Access,
    FileChange,
    FileRecord,
    FolderChange,
    FolderRecord,
    NewFile,
    NewFolder,
    NewVersion,
    Retention,
    VersionRecord,
)


def _authorization_out(stored: str | None) -> str:
    """The recorded authorization is stored as a JSON string value; read it back as the plain text it was written as."""
    if stored is None:
        return ""
    value = json.loads(stored)
    return value if isinstance(value, str) else stored


def _folder(row: FoldersRow) -> FolderRecord:
    return FolderRecord(
        id=str(row.id),
        parent_id=str(row.parent_id) if row.parent_id else None,
        code=row.code,
        name=row.name,
        access=Access(row.access.value),
        authorization=_authorization_out(row.authorization),
        role_id=str(row.role_id),
    )


def _file(row: FilesRow) -> FileRecord:
    return FileRecord(
        id=str(row.id),
        folder_id=str(row.folder_id),
        code=row.code,
        name=row.name,
        retention=Retention(row.retention.value),
        current_version_id=str(row.current_version_id) if row.current_version_id else None,
    )


def _version(row: FileVersionsRow) -> VersionRecord:
    return VersionRecord(
        id=str(row.id),
        file_id=str(row.file_id),
        revision=row.revision,
        s3_key=row.s3_key,
        sha256=row.sha256,
        size_bytes=row.size_bytes,
        content_type=row.content_type,
        original_filename=row.original_filename,
        access=Access(row.access.value),
        pinned=row.pinned,
        verified_at=row.verified_at,
    )


def _string_map(text: str) -> dict[str, str]:
    """Provenance columns hold JSON text; this is the parse boundary for them."""
    loaded: object = json.loads(text) if text else {}
    if not isinstance(loaded, dict):
        return {}
    return {str(key): str(value) for key, value in loaded.items()}


class PostgresRegistry:
    def __init__(self, conn: Connection) -> None:
        self._conn = conn

    @contextmanager
    def transaction(self) -> Iterator[None]:
        with self._conn.transaction():
            yield

    # ---- folders ---------------------------------------------------------------------------------------
    def get_folder(self, folder_id: str) -> FolderRecord | None:
        row = self._conn.execute(
            "SELECT * FROM filesystem.folders WHERE id = %s AND deleted_at IS NULL", (UUID(folder_id),)
        ).fetchone()
        return _folder(FoldersRow.model_validate(row)) if row else None

    def find_folder(self, parent_id: str | None, name: str) -> FolderRecord | None:
        parent = UUID(parent_id) if parent_id else None
        row = self._conn.execute(
            "SELECT * FROM filesystem.folders WHERE parent_id IS NOT DISTINCT FROM %s AND name = %s AND deleted_at IS NULL",
            (parent, name),
        ).fetchone()
        return _folder(FoldersRow.model_validate(row)) if row else None

    def child_folders(self, parent_id: str | None) -> tuple[FolderRecord, ...]:
        parent = UUID(parent_id) if parent_id else None
        rows = self._conn.execute(
            "SELECT * FROM filesystem.folders WHERE parent_id IS NOT DISTINCT FROM %s AND deleted_at IS NULL ORDER BY name",
            (parent,),
        ).fetchall()
        return tuple(_folder(FoldersRow.model_validate(row)) for row in rows)

    def create_folder(self, folder: NewFolder) -> FolderRecord:
        row = self._conn.execute(
            'INSERT INTO filesystem.folders (id, created_at, updated_at, version, parent_id, code, name, access, "authorization", role_id) '
            "VALUES (%s, now(), now(), 1, %s, %s, %s, %s, %s, %s) RETURNING *",
            (
                uuid4(),
                UUID(folder.parent_id) if folder.parent_id else None,
                folder.code,
                folder.name,
                folder.access.value,
                json.dumps(folder.authorization),
                UUID(folder.role_id),
            ),
        ).fetchone()
        return _folder(FoldersRow.model_validate(row))

    def update_folder(self, folder_id: str, change: FolderChange) -> FolderRecord:
        sets = ["updated_at = now()", "version = version + 1"]
        values: list[str | UUID | None] = []
        if change.name is not None:
            sets.append("name = %s")
            values.append(change.name)
        if change.parent_id is not None or change.clear_parent:
            sets.append("parent_id = %s")
            values.append(UUID(change.parent_id) if change.parent_id else None)
        if change.access is not None:
            sets.append("access = %s")
            values.append(change.access.value)
        if change.authorization is not None:
            sets.append('"authorization" = %s')
            values.append(json.dumps(change.authorization))
        row = self._conn.execute(
            f"UPDATE filesystem.folders SET {', '.join(sets)} WHERE id = %s AND deleted_at IS NULL RETURNING *",
            (*values, UUID(folder_id)),
        ).fetchone()
        return _folder(FoldersRow.model_validate(row))

    # ---- files -----------------------------------------------------------------------------------------
    def get_file(self, file_id: str) -> FileRecord | None:
        row = self._conn.execute(
            "SELECT * FROM filesystem.files WHERE id = %s AND deleted_at IS NULL", (UUID(file_id),)
        ).fetchone()
        return _file(FilesRow.model_validate(row)) if row else None

    def find_file(self, folder_id: str, name: str) -> FileRecord | None:
        row = self._conn.execute(
            "SELECT * FROM filesystem.files WHERE folder_id = %s AND name = %s AND deleted_at IS NULL",
            (UUID(folder_id), name),
        ).fetchone()
        return _file(FilesRow.model_validate(row)) if row else None

    def files_in(self, folder_id: str) -> tuple[FileRecord, ...]:
        rows = self._conn.execute(
            "SELECT * FROM filesystem.files WHERE folder_id = %s AND deleted_at IS NULL ORDER BY name",
            (UUID(folder_id),),
        ).fetchall()
        return tuple(_file(FilesRow.model_validate(row)) for row in rows)

    def create_file(self, file: NewFile) -> FileRecord:
        row = self._conn.execute(
            "INSERT INTO filesystem.files (id, created_at, updated_at, version, folder_id, code, name, retention) "
            "VALUES (%s, now(), now(), 1, %s, %s, %s, %s) RETURNING *",
            (uuid4(), UUID(file.folder_id), file.code, file.name, file.retention.value),
        ).fetchone()
        return _file(FilesRow.model_validate(row))

    def update_file(self, file_id: str, change: FileChange) -> FileRecord:
        sets = ["updated_at = now()", "version = version + 1"]
        values: list[str | UUID | None] = []
        if change.name is not None:
            sets.append("name = %s")
            values.append(change.name)
        if change.folder_id is not None:
            sets.append("folder_id = %s")
            values.append(UUID(change.folder_id))
        row = self._conn.execute(
            f"UPDATE filesystem.files SET {', '.join(sets)} WHERE id = %s AND deleted_at IS NULL RETURNING *",
            (*values, UUID(file_id)),
        ).fetchone()
        return _file(FilesRow.model_validate(row))

    def set_current_version(self, file_id: str, version_id: str) -> FileRecord:
        row = self._conn.execute(
            "UPDATE filesystem.files SET current_version_id = %s, updated_at = now(), version = version + 1 "
            "WHERE id = %s AND deleted_at IS NULL RETURNING *",
            (UUID(version_id), UUID(file_id)),
        ).fetchone()
        return _file(FilesRow.model_validate(row))

    # ---- versions --------------------------------------------------------------------------------------
    def add_version(self, version: NewVersion) -> VersionRecord:
        row = self._conn.execute(
            "INSERT INTO filesystem.file_versions (id, created_at, updated_at, version, file_id, revision, s3_key, sha256, "
            "size_bytes, content_type, original_filename, access, provenance, pinned, created_by_snapshot, verified_at) "
            "VALUES (%s, now(), now(), 1, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, now()) RETURNING *",
            (
                uuid4(),
                UUID(version.file_id),
                version.revision,
                version.s3_key,
                version.sha256,
                version.size_bytes,
                version.content_type,
                version.original_filename,
                version.access.value,
                json.dumps(version.provenance, sort_keys=True),
                version.pinned,
                json.dumps(version.created_by, sort_keys=True),
            ),
        ).fetchone()
        return _version(FileVersionsRow.model_validate(row))

    def get_version(self, version_id: str) -> VersionRecord | None:
        row = self._conn.execute(
            "SELECT * FROM filesystem.file_versions WHERE id = %s AND deleted_at IS NULL", (UUID(version_id),)
        ).fetchone()
        return _version(FileVersionsRow.model_validate(row)) if row else None

    def list_versions(self, file_id: str) -> tuple[VersionRecord, ...]:
        rows = self._conn.execute(
            "SELECT * FROM filesystem.file_versions WHERE file_id = %s AND deleted_at IS NULL ORDER BY revision",
            (UUID(file_id),),
        ).fetchall()
        return tuple(_version(FileVersionsRow.model_validate(row)) for row in rows)

    def next_revision(self, file_id: str) -> int:
        row = self._conn.execute(
            "SELECT coalesce(max(revision), 0) + 1 AS next FROM filesystem.file_versions WHERE file_id = %s",
            (UUID(file_id),),
        ).fetchone()
        assert row is not None
        return int(row["next"])

    def repoint_version(self, version_id: str, s3_key: str) -> VersionRecord:
        row = self._conn.execute(
            "UPDATE filesystem.file_versions SET s3_key = %s, updated_at = now(), version = version + 1 "
            "WHERE id = %s AND deleted_at IS NULL RETURNING *",
            (s3_key, UUID(version_id)),
        ).fetchone()
        return _version(FileVersionsRow.model_validate(row))

    def update_version(self, version_id: str, s3_key: str, access: Access) -> VersionRecord:
        row = self._conn.execute(
            "UPDATE filesystem.file_versions SET s3_key = %s, access = %s, updated_at = now(), version = version + 1 "
            "WHERE id = %s AND deleted_at IS NULL RETURNING *",
            (s3_key, access.value, UUID(version_id)),
        ).fetchone()
        return _version(FileVersionsRow.model_validate(row))

    def retire_version(self, version_id: str) -> None:
        self._conn.execute(
            "UPDATE filesystem.file_versions SET deleted_at = now(), updated_at = now(), version = version + 1 "
            "WHERE id = %s AND pinned = false AND deleted_at IS NULL",
            (UUID(version_id),),
        )

    def find_same_content(
        self, access: Access, sha256: str, size_bytes: int, excluding_file_id: str | None
    ) -> VersionRecord | None:
        row = self._conn.execute(
            "SELECT * FROM filesystem.file_versions WHERE access = %s AND sha256 = %s AND size_bytes = %s "
            "AND deleted_at IS NULL AND file_id IS DISTINCT FROM %s ORDER BY created_at LIMIT 1",
            (access.value, sha256, size_bytes, UUID(excluding_file_id) if excluding_file_id else None),
        ).fetchone()
        return _version(FileVersionsRow.model_validate(row)) if row else None

    def key_referenced(self, s3_key: str) -> bool:
        row = self._conn.execute(
            "SELECT 1 AS found FROM filesystem.file_versions WHERE s3_key = %s AND deleted_at IS NULL LIMIT 1",
            (s3_key,),
        ).fetchone()
        return row is not None
