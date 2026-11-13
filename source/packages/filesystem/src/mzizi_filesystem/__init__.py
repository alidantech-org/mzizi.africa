"""Reusable filesystem capability: S3 object access, hashing, deduplication, key and code naming and the media
catalog. This package never knows a database exists (`.docs/rules/typed-code.md`); the engine's own filesystem
module holds everything that opens a connection and runs SQL, over a database port it owns, and the CLI that was
here moved with it (`uv run mzizi-engine filesystem --help`).
"""

from .access import ACCESS_CLASSES, BUCKET, REGION, AccessError, check_key_matches_access, is_anonymously_readable
from .authz import Authorizer, OperatorAuthorizer
from .hashing import hash_file, hash_stream, sha256_hex
from .keys import PROTECTED_PREFIXES, VERSIONS_DIR, archive_key, check_name, current_key, is_protected, sibling_name
from .store import MemoryObjectStore, ObjectHead, ObjectStore, S3ObjectStore, StoreError, verify_upload

__all__ = [
    "ACCESS_CLASSES",
    "BUCKET",
    "PROTECTED_PREFIXES",
    "REGION",
    "VERSIONS_DIR",
    "AccessError",
    "Authorizer",
    "MemoryObjectStore",
    "ObjectHead",
    "ObjectStore",
    "OperatorAuthorizer",
    "S3ObjectStore",
    "StoreError",
    "archive_key",
    "check_key_matches_access",
    "check_name",
    "current_key",
    "hash_file",
    "hash_stream",
    "is_anonymously_readable",
    "is_protected",
    "sha256_hex",
    "sibling_name",
    "verify_upload",
]
