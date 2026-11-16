"""Object keys are readable registry paths (decision DEC-FILESYSTEM-READABLE-KEYS).

    current version      <access>/<folder path>/<file name>
    superseded version   <access>/<folder path>/_versions/<file name>/r<NNNN>/<file name>

The name is the official downloaded name or the local name, never a hash. Which prefixes are protected is configuration
(`FilesystemConfig.protected_prefixes`); this module names none.
"""

from __future__ import annotations

from pathlib import PurePosixPath

from mzizi_filesystem.shared.contracts import Access

VERSIONS_DIR = "_versions"
RESERVED_NAMES = frozenset({VERSIONS_DIR})


class InvalidNameError(ValueError):
    """A folder or file name that cannot become a key segment."""


class AccessError(ValueError):
    """An object key that does not agree with its access class, or is not a valid key."""


def check_name(name: str) -> None:
    if (
        not name
        or name != name.strip()
        or "/" in name
        or name in (".", "..")
        or any(ord(c) < 32 for c in name)
        or len(name) > 255
    ):
        raise InvalidNameError(f"invalid name {name!r}")
    if name in RESERVED_NAMES:
        raise InvalidNameError(f"{name!r} is a reserved name")


def prefix_of(key: str) -> str:
    return key.split("/", 1)[0]


def is_anonymously_readable(key: str) -> bool:
    """Only keys under the public access prefix can be read without credentials."""
    return prefix_of(key) == Access.PUBLIC.value


def check_key_matches_access(key: str, access: Access) -> None:
    if key.startswith("/") or ".." in key.split("/"):
        raise AccessError(f"invalid object key {key!r}")
    if prefix_of(key) != access.value:
        raise AccessError(f"object key {key!r} sits under {prefix_of(key)!r} but its access is {access.value!r}")


def current_key(access: Access, folder_path: str, name: str) -> str:
    """Key of a file's current version; `folder_path` is the registry path of its folder (leading slash)."""
    return f"{access.value}{folder_path}/{name}"


def archive_key(access: Access, folder_path: str, name: str, revision: int) -> str:
    """Key of a superseded retained revision: the version folder beside the file, original name kept."""
    return f"{access.value}{folder_path}/{VERSIONS_DIR}/{name}/r{revision:04d}/{name}"


def is_protected(key: str, protected_prefixes: tuple[str, ...]) -> bool:
    return key.startswith(protected_prefixes) if protected_prefixes else False


def sibling_name(name: str, sha256: str) -> str:
    """Name for a different file that arrives with a name already taken: <stem>~<sha8><suffixes>."""
    path = PurePosixPath(name)
    suffix = "".join(path.suffixes[-2:]) if len(path.suffixes) > 1 and path.suffixes[-2] in (".tar",) else path.suffix
    stem = name[: len(name) - len(suffix)] if suffix else name
    return f"{stem}~{sha256[:8]}{suffix}"
