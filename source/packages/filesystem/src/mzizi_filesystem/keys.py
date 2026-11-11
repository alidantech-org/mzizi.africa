"""Object keys are readable registry paths (decision DEC-FILESYSTEM-READABLE-KEYS). Mirror of SQL `filesystem.version_key`.

    current version      <access>/<folder path>/<file name>
    superseded version   <access>/<folder path>/_versions/<file name>/r<NNNN>/<file name>

The name is the official downloaded name or the local name, never a hash. `public/raw/` is a protected archive: this package
never registers, writes or deletes a key under it.
"""
from __future__ import annotations

from pathlib import PurePosixPath

VERSIONS_DIR = "_versions"
RESERVED_NAMES = frozenset({VERSIONS_DIR})
RESERVED_ROOTS = frozenset({"raw", "tmp", "content"})
PROTECTED_PREFIXES = ("public/raw/",)
TMP_PREFIX = "private/tmp/"


class NameError_(ValueError):
    """A folder or file name that cannot become a key segment."""


def check_name(name: str, *, root: bool = False) -> None:
    if not name or name != name.strip() or "/" in name or name in (".", "..") or any(ord(c) < 32 for c in name) or len(name) > 255:
        raise NameError_(f"invalid name {name!r}")
    if name in RESERVED_NAMES or (root and name in RESERVED_ROOTS):
        raise NameError_(f"{name!r} is a reserved name")


def current_key(access: str, folder_path: str, name: str) -> str:
    """Key of a file's current version; `folder_path` is the registry path of its folder (leading slash)."""
    return f"{access}{folder_path}/{name}"


def archive_key(access: str, folder_path: str, name: str, revision: int) -> str:
    """Key of a superseded retained revision: the version folder beside the file, original name kept."""
    return f"{access}{folder_path}/{VERSIONS_DIR}/{name}/r{revision:04d}/{name}"


def is_protected(key: str) -> bool:
    return key.startswith(PROTECTED_PREFIXES)


def sibling_name(name: str, sha256: str) -> str:
    """Name for a different file that arrives with a name already taken: <stem>~<sha8><suffixes>."""
    path = PurePosixPath(name)
    suffix = "".join(path.suffixes[-2:]) if len(path.suffixes) > 1 and path.suffixes[-2] in (".tar",) else path.suffix
    stem = name[: len(name) - len(suffix)] if suffix else name
    return f"{stem}~{sha256[:8]}{suffix}"
