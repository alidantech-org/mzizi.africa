"""The engine's filesystem storage module: everything in `mzizi_filesystem` that touches a database.

The `mzizi_filesystem` package stays pure (object store, hashing, keys, codes, the media catalog and the
`Authorizer` shape); this module is the one place that opens a database connection and runs SQL against the
`filesystem` and `auth` schemas, over the port in `mzizi_engine.ports`. See `.docs/design/architecture/ENGINE_JOB_MODEL.md`
and task TSK-E55B1BC4011A.
"""

from __future__ import annotations

from mzizi_engine.filesystem.authz import Authorizer, DatabaseAuthorizer, OperatorAuthorizer
from mzizi_engine.filesystem.download import download_url, open_for_streaming
from mzizi_engine.filesystem.lineage import ancestry, derivatives, register_derived, relate
from mzizi_engine.filesystem.livecheck import run_live_check
from mzizi_engine.filesystem.repository import Conflict, PermissionDenied, Repository
from mzizi_engine.filesystem.reset import (
    VerifyReport,
    bucket_summary,
    external_references,
    verify_registry,
    wipe_bucket,
    wipe_registry,
)
from mzizi_engine.filesystem.secure import cache_dir, fetch_secure_file
from mzizi_engine.filesystem.service import FilesystemService, Registration
from mzizi_engine.filesystem.sync import ManifestError, Plan, SyncReport, load_plan, plan_seed, run_sync
from mzizi_engine.filesystem.transitions import (
    RelocationReport,
    delete_unreferenced_keys,
    move_file,
    move_folder,
    transition_folder_access,
)
from mzizi_engine.filesystem.uploads import CleanupReport, cleanup_uploads, complete_upload, create_upload

__all__ = [
    "Authorizer",
    "CleanupReport",
    "Conflict",
    "DatabaseAuthorizer",
    "FilesystemService",
    "ManifestError",
    "OperatorAuthorizer",
    "PermissionDenied",
    "Plan",
    "Registration",
    "RelocationReport",
    "Repository",
    "SyncReport",
    "VerifyReport",
    "ancestry",
    "bucket_summary",
    "cache_dir",
    "cleanup_uploads",
    "complete_upload",
    "create_upload",
    "delete_unreferenced_keys",
    "derivatives",
    "download_url",
    "external_references",
    "fetch_secure_file",
    "load_plan",
    "move_file",
    "move_folder",
    "open_for_streaming",
    "plan_seed",
    "register_derived",
    "relate",
    "run_live_check",
    "run_sync",
    "transition_folder_access",
    "verify_registry",
    "wipe_bucket",
    "wipe_registry",
]
