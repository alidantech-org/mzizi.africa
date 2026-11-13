"""Direct upload sessions and bounded cleanup.

A session reserves a temporary key under private/tmp/uploads/ (always private, whatever the destination), hands the client a
presigned PUT (or a multipart id), and `complete` verifies the stored bytes by streaming them, stores them at the readable
key of the destination folder (see keys.py), registers the file/version and only then removes its own temporary
object. Cleanup is lease-aware: an upload whose lease lapsed without renewal is abandoned, its multipart upload aborted, its own
temp object removed; completed file records are never touched and old session metadata is trimmed in bounded batches.
"""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from pathlib import Path

from mzizi_filesystem.hashing import hash_stream

from ..ports import Row
from .repository import Repository
from .service import FilesystemService, Registration

TMP_PREFIX = "private/tmp/uploads/"


def temp_key_for(upload_token: str, filename: str) -> str:
    safe = "".join(c if c.isalnum() or c in "._-" else "_" for c in filename)[:80] or "upload"
    return f"{TMP_PREFIX}{upload_token}/{safe}"


def create_upload(
    service: FilesystemService,
    folder_id: str,
    filename: str,
    *,
    actor: str | None,
    size: int | None = None,
    sha256: str | None = None,
    lease_seconds: int = 900,
    ttl_seconds: int = 86400,
    multipart_id: str | None = None,
    content_type: str = "application/octet-stream",
) -> dict:
    service.authorizer.for_new_child(actor, "filesystem.edit", "filesystem.files", folder_id)
    key = temp_key_for(uuid.uuid4().hex, filename)
    row = dict(
        service.repo.create_upload(
            folder_id, filename, key, lease_seconds, ttl_seconds, size, sha256, multipart_id, actor
        )
    )
    row["put_url"] = None if multipart_id else service.store.presign_put(key, content_type, min(lease_seconds, 3600))
    return row


def complete_upload(
    service: FilesystemService,
    upload_id: str,
    *,
    actor: str | None,
    code: str | None = None,
    retention: str = "preserve_history",
    provenance_extra: dict | None = None,
    on_duplicate: str = "keep_both",
    on_name_conflict: str = "new_version",
) -> Registration:
    """Registers a finished upload under its original file name. The two policies are those of `FilesystemService.register`: a client
    that must never replace or re-store content passes on_name_conflict="keep_both" and on_duplicate="reuse_existing"."""
    repo, store = service.repo, service.store
    up = repo.get_upload(upload_id)
    if up is None or up["status"] not in ("pending", "uploaded"):
        return Registration("conflict", f"upload {upload_id} is not open")
    head = store.head(up["temp_key"])
    if head is None:
        return Registration("failed", "the uploaded object is not in the store yet")
    with store.open_stream(up["temp_key"]) as stream:
        sha, size = hash_stream(stream)
    if (up["declared_sha256"] and up["declared_sha256"] != sha) or (
        up["declared_size"] is not None and up["declared_size"] != size
    ):
        repo.set_upload(upload_id, "failed", "stored bytes do not match the declared hash or size")
        return Registration("failed", "stored bytes do not match the declared hash or size", sha256=sha, size=size)
    repo.set_upload(upload_id, "uploaded")
    data_head = store.get(up["temp_key"]) if size <= 1_048_576 else None
    if data_head is None:
        # large uploads: register from a local spool of the verified object so the same registration path applies
        import tempfile

        with tempfile.NamedTemporaryFile(delete=False) as spool, store.open_stream(up["temp_key"]) as stream:
            while chunk := stream.read(8 * 1024 * 1024):
                spool.write(chunk)
        source: Path | bytes = Path(spool.name)
    else:
        source = data_head
    try:
        reg = service.register(
            up["folder_id"],
            up["filename"],
            source,
            code=code,
            retention=retention,
            actor=actor,
            provenance_extra=provenance_extra,
            original_filename=up["filename"],
            on_duplicate=on_duplicate,
            on_name_conflict=on_name_conflict,
        )
    finally:
        if isinstance(source, Path):
            source.unlink(missing_ok=True)
    if reg.outcome in ("created", "updated", "unchanged", "duplicate"):
        repo.set_upload(upload_id, "completed", None, reg.version_id)
        _delete_owned_temp(service, up)
    else:
        repo.set_upload(upload_id, "failed", reg.detail[:500])
    return reg


def _referenced_by_version(repo: Repository, key: str) -> bool:
    return bool(repo.conn.execute("SELECT 1 FROM filesystem.file_versions WHERE s3_key = %s", (key,)).fetchone())


def _delete_owned_temp(service: FilesystemService, up: Row) -> None:
    if (
        up["temp_key"].startswith(TMP_PREFIX)
        and not service.repo.conn.execute(
            "SELECT 1 FROM filesystem.file_versions WHERE s3_key = %s", (up["temp_key"],)
        ).fetchone()
    ):
        service.store.delete(up["temp_key"])


@dataclass
class CleanupReport:
    dry_run: bool
    abandoned: list[str] = field(default_factory=list)
    aborted_multipart: list[str] = field(default_factory=list)
    temp_objects_removed: list[str] = field(default_factory=list)
    sessions_trimmed: int = 0
    errors: list[str] = field(default_factory=list)


def cleanup_uploads(
    service: FilesystemService,
    *,
    dry_run: bool = True,
    batch: int = 100,
    trim_after_days: int = 30,
    trim_batch: int = 500,
) -> CleanupReport:
    """Abandon lapsed sessions, abort their multipart uploads, remove only their own temporary objects, trim old metadata. Never sweeps the bucket."""
    repo, store = service.repo, service.store
    report = CleanupReport(dry_run)
    for up in repo.abandoned_candidates(batch):
        try:
            if up["multipart_id"]:
                report.aborted_multipart.append(up["id"])
                if not dry_run:
                    store.abort_multipart(up["temp_key"], up["multipart_id"])
            if (
                up["temp_key"].startswith(TMP_PREFIX)
                and store.head(up["temp_key"]) is not None
                and not _referenced_by_version(repo, up["temp_key"])
            ):
                report.temp_objects_removed.append(up["temp_key"])
                if not dry_run:
                    store.delete(up["temp_key"])
            report.abandoned.append(up["id"])
            if not dry_run:
                repo.set_upload(up["id"], "abandoned", "lease and/or expiry lapsed")
        except Exception as error:
            report.errors.append(f"{up['id']}: {error}")
    if not dry_run:
        report.sessions_trimmed = repo.trim_upload_sessions(trim_after_days, trim_batch)
    return report
