"""Fresh start and verification: wipe the registry and the bucket (never the protected archive), and compare registry with bucket.

`public/raw/` is an archive that predates this registry. Nothing here lists it for deletion, and the stores refuse to write or
delete a key under it. Every operation is a dry run unless `apply` is given.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

import psycopg

from mzizi_engine.ports import Connection, Row, required
from mzizi_filesystem.keys import PROTECTED_PREFIXES, TMP_PREFIX, is_protected
from mzizi_filesystem.store import ObjectStore, StoreError

TABLES = ("uploads", "file_relations", "taggings", "file_versions", "files", "folders", "tags")


def _prefix(key: str) -> str:
    parts = key.split("/")
    return "/".join(parts[:2]) + "/" if len(parts) > 2 else parts[0]


def bucket_summary(store: ObjectStore) -> dict:
    """Objects and bytes per two-segment prefix, split into protected and removable."""
    out: dict = {"protected": {}, "removable": {}}
    for key, size in store.list_keys(""):
        bucket = out["protected" if is_protected(key) else "removable"].setdefault(
            _prefix(key), {"objects": 0, "bytes": 0}
        )
        bucket["objects"] += 1
        bucket["bytes"] += size
    return out


def wipe_bucket(store: ObjectStore, *, dry_run: bool = True) -> dict:
    """Deletes every object outside the protected prefixes. The protected set is counted before and after and must not change."""
    before = bucket_summary(store)
    report = {
        "dry_run": dry_run,
        "protected_prefixes": list(PROTECTED_PREFIXES),
        "protected": before["protected"],
        "removable": before["removable"],
        "deleted": 0,
    }
    if dry_run:
        return report
    batch: list[str] = []
    for key, _ in list(store.list_keys("")):
        if is_protected(key):
            continue
        batch.append(key)
        if len(batch) == 1000:
            report["deleted"] += store.delete_many(batch)
            batch = []
    if batch:
        report["deleted"] += store.delete_many(batch)
    after = bucket_summary(store)
    report["remaining_removable"] = after["removable"]
    if after["protected"] != before["protected"]:
        raise StoreError("the protected archive changed during the wipe; stop and investigate")
    return report


def external_references(conn: Connection) -> list[dict]:
    """Tables outside the filesystem schema whose rows point at filesystem rows (they block a registry wipe)."""
    rows = conn.execute(
        """SELECT c.conrelid::regclass::text AS tbl, a.attname AS col FROM pg_constraint c JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = c.conkey[1]
            WHERE c.contype = 'f' AND c.confrelid::regclass::text LIKE 'filesystem.%%' AND c.conrelid::regclass::text NOT LIKE 'filesystem.%%' ORDER BY 1, 2"""
    ).fetchall()
    out = []
    for r in rows:
        n = required(conn.execute(f"SELECT count(*) AS n FROM {r['tbl']} WHERE {r['col']} IS NOT NULL").fetchone())["n"]
        if n:
            out.append({"table": r["tbl"], "column": r["col"], "rows": n})
    return out


def wipe_registry(conn: Connection, *, dry_run: bool = True, drop_dependents: bool = False) -> dict:
    """Deletes every filesystem row in one transaction. Rows of other schemas that reference file versions block the wipe unless
    `drop_dependents` is given, in which case exactly those rows are deleted too (they must be reloaded from seed afterwards)."""
    counts = {t: required(conn.execute(f"SELECT count(*) AS n FROM filesystem.{t}").fetchone())["n"] for t in TABLES}
    refs = external_references(conn)
    report: dict[str, Any] = {"dry_run": dry_run, "rows": counts, "dependents": refs, "deleted_dependents": {}}
    if refs and not drop_dependents:
        report["error"] = (
            "rows in other schemas reference file versions; pass --drop-dependents to delete them and reload them from seed afterwards"
        )
        return report
    if dry_run:
        return report
    with conn.transaction():
        pending = list(refs)
        for _ in range(len(pending) + 1):  # delete in whatever order the foreign keys between the dependents allow
            still = []
            for ref in pending:
                try:
                    with conn.transaction():
                        done = conn.execute(f"DELETE FROM {ref['table']} WHERE {ref['column']} IS NOT NULL").rowcount
                    report["deleted_dependents"][ref["table"]] = (
                        report["deleted_dependents"].get(ref["table"], 0) + done
                    )
                except psycopg.errors.ForeignKeyViolation:
                    still.append(ref)
            pending = still
            if not pending:
                break
        if pending:
            raise RuntimeError(f"cannot delete dependents {[p['table'] for p in pending]}: other rows reference them")
        conn.execute("DELETE FROM filesystem.uploads")
        conn.execute("DELETE FROM filesystem.file_relations")
        conn.execute("DELETE FROM filesystem.taggings")
        conn.execute("UPDATE filesystem.file_versions SET pinned = false, pin_reason = NULL WHERE pinned")
        conn.execute("UPDATE filesystem.files SET current_version_id = NULL")
        conn.execute("DELETE FROM filesystem.file_versions")
        conn.execute("DELETE FROM filesystem.files")
        while conn.execute(
            "DELETE FROM filesystem.folders WHERE id NOT IN (SELECT parent_id FROM filesystem.folders WHERE parent_id IS NOT NULL)"
        ).rowcount:
            pass
        conn.execute("DELETE FROM filesystem.tags")
    report["remaining"] = {
        t: required(conn.execute(f"SELECT count(*) AS n FROM filesystem.{t}").fetchone())["n"] for t in TABLES
    }
    return report


@dataclass
class VerifyReport:
    versions: int = 0
    ok: int = 0
    missing: list[str] = field(default_factory=list)
    mismatched: list[str] = field(default_factory=list)
    misplaced: list[str] = field(default_factory=list)
    unregistered: list[str] = field(default_factory=list)
    protected_objects: int = 0

    @property
    def clean(self) -> bool:
        return not (self.missing or self.mismatched or self.misplaced or self.unregistered)


def verify_registry(conn: Connection, store: ObjectStore) -> VerifyReport:
    """Registry against bucket: every version's object exists at its computed key with the registered size and hash, and no object
    outside the protected archive and the temporary upload area is unregistered."""
    report = VerifyReport()
    listed = dict(store.list_keys(""))
    registered: dict[str, Row] = {}
    for row in conn.execute(
        "SELECT id, s3_key, sha256, size_bytes, filesystem.version_key(id) AS expected FROM filesystem.file_versions"
    ).fetchall():
        report.versions += 1
        registered[row["s3_key"]] = row
        if row["s3_key"] != row["expected"]:
            report.misplaced.append(f"{row['s3_key']} (expected {row['expected']})")
        if row["s3_key"] not in listed:
            report.missing.append(row["s3_key"])
            continue
        head = store.head(row["s3_key"])
        if head is None or head.size != row["size_bytes"] or head.sha256 != row["sha256"]:
            report.mismatched.append(row["s3_key"])
        else:
            report.ok += 1
    for key in listed:
        if is_protected(key):
            report.protected_objects += 1
        elif key not in registered and not key.startswith(TMP_PREFIX):
            report.unregistered.append(key)
    return report
