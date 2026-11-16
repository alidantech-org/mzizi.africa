"""The object-store port: what the filesystem needs from any store (S3, in memory), plus upload verification."""

from __future__ import annotations

from collections.abc import Iterator
from dataclasses import dataclass
from datetime import datetime
from typing import BinaryIO, NotRequired, Protocol, TypedDict

from mzizi_filesystem.shared.hashing import sha256_hex


@dataclass(frozen=True)
class ObjectHead:
    size: int
    sha256: str | None
    content_type: str | None = None


class StoreError(RuntimeError):
    pass


class MultipartUpload(TypedDict):
    Key: str
    UploadId: str
    Initiated: NotRequired[datetime | None]


class ObjectStore(Protocol):
    bucket: str

    def head(self, key: str) -> ObjectHead | None: ...
    def put(self, key: str, data: bytes, content_type: str, sha256: str, cache_control: str | None = None) -> None: ...
    def put_path(self, key: str, path: str, content_type: str, sha256: str) -> None: ...
    def get(self, key: str) -> bytes: ...
    def open_stream(self, key: str) -> BinaryIO: ...
    def copy(self, source_key: str, dest_key: str, content_type: str, sha256: str) -> None: ...
    def delete(self, key: str) -> None: ...
    def presign_get(self, key: str, expires_seconds: int = 900) -> str: ...
    def presign_put(self, key: str, content_type: str, expires_seconds: int = 900) -> str: ...
    def list_keys(self, prefix: str = "") -> Iterator[tuple[str, int]]: ...
    def delete_many(self, keys: list[str]) -> int: ...
    def list_multipart(self, prefix: str) -> list[MultipartUpload]: ...
    def abort_multipart(self, key: str, upload_id: str) -> None: ...


def verify_upload(store: ObjectStore, key: str, data: bytes, mode: str = "head") -> None:
    """Confirms a stored object is what was meant: length and recorded hash (head), or the bytes themselves (get)."""
    expected = sha256_hex(data)
    head = store.head(key)
    if head is None:
        raise StoreError(f"verification failed: {key} is not in the store")
    if head.size != len(data):
        raise StoreError(f"verification failed: {key} has {head.size} bytes, expected {len(data)}")
    if head.sha256 is not None and head.sha256 != expected:
        raise StoreError(f"verification failed: {key} records hash {head.sha256}, expected {expected}")
    if mode == "get" and sha256_hex(store.get(key)) != expected:
        raise StoreError(f"verification failed: bytes read back from {key} do not match")
