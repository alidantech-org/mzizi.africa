"""PostgreSQL repository for the filesystem schema (mzizi_new). All writes of one logical operation share one transaction.

The caller owns the connection and the outer transaction boundary; `transaction()` opens one when none is active and ends with
the deferred integrity checks (current version belongs to its file, placement matches access) so violations surface immediately.
"""

from __future__ import annotations

from collections.abc import Iterator
from contextlib import contextmanager
from typing import Any

from psycopg.types.json import Jsonb

from ..ports import Connection, Row, required

FOLDER_FIELDS = (
    "access",
    "access_authorization",
    "allow_weaker_children",
    "artifact_role",
    "is_seed",
    "acquisition_class",
    "preparation",
    "jurisdiction_code",
    "description",
    "metadata",
    "code",
)


class Conflict(Exception):
    """A conditional update lost a race, or the request contradicts registered state."""


class PermissionDenied(Exception):
    pass


def _jsonb(value: Any) -> Any:
    return Jsonb(value) if isinstance(value, (dict, list)) else value


class Repository:
    def __init__(self, conn: Connection) -> None:
        self.conn = conn

    @contextmanager
    def transaction(self) -> Iterator[Repository]:
        with self.conn.transaction():
            yield self
            self.conn.execute("SET CONSTRAINTS ALL IMMEDIATE")  # run the deferred integrity checks now ...
            self.conn.execute(
                "SET CONSTRAINTS ALL DEFERRED"
            )  # ... then restore deferral for whatever follows in an outer transaction

    # ------------------------------------------------------------------------------------------ folders
    def get_folder(self, folder_id: str) -> Row | None:
        return self.conn.execute("SELECT * FROM filesystem.folders WHERE id = %s", (folder_id,)).fetchone()

    def find_folder(self, parent_id: str | None, name: str) -> Row | None:
        return self.conn.execute(
            "SELECT * FROM filesystem.folders WHERE parent_id IS NOT DISTINCT FROM %s AND name = %s", (parent_id, name)
        ).fetchone()

    def folder_by_code(self, code: str) -> Row | None:
        return self.conn.execute("SELECT * FROM filesystem.folders WHERE code = %s", (code,)).fetchone()

    def folder_path(self, folder_id: str) -> str:
        return required(self.conn.execute("SELECT filesystem.folder_path(%s) AS p", (folder_id,)).fetchone())["p"]

    def folder_by_path(self, path: str) -> Row | None:
        row = None
        for part in [p for p in path.split("/") if p]:
            row = self.find_folder(row["id"] if row else None, part)
            if row is None:
                return None
        return row

    def effective(self, folder_id: str) -> Row:
        return required(self.conn.execute("SELECT * FROM filesystem.effective_folder(%s)", (folder_id,)).fetchone())

    def create_folder(self, parent_id: str | None, name: str, fields: dict, actor: str | None) -> Row:
        cols = {k: _jsonb(v) for k, v in fields.items() if k in FOLDER_FIELDS and v is not None}
        names = ", ".join(["parent_id", "name", "created_by", *cols])
        marks = ", ".join(["%s"] * (3 + len(cols)))
        return required(
            self.conn.execute(
                f"INSERT INTO filesystem.folders ({names}) VALUES ({marks}) RETURNING *",
                (parent_id, name, actor, *cols.values()),
            ).fetchone()
        )

    def update_folder(self, folder_id: str, expected_revision: int, fields: dict) -> Row:
        cols = {k: _jsonb(v) for k, v in fields.items() if k in FOLDER_FIELDS}
        sets = ", ".join(f"{k} = %s" for k in cols)
        row = self.conn.execute(
            f"UPDATE filesystem.folders SET {sets} WHERE id = %s AND revision = %s RETURNING *",
            (*cols.values(), folder_id, expected_revision),
        ).fetchone()
        if row is None:
            raise Conflict(f"folder {folder_id} changed concurrently (expected revision {expected_revision})")
        return row

    # -------------------------------------------------------------------------------------------- files
    def get_file(self, file_id: str) -> Row | None:
        return self.conn.execute("SELECT * FROM filesystem.files WHERE id = %s", (file_id,)).fetchone()

    def file_by_code(self, code: str) -> Row | None:
        return self.conn.execute("SELECT * FROM filesystem.files WHERE code = %s", (code,)).fetchone()

    def find_file(self, folder_id: str, name: str) -> Row | None:
        return self.conn.execute(
            "SELECT * FROM filesystem.files WHERE folder_id = %s AND name = %s", (folder_id, name)
        ).fetchone()

    def get_version(self, version_id: str) -> Row | None:
        return self.conn.execute("SELECT * FROM filesystem.file_versions WHERE id = %s", (version_id,)).fetchone()

    def versions(self, file_id: str) -> list[Row]:
        return self.conn.execute(
            "SELECT * FROM filesystem.file_versions WHERE file_id = %s ORDER BY revision", (file_id,)
        ).fetchall()

    def find_same_content(self, access: str, sha256: str, size: int, exclude_file_id: str | None = None) -> Row | None:
        """A current version holding these exact bytes inside the same access class (never across classes), with its file path; else None."""
        return self.conn.execute(
            """SELECT v.*, filesystem.file_path(f.id) AS path FROM filesystem.file_versions v JOIN filesystem.files f ON f.current_version_id = v.id
                WHERE v.sha256 = %s AND v.size_bytes = %s AND split_part(v.s3_key, '/', 1) = %s AND (%s::uuid IS NULL OR f.id <> %s)
                ORDER BY v.created_at LIMIT 1""",
            (sha256, size, access, exclude_file_id, exclude_file_id),
        ).fetchone()

    def duplicates(self, limit: int = 200) -> list[Row]:
        """Groups of current versions with equal bytes (same sha256 and size), largest waste first."""
        return self.conn.execute(
            """SELECT v.sha256, v.size_bytes, count(*) AS copies, array_agg(filesystem.file_path(f.id) ORDER BY filesystem.file_path(f.id)) AS paths
                 FROM filesystem.file_versions v JOIN filesystem.files f ON f.current_version_id = v.id
                GROUP BY v.sha256, v.size_bytes HAVING count(*) > 1 ORDER BY v.size_bytes * (count(*) - 1) DESC LIMIT %s""",
            (limit,),
        ).fetchall()

    def version_protected(self, version_id: str) -> bool:
        """Pinned, or taking part in a derivation relation: such a version is never dropped."""
        return bool(
            self.conn.execute(
                """SELECT 1 FROM filesystem.file_versions v WHERE v.id = %s AND (v.pinned OR EXISTS (SELECT 1 FROM filesystem.file_relations r WHERE r.source_version_id = v.id OR r.derived_version_id = v.id))""",
                (version_id,),
            ).fetchone()
        )

    def expected_key(self, version_id: str) -> str | None:
        row = self.conn.execute("SELECT filesystem.version_key(%s) AS k", (version_id,)).fetchone()
        return row["k"] if row else None

    def key_in_use(self, key: str) -> bool:
        return bool(required(self.conn.execute("SELECT filesystem.key_in_use(%s) AS u", (key,)).fetchone())["u"])

    def _insert_version(self, file_id: str, revision: int, v: dict, actor: str | None) -> Row:
        return required(
            self.conn.execute(
                """INSERT INTO filesystem.file_versions (file_id, revision, s3_key, sha256, size_bytes, extension, content_type, original_filename, provenance, pinned, pin_reason, created_by)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING *""",
                (
                    file_id,
                    revision,
                    v["s3_key"],
                    v["sha256"],
                    v["size_bytes"],
                    v.get("extension"),
                    v["content_type"],
                    v.get("original_filename"),
                    Jsonb(v["provenance"]),
                    bool(v.get("pin_reason")),
                    v.get("pin_reason"),
                    actor,
                ),
            ).fetchone()
        )

    def create_file_with_version(
        self, folder_id: str, name: str, code: str | None, retention: str, version: dict, actor: str | None
    ) -> tuple[Row, Row]:
        """The file/version creation cycle in one transaction: file without a current pointer, first version, pointer set, deferred checks run."""
        with self.transaction():
            file = required(
                self.conn.execute(
                    "INSERT INTO filesystem.files (folder_id, name, code, retention, created_by) VALUES (%s, %s, %s, %s, %s) RETURNING *",
                    (folder_id, name, code, retention, actor),
                ).fetchone()
            )
            created = self._insert_version(file["id"], 1, version, actor)
            file = required(
                self.conn.execute(
                    "UPDATE filesystem.files SET current_version_id = %s WHERE id = %s RETURNING *",
                    (created["id"], file["id"]),
                ).fetchone()
            )
        return file, created

    def add_version(
        self, file_id: str, expected_revision: int, version: dict, actor: str | None, archive_key: str | None = None
    ) -> tuple[Row, Row, list[Row]]:
        """A new current version under optimistic concurrency. Returns (file, version, pruned versions).

        The superseded current version leaves the readable key first (a key belongs to one version): it is repointed to `archive_key`,
        where the service has already preserved and verified its bytes. Under replace_current, unpinned superseded versions that no
        relation references are then dropped; their keys are returned for explicit cleanup, never deleted here."""
        with self.transaction():
            file = self.conn.execute(
                "SELECT * FROM filesystem.files WHERE id = %s AND revision = %s FOR UPDATE",
                (file_id, expected_revision),
            ).fetchone()
            if file is None:
                raise Conflict(f"file {file_id} changed concurrently (expected revision {expected_revision})")
            if file["current_version_id"] and archive_key:
                self.relocate_version(file["current_version_id"], archive_key)
            new = self._insert_version(file_id, file["last_revision"] + 1, version, actor)
            updated = required(
                self.conn.execute(
                    "UPDATE filesystem.files SET current_version_id = %s WHERE id = %s RETURNING *",
                    (new["id"], file_id),
                ).fetchone()
            )
            pruned: list[Row] = []
            if file["retention"] == "replace_current":
                old = self.conn.execute(
                    """SELECT v.* FROM filesystem.file_versions v WHERE v.file_id = %s AND v.id <> %s AND NOT v.pinned
                         AND NOT EXISTS (SELECT 1 FROM filesystem.file_relations r WHERE r.source_version_id = v.id OR r.derived_version_id = v.id)""",
                    (file_id, new["id"]),
                ).fetchall()
                for row in old:
                    self.conn.execute("DELETE FROM filesystem.file_versions WHERE id = %s", (row["id"],))
                    pruned.append(row)
        return updated, new, pruned

    def set_file_place(self, file_id: str, expected_revision: int, folder_id: str, name: str) -> Row:
        """Row change only; the caller relocates the objects in the same transaction (transitions.move_file)."""
        row = self.conn.execute(
            "UPDATE filesystem.files SET folder_id = %s, name = %s WHERE id = %s AND revision = %s RETURNING *",
            (folder_id, name, file_id, expected_revision),
        ).fetchone()
        if row is None:
            raise Conflict(f"file {file_id} changed concurrently")
        return row

    def set_folder_place(self, folder_id: str, expected_revision: int, parent_id: str | None, name: str) -> Row:
        """Row change only; the caller relocates the objects in the same transaction (transitions.move_folder)."""
        row = self.conn.execute(
            "UPDATE filesystem.folders SET parent_id = %s, name = %s WHERE id = %s AND revision = %s RETURNING *",
            (parent_id, name, folder_id, expected_revision),
        ).fetchone()
        if row is None:
            raise Conflict(f"folder {folder_id} changed concurrently")
        return row

    def delete_file(self, file_id: str, expected_revision: int) -> list[Row]:
        """Removes a file and its unpinned, unreferenced versions in one transaction; returns the removed versions (their keys await explicit cleanup).
        Refuses when any version is pinned or takes part in a relation."""
        with self.transaction():
            file = self.conn.execute(
                "SELECT * FROM filesystem.files WHERE id = %s AND revision = %s FOR UPDATE",
                (file_id, expected_revision),
            ).fetchone()
            if file is None:
                raise Conflict(f"file {file_id} changed concurrently")
            versions = self.versions(file_id)
            blocked = [
                v
                for v in versions
                if v["pinned"]
                or self.conn.execute(
                    "SELECT 1 FROM filesystem.file_relations WHERE source_version_id = %s OR derived_version_id = %s",
                    (v["id"], v["id"]),
                ).fetchone()
            ]
            if blocked:
                raise Conflict(
                    f"file {file_id} has pinned or relation-referenced versions ({len(blocked)}) and cannot be deleted"
                )
            self.conn.execute("UPDATE filesystem.files SET current_version_id = NULL WHERE id = %s", (file_id,))
            for v in versions:
                self.conn.execute("DELETE FROM filesystem.file_versions WHERE id = %s", (v["id"],))
            self.conn.execute("DELETE FROM filesystem.files WHERE id = %s", (file_id,))
        return versions

    def set_pin(self, version_id: str, reason: str | None) -> Row:
        return required(
            self.conn.execute(
                "UPDATE filesystem.file_versions SET pinned = %s, pin_reason = %s WHERE id = %s RETURNING *",
                (reason is not None, reason, version_id),
            ).fetchone()
        )

    def relocate_version(self, version_id: str, new_key: str) -> None:
        self.conn.execute("UPDATE filesystem.file_versions SET s3_key = %s WHERE id = %s", (new_key, version_id))

    # --------------------------------------------------------------------------------------------- tags
    def tag(
        self, name: str, target_kind: str, target_id: str, actor: str | None, description: str | None = None
    ) -> bool:
        tag = required(
            self.conn.execute(
                "INSERT INTO filesystem.tags (name, description) VALUES (%s, %s) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id",
                (name, description),
            ).fetchone()
        )
        col = "file_id" if target_kind == "file" else "folder_id"
        return (
            self.conn.execute(
                f"INSERT INTO filesystem.taggings (tag_id, {col}, tagged_by) VALUES (%s, %s, %s) ON CONFLICT DO NOTHING",
                (tag["id"], target_id, actor),
            ).rowcount
            == 1
        )

    # ----------------------------------------------------------------------------------------- relations
    def link_relation(
        self,
        source_version_id: str,
        derived_version_id: str,
        relation: str = "derived_from",
        engine_job_id: str | None = None,
        actor: str | None = None,
    ) -> bool:
        return (
            self.conn.execute(
                "INSERT INTO filesystem.file_relations (source_version_id, derived_version_id, relation, engine_job_id, created_by) VALUES (%s, %s, %s, %s, %s) ON CONFLICT DO NOTHING",
                (source_version_id, derived_version_id, relation, engine_job_id, actor),
            ).rowcount
            == 1
        )

    # ---------------------------------------------------------------------------------------- uploads
    def create_upload(
        self,
        folder_id: str,
        filename: str,
        temp_key: str,
        lease_seconds: int,
        ttl_seconds: int,
        declared_size: int | None,
        declared_sha256: str | None,
        multipart_id: str | None,
        actor: str | None,
    ) -> Row:
        return required(
            self.conn.execute(
                """INSERT INTO filesystem.uploads (folder_id, filename, temp_key, declared_size, declared_sha256, multipart_id, lease_expires_at, expires_at, created_by)
               VALUES (%s, %s, %s, %s, %s, %s, now() + make_interval(secs => %s), now() + make_interval(secs => %s), %s) RETURNING *""",
                (
                    folder_id,
                    filename,
                    temp_key,
                    declared_size,
                    declared_sha256,
                    multipart_id,
                    min(lease_seconds, ttl_seconds),
                    ttl_seconds,
                    actor,
                ),
            ).fetchone()
        )

    def get_upload(self, upload_id: str) -> Row | None:
        return self.conn.execute("SELECT * FROM filesystem.uploads WHERE id = %s", (upload_id,)).fetchone()

    def renew_upload(self, upload_id: str, lease_seconds: int) -> Row | None:
        return self.conn.execute(
            "UPDATE filesystem.uploads SET lease_expires_at = least(expires_at, now() + make_interval(secs => %s)) WHERE id = %s AND status IN ('pending', 'uploaded') AND expires_at > now() RETURNING *",
            (lease_seconds, upload_id),
        ).fetchone()

    def set_upload(self, upload_id: str, status: str, error: str | None = None, version_id: str | None = None) -> Row:
        return required(
            self.conn.execute(
                "UPDATE filesystem.uploads SET status = %s, error = %s, file_version_id = %s, completed_at = CASE WHEN %s = 'completed' THEN now() END WHERE id = %s RETURNING *",
                (status, error, version_id, status, upload_id),
            ).fetchone()
        )

    def abandoned_candidates(self, limit: int) -> list[Row]:
        return self.conn.execute(
            "SELECT * FROM filesystem.uploads WHERE status IN ('pending', 'uploaded') AND (lease_expires_at < now() OR expires_at < now()) ORDER BY expires_at LIMIT %s",
            (limit,),
        ).fetchall()

    def trim_upload_sessions(self, older_than_days: int, limit: int) -> int:
        return self.conn.execute(
            "DELETE FROM filesystem.uploads WHERE id IN (SELECT id FROM filesystem.uploads WHERE status IN ('completed', 'failed', 'abandoned') AND created_at < now() - make_interval(days => %s) ORDER BY created_at LIMIT %s)",
            (older_than_days, limit),
        ).rowcount
