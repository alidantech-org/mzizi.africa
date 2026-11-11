"""Byte identity: streaming SHA-256 with a byte count. Never the S3 ETag, never the filename."""
from __future__ import annotations

import hashlib
from pathlib import Path
from typing import BinaryIO

CHUNK = 8 * 1024 * 1024


def sha256_hex(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def hash_stream(stream: BinaryIO, chunk_size: int = CHUNK) -> tuple[str, int]:
    """(sha256 hex, size in bytes) read in chunks; memory use is bounded by chunk_size."""
    digest, size = hashlib.sha256(), 0
    while chunk := stream.read(chunk_size):
        digest.update(chunk)
        size += len(chunk)
    return digest.hexdigest(), size


def hash_file(path: str | Path, chunk_size: int = CHUNK) -> tuple[str, int]:
    with open(path, "rb") as handle:
        return hash_stream(handle, chunk_size)

