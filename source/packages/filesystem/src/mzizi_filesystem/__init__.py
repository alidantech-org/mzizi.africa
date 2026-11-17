"""Filesystem capability: versioned files at caller-chosen placements, object storage and keys.

One orchestrator, `FilesystemOrchestrator`, exposes everything. This package never knows a database exists: the engine
supplies a `RegistryRepository`, an `ObjectStore`, a `MediaCatalog` and a `FilesystemConfig`. It names no bucket, host,
prefix or folder of its own; where things go is decided by the caller, from the task it is doing.
"""

from mzizi_filesystem.features.media.catalog import ContentTypeError, MediaCatalog
from mzizi_filesystem.features.register.contracts import (
    DuplicatePolicy,
    NameConflictPolicy,
    Outcome,
    RegisterRequest,
    RegisterResult,
)
from mzizi_filesystem.features.store.memory import MemoryObjectStore
from mzizi_filesystem.features.store.s3 import S3ObjectStore, S3Settings
from mzizi_filesystem.features.store.store import ObjectStore, StoreError
from mzizi_filesystem.orchestrator import FilesystemOrchestrator
from mzizi_filesystem.shared.config import FilesystemConfig
from mzizi_filesystem.shared.contracts import Access, Retention

__all__ = [
    "Access",
    "ContentTypeError",
    "DuplicatePolicy",
    "FilesystemConfig",
    "FilesystemOrchestrator",
    "MediaCatalog",
    "MemoryObjectStore",
    "NameConflictPolicy",
    "ObjectStore",
    "Outcome",
    "RegisterRequest",
    "RegisterResult",
    "Retention",
    "S3ObjectStore",
    "S3Settings",
    "StoreError",
]
