"""Relocation: access changes, moves and renames, and explicit cleanup of superseded keys.

The object key is the registry path, so changing a folder's access, parent or name, or a file's folder or name, changes the key of
every affected version. One routine does it: inside one database transaction the rows change, every version whose stored key no
longer equals its computed key is copied to the new key and verified, and the version is repointed; the commit-time key check then
passes. If a copy fails the transaction rolls back and nothing changed. Old keys are not deleted here: they are returned, and
`delete_unreferenced_keys` removes only those no retained version or live upload still references.
"""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass, field

from mzizi_filesystem.keys import check_name, is_protected
from mzizi_filesystem.store import StoreError

from ..ports import required
from .service import FilesystemService


@dataclass
class RelocationReport:
    target_id: str
    change: str
    dry_run: bool
    versions_relocated: int = 0
    copied_keys: list[str] = field(default_factory=list)
    superseded_keys: list[str] = field(default_factory=list)
    error: str | None = None


TransitionReport = RelocationReport

_FOLDER_SQL = "SELECT * FROM filesystem.key_violations(%s)"
_FILE_SQL = "SELECT v.id AS file_version_id, v.s3_key, filesystem.version_key(v.id) AS expected_key FROM filesystem.file_versions v WHERE v.file_id = %s AND v.s3_key <> filesystem.version_key(v.id)"


def _relocate(
    service: FilesystemService, report: RelocationReport, change: Callable[[], object], violations_sql: str
) -> RelocationReport:
    repo, store, dry_run = service.repo, service.store, report.dry_run
    try:
        with repo.conn.transaction(force_rollback=dry_run):
            change()
            rows = repo.conn.execute(violations_sql, (report.target_id,)).fetchall()
            taken = {r["s3_key"] for r in rows}
            for row in rows:
                version, new_key = required(repo.get_version(row["file_version_id"])), row["expected_key"]
                if is_protected(new_key):
                    raise StoreError(f"{new_key} is inside a protected archive")
                if not dry_run:
                    if not service._holds(new_key, version["sha256"], version["size_bytes"]):
                        if store.head(new_key) is not None and new_key not in taken:
                            raise StoreError(f"{new_key} already holds a different object; refusing to overwrite it")
                        store.copy(version["s3_key"], new_key, version["content_type"], version["sha256"])
                        if not service._holds(new_key, version["sha256"], version["size_bytes"]):
                            raise StoreError(f"verification failed after copying to {new_key}")
                    report.copied_keys.append(new_key)
                    repo.relocate_version(version["id"], new_key)
                report.versions_relocated += 1
                report.superseded_keys.append(version["s3_key"])
            if not dry_run:
                repo.conn.execute("SET CONSTRAINTS ALL IMMEDIATE")
                repo.conn.execute("SET CONSTRAINTS ALL DEFERRED")
    except Exception as error:
        report.error = f"{type(error).__name__}: {str(error).splitlines()[0]}"
        report.versions_relocated = 0
    if not dry_run and report.error is None:
        report.superseded_keys = [k for k in dict.fromkeys(report.superseded_keys) if not repo.key_in_use(k)]
    return report


def transition_folder_access(
    service: FilesystemService,
    folder_id: str,
    new_access: str,
    *,
    actor: str | None,
    authorization: dict | None = None,
    dry_run: bool = True,
) -> RelocationReport:
    repo = service.repo
    service.authorizer.for_record(actor, "filesystem.publish", "filesystem.folders", folder_id)
    report = RelocationReport(folder_id, f"access -> {new_access}", dry_run)
    folder = repo.get_folder(folder_id)
    if folder is None:
        report.error = "no such folder"
        return report
    if new_access == "public" and not authorization:
        report.error = "public access needs an explicit authorization {by, date, reference}"
        return report
    fields = {"access": new_access, **({"access_authorization": authorization} if new_access == "public" else {})}
    return _relocate(service, report, lambda: repo.update_folder(folder_id, folder["revision"], fields), _FOLDER_SQL)


def move_folder(
    service: FilesystemService,
    folder_id: str,
    *,
    new_parent_id: str | None = None,
    new_name: str | None = None,
    keep_parent: bool = True,
    actor: str | None,
    dry_run: bool = True,
) -> RelocationReport:
    """Renames a folder and/or moves it under another parent (keep_parent=False with new_parent_id=None makes it a root)."""
    repo = service.repo
    service.authorizer.for_record(actor, "filesystem.edit", "filesystem.folders", folder_id)
    folder = repo.get_folder(folder_id)
    report = RelocationReport(folder_id, "move folder", dry_run)
    if folder is None:
        report.error = "no such folder"
        return report
    parent = folder["parent_id"] if keep_parent and new_parent_id is None else new_parent_id
    name = new_name or folder["name"]
    try:
        check_name(name, root=parent is None)
    except ValueError as error:
        report.error = str(error)
        return report
    report.change = f"folder -> {(repo.folder_path(parent) if parent else '')}/{name}"
    return _relocate(
        service, report, lambda: repo.set_folder_place(folder_id, folder["revision"], parent, name), _FOLDER_SQL
    )


def move_file(
    service: FilesystemService,
    file_id: str,
    *,
    new_folder_id: str | None = None,
    new_name: str | None = None,
    actor: str | None,
    dry_run: bool = True,
) -> RelocationReport:
    """Renames a file and/or moves it to another folder; every retained revision follows it."""
    repo = service.repo
    service.authorizer.for_record(actor, "filesystem.edit", "filesystem.files", file_id)
    file = repo.get_file(file_id)
    report = RelocationReport(file_id, "move file", dry_run)
    if file is None:
        report.error = "no such file"
        return report
    folder, name = new_folder_id or file["folder_id"], new_name or file["name"]
    try:
        check_name(name)
    except ValueError as error:
        report.error = str(error)
        return report
    report.change = f"file -> {repo.folder_path(folder)}/{name}"
    return _relocate(service, report, lambda: repo.set_file_place(file_id, file["revision"], folder, name), _FILE_SQL)


def delete_unreferenced_keys(service: FilesystemService, keys: list[str], *, dry_run: bool = True) -> dict:
    """Explicit cleanup after a successful relocation or prune: removes only keys that no retained version or live upload references."""
    deleted, kept = [], []
    for key in keys:
        if is_protected(key) or service.repo.key_in_use(key):
            kept.append(key)
            continue
        if not dry_run:
            service.store.delete(key)
        deleted.append(key)
    return {"dry_run": dry_run, "deleted": deleted, "kept": kept}
