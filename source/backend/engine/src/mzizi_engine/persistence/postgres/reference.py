"""Reference values the filesystem needs: a folder's role is a reference value, so seed folders need role values to exist.

The engine owns this because the roles come from seed folder descriptors, not from code. A scheme for folder roles and one value
per role are created on first use and found again by their codes afterwards.
"""

from __future__ import annotations

from collections.abc import Collection
from uuid import UUID, uuid4

from mzizi_engine.persistence.postgres.connection import Connection

ROLE_SCHEME_CODE = "filesystem.folder_roles"
ROLE_SCHEME_TITLE = "Filesystem folder roles"


class PostgresReference:
    def __init__(self, conn: Connection) -> None:
        self._conn = conn

    def role_ids(self, roles: Collection[str], *, create: bool) -> dict[str, str]:
        """Reference value ids for the role names. With `create`, missing schemes and values are written; without it, absent."""
        scheme = self._scheme(create=create)
        found: dict[str, str] = {}
        for role in sorted(set(roles)):
            code = f"{ROLE_SCHEME_CODE}.{role}"
            row = self._conn.execute(
                'SELECT id FROM reference."values" WHERE code = %s AND deleted_at IS NULL', (code,)
            ).fetchone()
            if row is not None:
                found[role] = str(row["id"])
            elif create and scheme is not None:
                value_id = uuid4()
                self._conn.execute(
                    'INSERT INTO reference."values" (id, created_at, updated_at, version, code, label, scheme_id) '
                    "VALUES (%s, now(), now(), 1, %s, %s, %s)",
                    (value_id, code, role, scheme),
                )
                found[role] = str(value_id)
        return found

    def _scheme(self, *, create: bool) -> UUID | None:
        row = self._conn.execute(
            "SELECT id FROM reference.schemes WHERE code = %s AND deleted_at IS NULL", (ROLE_SCHEME_CODE,)
        ).fetchone()
        if row is not None:
            return UUID(str(row["id"]))
        if not create:
            return None
        scheme_id = uuid4()
        self._conn.execute(
            "INSERT INTO reference.schemes (id, created_at, updated_at, version, code, title, owner_snapshot) "
            "VALUES (%s, now(), now(), 1, %s, %s, %s)",
            (scheme_id, ROLE_SCHEME_CODE, ROLE_SCHEME_TITLE, '{"owner": "engine"}'),
        )
        return scheme_id
