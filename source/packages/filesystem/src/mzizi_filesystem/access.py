"""Access classes and the S3 prefix contract.

Bucket `mzizi`, region `us-east-1`. Only the `public/` prefix is anonymously readable; `internal/`, `restricted/`,
`private/` and every other prefix are private. An object's key prefix must agree with the effective access of the
artifact it holds, and deduplication never merges objects across access boundaries.
"""
from __future__ import annotations

BUCKET = "mzizi"
REGION = "us-east-1"
ACCESS_CLASSES = ("public", "internal", "restricted", "private")


class AccessError(ValueError):
    pass


def prefix_of(key: str) -> str:
    return key.split("/", 1)[0]


def is_anonymously_readable(key: str) -> bool:
    """Only keys under public/ can be read without credentials."""
    return prefix_of(key) == "public"


def check_key_matches_access(key: str, access: str) -> None:
    if access not in ACCESS_CLASSES:
        raise AccessError(f"unknown access class {access!r}")
    if key.startswith("/") or ".." in key.split("/"):
        raise AccessError(f"invalid object key {key!r}")
    if prefix_of(key) != access:
        raise AccessError(f"object key {key!r} sits under {prefix_of(key)!r} but the artifact's effective access is {access!r}")
