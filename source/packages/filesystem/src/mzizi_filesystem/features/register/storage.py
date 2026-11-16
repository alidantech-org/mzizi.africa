"""Putting bytes at a key without ever losing or overwriting unknown bytes, and proving they arrived."""

from __future__ import annotations

from pathlib import Path

from mzizi_filesystem.hashing import hash_stream
from mzizi_filesystem.store import ObjectStore, StoreError


def holds(store: ObjectStore, key: str, sha256: str, size: int) -> bool:
    """True when the key holds exactly these bytes. An object without a recorded hash is read back and hashed."""
    head = store.head(key)
    if head is None or head.size != size:
        return False
    if head.sha256 is not None:
        return head.sha256 == sha256
    with store.open_stream(key) as stream:
        return hash_stream(stream) == (sha256, size)


def write(store: ObjectStore, key: str, source: Path | bytes, sha256: str, size: int, content_type: str) -> None:
    if isinstance(source, Path):
        store.put_path(key, str(source), content_type, sha256)
    else:
        store.put(key, source, content_type, sha256)
    if not holds(store, key, sha256, size):
        raise StoreError(f"verification failed: {key} does not hold the uploaded bytes")
