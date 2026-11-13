"""Reads: authorized download URLs and backend streaming.

Public keys resolve to the public origin (https://res.alidantech.org/mzizi/<key>, configurable with S3_PUBLIC_ORIGIN). Everything else needs the
`filesystem.read` permission and is served as a presigned URL signed against the client-reachable endpoint (refused when that is an internal
Docker hostname) or streamed by the backend. URLs are returned to the caller and never stored.
"""

from __future__ import annotations

import os
from typing import BinaryIO

from mzizi_filesystem.access import is_anonymously_readable

from ..ports import Row
from .service import FilesystemService


def download_url(service: FilesystemService, version_id: str, *, actor: str | None, expires_seconds: int = 900) -> dict:
    version = service.repo.get_version(version_id)
    if version is None:
        raise LookupError(f"no such version {version_id}")
    service.authorizer.for_record(actor, "filesystem.read", "filesystem.files", version["file_id"])
    key = version["s3_key"]
    if is_anonymously_readable(key):
        origin = os.environ.get("S3_PUBLIC_ORIGIN", "https://res.alidantech.org/mzizi").rstrip("/")
        return {"kind": "public", "url": f"{origin}/{key}", "expires_in": None}
    return {"kind": "presigned", "url": service.store.presign_get(key, expires_seconds), "expires_in": expires_seconds}


def open_for_streaming(service: FilesystemService, version_id: str, *, actor: str | None) -> tuple[BinaryIO, Row]:
    """(stream, version) for backend streaming of a private artifact after the same authorization check."""
    version = service.repo.get_version(version_id)
    if version is None:
        raise LookupError(f"no such version {version_id}")
    service.authorizer.for_record(actor, "filesystem.read", "filesystem.files", version["file_id"])
    return service.store.open_stream(version["s3_key"]), version
