"""Maintenance helper for tests against the disposable rewrite database: removes a whole test folder tree in dependency order.

It bypasses the retention guards on purpose and must only ever be pointed at rows a test created in mzizi_new."""

from __future__ import annotations

from ..ports import Connection


def purge_tree(conn: Connection, root_id: str) -> None:
    """Remove a test tree (files, versions, relations, uploads, folders). Test data only."""
    with conn.transaction():
        conn.execute("SET CONSTRAINTS ALL DEFERRED")
        folders = [
            r["id"]
            for r in conn.execute(
                "WITH RECURSIVE d AS (SELECT id, 0 AS depth FROM filesystem.folders WHERE id = %s UNION ALL SELECT f.id, d.depth + 1 FROM filesystem.folders f JOIN d ON f.parent_id = d.id) SELECT id FROM d ORDER BY depth DESC",
                (root_id,),
            ).fetchall()
        ]
        files = [
            r["id"]
            for r in conn.execute(
                "SELECT id FROM filesystem.files WHERE folder_id = ANY(%s::uuid[])", (folders,)
            ).fetchall()
        ]
        versions = [
            r["id"]
            for r in conn.execute(
                "SELECT id FROM filesystem.file_versions WHERE file_id = ANY(%s::uuid[])", (files,)
            ).fetchall()
        ]
        conn.execute(
            "DELETE FROM filesystem.file_relations WHERE source_version_id = ANY(%s::uuid[]) OR derived_version_id = ANY(%s::uuid[])",
            (versions, versions),
        )
        conn.execute("DELETE FROM filesystem.uploads WHERE folder_id = ANY(%s::uuid[])", (folders,))
        conn.execute("UPDATE filesystem.files SET current_version_id = NULL WHERE id = ANY(%s::uuid[])", (files,))
        conn.execute(
            "UPDATE filesystem.file_versions SET pinned = false, pin_reason = NULL WHERE id = ANY(%s::uuid[])",
            (versions,),
        )
        conn.execute("DELETE FROM filesystem.file_versions WHERE id = ANY(%s::uuid[])", (versions,))
        conn.execute("DELETE FROM filesystem.files WHERE id = ANY(%s::uuid[])", (files,))
        for fid in folders:
            conn.execute("DELETE FROM filesystem.folders WHERE id = %s", (fid,))
