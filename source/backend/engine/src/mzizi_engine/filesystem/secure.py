"""Security files (signing keys, old credential files) live in the private area of the object store, not in the working tree.

`fetch_secure_file` downloads one into a git-ignored local cache (mode 0600) and returns its path, so code that needs a key reads it
through one function. Registry versions are located by logical path; the store key never leaves this module's callers."""

from __future__ import annotations

import os
from pathlib import Path

from mzizi_filesystem.env import repo_root
from mzizi_filesystem.store import ObjectStore

from ..ports import Connection

SECURITY_FOLDER = "/security"


def cache_dir() -> Path:
    return Path(os.environ.get("MZIZI_SECURE_DIR") or repo_root() / ".local" / "secure")


def fetch_secure_file(conn: Connection, store: ObjectStore, logical_path: str, *, refresh: bool = False) -> Path:
    """Returns the local path of `/security/<logical_path>`, downloading and hash-verifying it when absent."""
    rel = logical_path.strip("/")
    if ".." in rel.split("/"):
        raise ValueError("path escapes the security folder")
    row = conn.execute(
        """SELECT v.s3_key, v.sha256 FROM filesystem.paths fp
           JOIN filesystem.files f ON f.id = fp.id AND fp.kind = 'file' JOIN filesystem.file_versions v ON v.id = f.current_version_id
           WHERE fp.path = %s""",
        (f"{SECURITY_FOLDER}/{rel}",),
    ).fetchone()
    if row is None:
        raise FileNotFoundError(f"no registered security file {SECURITY_FOLDER}/{rel}")
    target = cache_dir() / rel
    if target.is_file() and not refresh:
        return target
    import hashlib

    target.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    digest, tmp = hashlib.sha256(), target.with_name(target.name + ".part")
    with open(os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600), "wb") as out:
        for chunk in store.open_stream(row["s3_key"]):
            digest.update(chunk)
            out.write(chunk)
    if digest.hexdigest() != row["sha256"]:
        tmp.unlink()
        raise ValueError("downloaded security file failed hash verification")
    tmp.replace(target)
    return target
