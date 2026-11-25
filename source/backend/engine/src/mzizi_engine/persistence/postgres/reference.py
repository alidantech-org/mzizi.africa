"""Vocabulary terms the filesystem needs: a folder's role is a term of the folder-role scheme (`filesystem.folders.role_term`).

The engine owns this because the roles come from the caller's folder descriptors, not from code. The scheme and one term per role
are created on first use and found again by their codes afterwards (`.docs/rules/codes.md`).
"""

from __future__ import annotations

from collections.abc import Collection
from uuid import UUID, uuid4

from mzizi_engine.persistence.postgres.connection import Connection

ROLE_SCHEME_PATH = "fil.folder.role"
ROLE_SCHEME_CODE = f"voc.sch.{ROLE_SCHEME_PATH}"


def role_code(role: str) -> str:
    """The term code of a role name: the scheme path plus the name with underscores as dashes."""
    return f"{ROLE_SCHEME_PATH}.{role.replace('_', '-')}"


class PostgresReference:
    def __init__(self, conn: Connection) -> None:
        self._conn = conn

    def role_ids(self, roles: Collection[str], *, create: bool) -> dict[str, str]:
        """Term ids for the role names. With `create`, a missing scheme and terms are written; without it, absent."""
        scheme = self._scheme(create=create)
        found: dict[str, str] = {}
        for role in sorted(set(roles)):
            code = role_code(role)
            row = self._conn.execute(
                "SELECT id FROM vocabulary.terms WHERE code = %s AND deleted_at IS NULL", (code,)
            ).fetchone()
            if row is not None:
                found[role] = str(row["id"])
            elif create and scheme is not None:
                term_id = uuid4()
                self._conn.execute(
                    "INSERT INTO vocabulary.terms (id, created_at, updated_at, version, code, scheme_id, status) "
                    "VALUES (%s, now(), now(), 1, %s, %s, 'active')",
                    (term_id, code, scheme),
                )
                found[role] = str(term_id)
        return found

    def _scheme(self, *, create: bool) -> UUID | None:
        row = self._conn.execute(
            "SELECT id FROM vocabulary.schemes WHERE code = %s AND deleted_at IS NULL", (ROLE_SCHEME_CODE,)
        ).fetchone()
        if row is not None:
            return UUID(str(row["id"]))
        if not create:
            return None
        scheme_id = uuid4()
        self._conn.execute(
            "INSERT INTO vocabulary.schemes (id, created_at, updated_at, version, code, shape, answers, is_dated, is_open) "
            "VALUES (%s, now(), now(), 1, %s, 'flat', 'one', false, true)",
            (scheme_id, ROLE_SCHEME_CODE),
        )
        return scheme_id
