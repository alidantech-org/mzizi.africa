"""Minimal files-service interface (DEC-DATA-ENGINE-DESIGN item 7) backed by a local directory.

put-by-hash, get-by-version and a derived result are enough for the first slice. The bytes live
under the store root at an object key derived from the content hash; identical bytes are stored
once however many files or versions use them. This module writes the `filesystem` schema, as the
files service does; the data engine never writes canonical domain tables.
"""
from __future__ import annotations

import hashlib
import mimetypes
import os
import tempfile
from dataclasses import dataclass
from pathlib import Path

import psycopg


@dataclass(frozen=True)
class FileVersionRef:
    file_id: str
    version_id: str
    object_id: str
    version_number: int
    content_hash: str
    size_bytes: int
    mime_type: str


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def object_key(content_hash: str) -> str:
    return f"sha256/{content_hash[:2]}/{content_hash[2:4]}/{content_hash}"


class LocalDirectoryStore:
    def __init__(self, conn: psycopg.Connection, root: str | Path, code: str = "local-dev"):
        self.conn = conn
        self.root = Path(root)
        self.code = code
        self.root.mkdir(parents=True, exist_ok=True)
        self.store_id = self._ensure_store()

    # --- schema rows -------------------------------------------------------------------------
    def _ensure_store(self) -> str:
        row = self.conn.execute("SELECT id FROM filesystem.stores WHERE code = %s", (self.code,)).fetchone()
        if row:
            return str(row["id"])
        row = self.conn.execute(
            """INSERT INTO filesystem.stores (code, kind, configuration_name, tier, is_active, created_at, updated_at, version)
               VALUES (%s, 'local_directory', %s, 'hot', true, now(), now(), 1) RETURNING id""",
            (self.code, str(self.root)),
        ).fetchone()
        return str(row["id"])

    def ensure_folder(self, path: str) -> str:
        if not path.startswith("/"):
            raise ValueError("folder paths start with /")
        parent_id, current = None, ""
        for depth, name in enumerate([p for p in path.split("/") if p], start=1):
            current = f"{current}/{name}"
            row = self.conn.execute("SELECT id FROM filesystem.folders WHERE path = %s", (current,)).fetchone()
            if row:
                parent_id = str(row["id"])
                continue
            row = self.conn.execute(
                """INSERT INTO filesystem.folders (name, path, depth, parent_id, visibility, created_at, updated_at, version)
                   VALUES (%s, %s, %s, %s, 'restricted', now(), now(), 1) RETURNING id""",
                (name, current, depth, parent_id),
            ).fetchone()
            parent_id = str(row["id"])
        if parent_id is None:
            raise ValueError("the root folder cannot hold files")
        return parent_id

    def _format_id(self, mime_type: str, name: str) -> str | None:
        row = self.conn.execute("SELECT id FROM filesystem.formats WHERE mime_type = %s LIMIT 1", (mime_type,)).fetchone()
        if not row and "." in name:
            row = self.conn.execute("SELECT id FROM filesystem.formats WHERE extension = %s LIMIT 1", (name.rsplit(".", 1)[1].lower(),)).fetchone()
        return str(row["id"]) if row else None

    # --- operations --------------------------------------------------------------------------
    def put(self, data: bytes, name: str, folder: str, mime_type: str | None = None, note: str | None = None, uploaded_by: str | None = None) -> FileVersionRef:
        """Stores bytes once (by hash) and records them as a new version of the named file in the folder."""
        mime = mime_type or mimetypes.guess_type(name)[0] or "application/octet-stream"
        digest, size = sha256(data), len(data)
        key = object_key(digest)
        target = self.root / key
        if not target.exists():
            target.parent.mkdir(parents=True, exist_ok=True)
            fd, tmp = tempfile.mkstemp(dir=target.parent)
            with os.fdopen(fd, "wb") as handle:
                handle.write(data)
            os.replace(tmp, target)

        row = self.conn.execute("SELECT id FROM filesystem.objects WHERE store_id = %s AND content_hash = %s AND size_bytes = %s", (self.store_id, digest, size)).fetchone()
        if row:
            object_id = str(row["id"])
        else:
            object_id = str(
                self.conn.execute(
                    """INSERT INTO filesystem.objects (store_id, content_hash, size_bytes, object_key, format_id, scan_status, created_at, updated_at, version)
                       VALUES (%s, %s, %s, %s, %s, 'pending', now(), now(), 1) RETURNING id""",
                    (self.store_id, digest, size, key, self._format_id(mime, name)),
                ).fetchone()["id"]
            )

        folder_id = self.ensure_folder(folder)
        file_row = self.conn.execute("SELECT id FROM filesystem.files WHERE folder_id = %s AND name = %s AND status = 'active'", (folder_id, name)).fetchone()
        created = file_row is None
        if created:
            file_row = self.conn.execute(
                "INSERT INTO filesystem.files (folder_id, name, status, visibility, is_legal_hold, created_at, updated_at, version) VALUES (%s, %s, 'active', 'restricted', false, now(), now(), 1) RETURNING id",
                (folder_id, name),
            ).fetchone()
        file_id = str(file_row["id"])
        number = self.conn.execute("SELECT coalesce(max(version_number), 0) + 1 AS n FROM filesystem.versions WHERE file_id = %s", (file_id,)).fetchone()["n"]
        version_id = str(
            self.conn.execute(
                "INSERT INTO filesystem.versions (file_id, object_id, version_number, note, uploaded_by, created_at, updated_at, version) VALUES (%s, %s, %s, %s, %s, now(), now(), 1) RETURNING id",
                (file_id, object_id, number, note, uploaded_by),
            ).fetchone()["id"]
        )
        self.conn.execute("UPDATE filesystem.files SET current_version_id = %s, updated_at = now() WHERE id = %s", (version_id, file_id))
        self.conn.execute(
            "INSERT INTO filesystem.events (file_id, version_id, kind, occurred_at, created_at, updated_at, version) VALUES (%s, %s, %s, now(), now(), now(), 1)",
            (file_id, version_id, "created" if created else "versioned"),
        )
        return FileVersionRef(file_id, version_id, object_id, number, digest, size, mime)

    def get(self, version_id: str) -> bytes:
        row = self.conn.execute(
            "SELECT o.object_key, o.content_hash, o.size_bytes FROM filesystem.versions v JOIN filesystem.objects o ON o.id = v.object_id WHERE v.id = %s", (version_id,)
        ).fetchone()
        if not row:
            raise KeyError(f"unknown file version {version_id}")
        data = (self.root / row["object_key"]).read_bytes()
        if sha256(data) != row["content_hash"] or len(data) != row["size_bytes"]:
            raise IOError(f"stored bytes for {version_id} do not match their recorded hash")
        return data

    def ref(self, version_id: str) -> FileVersionRef:
        row = self.conn.execute(
            """SELECT v.file_id, v.id, v.object_id, v.version_number, o.content_hash, o.size_bytes, coalesce(f.mime_type, 'application/octet-stream') AS mime
                 FROM filesystem.versions v JOIN filesystem.objects o ON o.id = v.object_id LEFT JOIN filesystem.formats f ON f.id = o.format_id WHERE v.id = %s""",
            (version_id,),
        ).fetchone()
        if not row:
            raise KeyError(version_id)
        return FileVersionRef(str(row["file_id"]), str(row["id"]), str(row["object_id"]), row["version_number"], row["content_hash"], row["size_bytes"], row["mime"])
