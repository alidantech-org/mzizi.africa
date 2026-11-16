"""Typed records of the filesystem registry. They mirror the Dryv `filesystem` tables, owned by this package.

The package never imports generated row models: the engine maps its rows to these contracts at the persistence port.
"""

from __future__ import annotations

from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class Frozen(BaseModel):
    model_config = ConfigDict(frozen=True, strict=True, extra="forbid")


class Access(StrEnum):
    PUBLIC = "public"
    RESTRICTED = "restricted"
    INTERNAL = "internal"
    PRIVATE = "private"


class Retention(StrEnum):
    PRESERVE_HISTORY = "preserve_history"
    REPLACE_CURRENT = "replace_current"


class FolderRecord(Frozen):
    id: str
    parent_id: str | None
    code: str
    name: str
    access: Access
    #: A recorded justification, present when the folder's access differs from its parent's.
    authorization: str | None
    #: The reference value that says what the folder is for (supplied by the caller, never named here).
    role_id: str


class FileRecord(Frozen):
    id: str
    folder_id: str
    code: str
    name: str
    retention: Retention
    current_version_id: str | None


class VersionRecord(Frozen):
    id: str
    file_id: str
    revision: int = Field(ge=1)
    s3_key: str
    sha256: str = Field(pattern=r"^[0-9a-f]{64}$")
    size_bytes: int = Field(ge=0)
    content_type: str
    original_filename: str | None
    access: Access
    pinned: bool
    verified_at: datetime


class NewFolder(Frozen):
    parent_id: str | None
    code: str
    name: str
    access: Access
    authorization: str | None
    role_id: str
