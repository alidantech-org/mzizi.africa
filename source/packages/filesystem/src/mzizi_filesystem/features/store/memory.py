"""A deterministic in-memory object store with fault injection, for tests and for runs without S3."""

from __future__ import annotations

from collections.abc import Iterator
from typing import BinaryIO

from mzizi_filesystem.features.keys.keys import is_protected
from mzizi_filesystem.features.store.store import MultipartUpload, ObjectHead, StoreError


class MemoryObjectStore:
    """Deterministic in-memory store with fault injection, used by the mocked-S3 tests."""

    def __init__(self, bucket: str, public_endpoint: str, protected_prefixes: tuple[str, ...]) -> None:
        self.bucket = bucket
        self.public_endpoint = public_endpoint
        self._protected = protected_prefixes
        self.objects: dict[str, tuple[bytes, str, str, str | None]] = {}
        self.puts: list[str] = []
        self.deleted: list[str] = []
        self.aborted: list[tuple[str, str]] = []
        self.multiparts: list[MultipartUpload] = []
        self.fail_next_puts = 0
        self.corrupt_next_puts = 0

    def head(self, key: str) -> ObjectHead | None:
        found = self.objects.get(key)
        return ObjectHead(len(found[0]), found[2], found[1]) if found else None

    def put(self, key: str, data: bytes, content_type: str, sha256: str, cache_control: str | None = None) -> None:
        if is_protected(key, self._protected):
            raise StoreError(f"refusing to write protected key {key}")
        if self.fail_next_puts:
            self.fail_next_puts -= 1
            raise StoreError("injected put failure")
        if self.corrupt_next_puts:
            self.corrupt_next_puts -= 1
            data = data[:-1]
        self.puts.append(key)
        self.objects[key] = (data, content_type, sha256, cache_control)

    def put_path(self, key: str, path: str, content_type: str, sha256: str) -> None:
        with open(path, "rb") as handle:
            self.put(key, handle.read(), content_type, sha256)

    def get(self, key: str) -> bytes:
        if key not in self.objects:
            raise StoreError(f"no such key {key}")
        return self.objects[key][0]

    def open_stream(self, key: str) -> BinaryIO:
        import io

        return io.BytesIO(self.get(key))

    def copy(self, source_key: str, dest_key: str, content_type: str, sha256: str) -> None:
        self.put(dest_key, self.get(source_key), content_type, sha256)

    def delete(self, key: str) -> None:
        if is_protected(key, self._protected):
            raise StoreError(f"refusing to delete protected key {key}")
        self.deleted.append(key)
        self.objects.pop(key, None)

    def list_keys(self, prefix: str = "") -> Iterator[tuple[str, int]]:
        return iter(sorted((k, len(v[0])) for k, v in self.objects.items() if k.startswith(prefix)))

    def delete_many(self, keys: list[str]) -> int:
        for key in keys:
            self.delete(key)
        return len(keys)

    def presign_get(self, key: str, expires_seconds: int = 900) -> str:
        return f"{self.public_endpoint}/{self.bucket}/{key}?expires={expires_seconds}"

    def presign_put(self, key: str, content_type: str, expires_seconds: int = 900) -> str:
        return f"{self.public_endpoint}/{self.bucket}/{key}?upload=1&expires={expires_seconds}"

    def list_multipart(self, prefix: str) -> list[MultipartUpload]:
        return [m for m in self.multiparts if m["Key"].startswith(prefix)]

    def abort_multipart(self, key: str, upload_id: str) -> None:
        self.multiparts = [m for m in self.multiparts if not (m["Key"] == key and m["UploadId"] == upload_id)]
        self.aborted.append((key, upload_id))
