"""Requests, policies and results of registering bytes."""

from __future__ import annotations

from enum import StrEnum

from mzizi_filesystem.features.placement.contracts import Placement
from mzizi_filesystem.shared.contracts import Frozen


class NameConflictPolicy(StrEnum):
    """A file with this name exists in the folder and holds different bytes."""

    NEW_VERSION = "new_version"
    KEEP_BOTH = "keep_both"
    REJECT = "reject"


class DuplicatePolicy(StrEnum):
    """The same bytes already exist as another file of the same access class."""

    KEEP_BOTH = "keep_both"
    REUSE_EXISTING = "reuse_existing"
    REJECT = "reject"


class Outcome(StrEnum):
    CREATED = "created"
    UPDATED = "updated"
    UNCHANGED = "unchanged"
    DUPLICATE = "duplicate"
    CONFLICT = "conflict"
    FAILED = "failed"
    PLANNED = "planned"


class RegisterRequest(Frozen):
    placement: Placement
    #: Overrides the code derived from the folder code and file name.
    file_code: str | None
    declared_type: str | None
    original_filename: str | None
    provenance: dict[str, str]
    created_by: dict[str, str]
    on_name_conflict: NameConflictPolicy
    on_duplicate: DuplicatePolicy
    pinned: bool
    dry_run: bool


class RegisterResult(Frozen):
    outcome: Outcome
    detail: str
    file_id: str | None
    version_id: str | None
    revision: int | None
    key: str | None
    sha256: str | None
    size_bytes: int | None
    duplicate_of_key: str | None
    archived_key: str | None
    recovered: bool
    server_copied: bool
