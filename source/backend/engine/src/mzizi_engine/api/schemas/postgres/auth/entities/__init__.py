"""Row models of the Auth group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.auth.entities.accounts import AccountsRow
from mzizi_engine.api.schemas.postgres.auth.entities.delegation_roles import DelegationRolesRow
from mzizi_engine.api.schemas.postgres.auth.entities.delegations import DelegationsRow
from mzizi_engine.api.schemas.postgres.auth.entities.invitations import InvitationsRow
from mzizi_engine.api.schemas.postgres.auth.entities.login_identities import LoginIdentitiesRow
from mzizi_engine.api.schemas.postgres.auth.entities.memberships import AuthMembershipsRow
from mzizi_engine.api.schemas.postgres.auth.entities.permissions import PermissionsRow
from mzizi_engine.api.schemas.postgres.auth.entities.role_assignments import RoleAssignmentsRow
from mzizi_engine.api.schemas.postgres.auth.entities.role_permissions import RolePermissionsRow
from mzizi_engine.api.schemas.postgres.auth.entities.roles import RolesRow
from mzizi_engine.api.schemas.postgres.auth.entities.scopes import ScopesRow

__all__ = [
    "AccountsRow",
    "AuthMembershipsRow",
    "DelegationRolesRow",
    "DelegationsRow",
    "InvitationsRow",
    "LoginIdentitiesRow",
    "PermissionsRow",
    "RoleAssignmentsRow",
    "RolePermissionsRow",
    "RolesRow",
    "ScopesRow",
]
