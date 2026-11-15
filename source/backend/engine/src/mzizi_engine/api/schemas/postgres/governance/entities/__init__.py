"""Row models of the Governance group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.geography.entities.units import UnitsRow
from mzizi_engine.api.schemas.postgres.governance.entities.authority_scopes import AuthorityScopesRow
from mzizi_engine.api.schemas.postgres.governance.entities.holders import HoldersRow
from mzizi_engine.api.schemas.postgres.governance.entities.institutions import InstitutionsRow
from mzizi_engine.api.schemas.postgres.governance.entities.mandates import MandatesRow
from mzizi_engine.api.schemas.postgres.governance.entities.offices import OfficesRow
from mzizi_engine.api.schemas.postgres.governance.entities.relationships import GovernanceRelationshipsRow
from mzizi_engine.api.schemas.postgres.official.entities.entities import EntitiesRow
from mzizi_engine.api.schemas.postgres.official.entities.individuals import IndividualsRow
from mzizi_engine.api.schemas.postgres.reference.entities.country import CountryRow
from mzizi_engine.api.schemas.postgres.reference.entities.value import ValueRow
from mzizi_engine.api.schemas.postgres.source.entities.citations import CitationsRow

__all__ = [
    "AuthorityScopesRow",
    "CitationsRow",
    "CountryRow",
    "EntitiesRow",
    "GovernanceRelationshipsRow",
    "HoldersRow",
    "IndividualsRow",
    "InstitutionsRow",
    "MandatesRow",
    "OfficesRow",
    "UnitsRow",
    "ValueRow",
]
