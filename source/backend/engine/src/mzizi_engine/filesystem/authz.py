"""Database-backed authorization: asks the `auth` schema (`auth.can_link`, `auth.can`, `auth.can_change`) over the
database port. The filesystem package defines the `Authorizer` shape; only the engine may hold this implementation,
since only the engine may know a database exists.
"""

from __future__ import annotations

from mzizi_filesystem.authz import Authorizer, OperatorAuthorizer

from ..ports import Connection, required
from .repository import PermissionDenied

__all__ = ["Authorizer", "DatabaseAuthorizer", "OperatorAuthorizer"]


class DatabaseAuthorizer:
    def __init__(self, conn: Connection) -> None:
        self.conn = conn

    def _check(self, decision: dict, what: str) -> None:
        if not decision["allowed"]:
            raise PermissionDenied(
                f"{what} denied: {decision['reason']}"
                + (f" ({decision.get('failed_on')})" if decision.get("failed_on") else "")
            )

    def for_platform(self, actor: str | None, permission: str) -> None:
        if actor is None:
            raise PermissionDenied("an authenticated actor is required")
        allowed = required(
            self.conn.execute("SELECT auth.can_platform(%s, %s) AS allowed", (actor, permission)).fetchone()
        )["allowed"]
        if not allowed:
            raise PermissionDenied(f"{permission} is required")

    def for_new_child(self, actor: str | None, permission: str, table: str, parent_folder_id: str | None) -> None:
        if actor is None:
            raise PermissionDenied("an authenticated actor is required")
        row = required(
            self.conn.execute(
                "SELECT auth.can_link(%s, %s, %s, %s) AS r", (actor, permission, table, parent_folder_id)
            ).fetchone()
        )
        self._check(row["r"], f"{permission} on {table}")

    def for_record(self, actor: str | None, permission: str, table: str, record_id: str) -> None:
        if actor is None:
            raise PermissionDenied("an authenticated actor is required")
        self._check(
            required(
                self.conn.execute(
                    "SELECT auth.can(%s, %s, %s, %s) AS r", (actor, permission, table, record_id)
                ).fetchone()
            )["r"],
            f"{permission} on {table}",
        )

    def for_move(self, actor: str | None, permission: str, table: str, record_id: str, new_link_id: str | None) -> None:
        if actor is None:
            raise PermissionDenied("an authenticated actor is required")
        self._check(
            required(
                self.conn.execute(
                    "SELECT auth.can_change(%s, %s, %s, %s, %s) AS r",
                    (actor, permission, table, record_id, new_link_id),
                ).fetchone()
            )["r"],
            f"move on {table}",
        )
