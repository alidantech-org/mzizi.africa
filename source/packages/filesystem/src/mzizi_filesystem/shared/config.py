"""What the filesystem needs from its caller. The package names no bucket, host or prefix of its own."""

from __future__ import annotations

from pydantic import Field

from mzizi_filesystem.shared.contracts import Frozen


class FilesystemConfig(Frozen):
    bucket: str = Field(min_length=1)
    region: str = Field(min_length=1)
    #: Where anonymously readable objects are served from; `None` when nothing is public.
    public_endpoint: str | None
    #: Key prefixes this package must never write, replace or delete (for example an untouchable raw archive).
    protected_prefixes: tuple[str, ...]
    #: Folder names that may not be created at the top of the registry because they are reserved key areas.
    reserved_roots: tuple[str, ...]
    #: Where uploads wait before they are accepted.
    temp_prefix: str
