"""Authorization port. The package never reimplements access rules; a caller supplies an `Authorizer`.

Permissions (namespace `filesystem`): edit = create folders, upload, replace content, move files; read = read and download;
publish = change a folder's access class; delete = remove files or content; export reserved. Folder scopes follow the folder
hierarchy (a grant on a folder covers everything below it). The database-backed authorizer that asks the `auth` schema
(`auth.can_link`, `auth.can`, `auth.can_change`) is owned by the orchestrator that may hold a database connection,
since this package never may; it only defines the shape every authorizer must have.
"""

from __future__ import annotations

from typing import Protocol


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
