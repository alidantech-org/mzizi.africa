"""Authorization port. The package never reimplements access rules: it asks the `auth` schema (auth.can_link, auth.can, auth.can_change).

Permissions (namespace `filesystem`): edit = create folders, upload, replace content, move files; read = read and download;
publish = change a folder's access class; delete = remove files or content; export reserved. Folder scopes follow the folder
hierarchy (a grant on a folder covers everything below it). Operator mode (no actor) exists for local repository tooling only.
"""

from __future__ import annotations

from typing import Protocol

from mzizi_database import Connection, required

from .repository import PermissionDenied


class Authorizer(Protocol):
    def for_platform(self, actor: str | None, permission: str) -> None: ...
    def for_new_child(self, actor: str | None, permission: str, table: str, parent_folder_id: str | None) -> None: ...
    def for_record(self, actor: str | None, permission: str, table: str, record_id: str) -> None: ...
    def for_move(
        self, actor: str | None, permission: str, table: str, record_id: str, new_link_id: str | None
    ) -> None: ...


class OperatorAuthorizer:
    """Allows everything. Only for local repository commands run by the operator against the disposable database."""

    def for_platform(self, actor: str | None, permission: str) -> None:
        return None

    def for_new_child(self, actor: str | None, permission: str, table: str, parent_folder_id: str | None) -> None:
        return None

    def for_record(self, actor: str | None, permission: str, table: str, record_id: str) -> None:
        return None

    def for_move(self, actor: str | None, permission: str, table: str, record_id: str, new_link_id: str | None) -> None:
        return None


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
