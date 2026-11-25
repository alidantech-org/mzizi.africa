"""Row models of the Auth group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.auth.entities.accounts import AccountsRow
from mzizi_engine.api.schemas.postgres.auth.entities.allowances import AllowancesRow
from mzizi_engine.api.schemas.postgres.auth.entities.codes import AuthCodesRow
from mzizi_engine.api.schemas.postgres.auth.entities.delegations import DelegationsRow
from mzizi_engine.api.schemas.postgres.auth.entities.grants import GrantsRow
from mzizi_engine.api.schemas.postgres.auth.entities.invitations import InvitationsRow
from mzizi_engine.api.schemas.postgres.auth.entities.logins import LoginsRow
from mzizi_engine.api.schemas.postgres.auth.entities.memberships import AuthMembershipsRow
from mzizi_engine.api.schemas.postgres.auth.entities.permissions import PermissionsRow
from mzizi_engine.api.schemas.postgres.auth.entities.privileges import PrivilegesRow
from mzizi_engine.api.schemas.postgres.auth.entities.roles import AuthRolesRow
from mzizi_engine.api.schemas.postgres.auth.entities.scopes import AuthScopesRow
from mzizi_engine.api.schemas.postgres.geography.entities.features import FeaturesRow
from mzizi_engine.api.schemas.postgres.governance.entities.institutions import InstitutionsRow
from mzizi_engine.api.schemas.postgres.official.entities.individuals import IndividualsRow
from mzizi_engine.api.schemas.postgres.reference.entities.countries import CountriesRow

__all__ = [
    "AccountsRow",
    "AllowancesRow",
    "AuthCodesRow",
    "AuthMembershipsRow",
    "AuthRolesRow",
    "AuthScopesRow",
    "CountriesRow",
    "DelegationsRow",
    "FeaturesRow",
    "GrantsRow",
    "IndividualsRow",
    "InstitutionsRow",
    "InvitationsRow",
    "LoginsRow",
    "PermissionsRow",
    "PrivilegesRow",
]
