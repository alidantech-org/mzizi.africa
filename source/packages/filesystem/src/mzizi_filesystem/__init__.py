"""Filesystem capability: S3 object access, streaming hashing, deduplication, registry repository, synchronization, uploads, lineage and access transitions."""
from .access import ACCESS_CLASSES, BUCKET, REGION, AccessError, check_key_matches_access, is_anonymously_readable
from .authz import Authorizer, DatabaseAuthorizer, OperatorAuthorizer
from .hashing import content_key, hash_file, hash_stream, sha256_hex
from .lineage import ancestry, begin_extraction, config_hash, finish_extraction, register_output
from .repository import Conflict, PermissionDenied, Repository
from .service import FilesystemService, Registration
from .store import MemoryObjectStore, ObjectHead, ObjectStore, S3ObjectStore, StoreError, verify_upload
from .sync import ManifestError, Plan, SyncReport, load_plan, plan_seed, plan_sync_manifest, run_sync
from .transitions import delete_unreferenced_keys, transition_folder_access
from .uploads import cleanup_uploads, complete_upload, create_upload

__all__ = ["ACCESS_CLASSES", "AccessError", "Authorizer", "BUCKET", "Conflict", "DatabaseAuthorizer", "FilesystemService", "ManifestError", "MemoryObjectStore", "ObjectHead", "ObjectStore", "OperatorAuthorizer",
           "PermissionDenied", "Plan", "REGION", "Registration", "Repository", "S3ObjectStore", "StoreError", "SyncReport", "ancestry", "begin_extraction", "check_key_matches_access", "cleanup_uploads",
           "complete_upload", "config_hash", "content_key", "create_upload", "delete_unreferenced_keys", "finish_extraction", "hash_file", "hash_stream", "is_anonymously_readable", "load_plan",
           "plan_seed", "plan_sync_manifest", "register_output", "run_sync", "sha256_hex", "transition_folder_access", "verify_upload"]
__version__ = "0.2.0"
