"""Access transitions and explicit content cleanup.

Changing a folder's access class in the database does not change S3 visibility: the physical key prefix is the boundary. The
transition therefore (in one database transaction) sets the folder, finds every retained version whose key no longer matches,
copies its bytes to the content key of the new access class, verifies the copy, repoints the version and lets the deferred
placement check pass at commit. If a copy fails the transaction rolls back and the folder is unchanged. Old keys are not deleted
here: they are returned, and `delete_unreferenced_keys` removes only those no retained version or live upload still references.
"""
from __future__ import annotations

from dataclasses import dataclass, field

from .access import check_key_matches_access
from .hashing import content_key
from .service import FilesystemService
from .store import StoreError, verify_upload  # noqa: F401


@dataclass
class TransitionReport:
    folder_id: str
    new_access: str
    dry_run: bool
    versions_relocated: int = 0
    copied_keys: list[str] = field(default_factory=list)
    superseded_keys: list[str] = field(default_factory=list)
    error: str | None = None


def transition_folder_access(service: FilesystemService, folder_id: str, new_access: str, *, actor: str | None, authorization: dict | None = None, dry_run: bool = True) -> TransitionReport:
    repo, store = service.repo, service.store
    service.authorizer.for_record(actor, "filesystem.publish", "filesystem.folders", folder_id)
    report = TransitionReport(folder_id, new_access, dry_run)
    folder = repo.get_folder(folder_id)
    if folder is None:
        report.error = "no such folder"
        return report
    if new_access == "public" and not authorization:
        report.error = "public access needs an explicit authorization {by, date, reference}"
        return report
    try:
        with repo.conn.transaction(force_rollback=dry_run):
            fields = {"access": new_access}
            if new_access == "public":
                fields["access_authorization"] = authorization
            repo.update_folder(folder_id, folder["revision"], fields)
            rows = repo.conn.execute("SELECT * FROM filesystem.placement_violations(%s)", (folder_id,)).fetchall()
            for row in rows:
                version = repo.get_version(row["file_version_id"])
                new_key = content_key(row["expected_access"], version["sha256"])
                check_key_matches_access(new_key, row["expected_access"])
                if not dry_run:
                    if store.head(new_key) is None:
                        store.copy(version["s3_key"], new_key, version["content_type"], version["sha256"])
                    head = store.head(new_key)
                    if head is None or head.size != version["size_bytes"] or head.sha256 not in (None, version["sha256"]):
                        raise StoreError(f"verification failed after copying to {new_key}")
                    report.copied_keys.append(new_key)
                    repo.relocate_version(version["id"], new_key)
                report.versions_relocated += 1
                report.superseded_keys.append(version["s3_key"])
            if not dry_run:
                repo.conn.execute("SET CONSTRAINTS ALL IMMEDIATE")
    except Exception as error:  # noqa: BLE001 - a failed transition leaves the folder unchanged (rolled back)
        report.error = f"{type(error).__name__}: {str(error).splitlines()[0]}"
        report.versions_relocated = 0
    if not dry_run and report.error is None:
        report.superseded_keys = [k for k in dict.fromkeys(report.superseded_keys) if not repo.key_in_use(k)]
    return report


def delete_unreferenced_keys(service: FilesystemService, keys: list[str], *, dry_run: bool = True) -> dict:
    """Explicit cleanup after successful publication: removes only content keys that no retained version or live upload references."""
    deleted, kept = [], []
    for key in keys:
        if "/content/sha256/" not in key or service.repo.key_in_use(key):
            kept.append(key)
            continue
        if not dry_run:
            service.store.delete(key)
        deleted.append(key)
    return {"dry_run": dry_run, "deleted": deleted, "kept": kept}
