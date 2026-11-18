"""Row models of the Governance group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.geography.entities.features import FeaturesRow
from mzizi_engine.api.schemas.postgres.governance.entities.authority_scopes import AuthorityScopesRow
from mzizi_engine.api.schemas.postgres.governance.entities.holders import HoldersRow
from mzizi_engine.api.schemas.postgres.governance.entities.institutions import InstitutionsRow
from mzizi_engine.api.schemas.postgres.governance.entities.mandates import MandatesRow
from mzizi_engine.api.schemas.postgres.governance.entities.obligations import ObligationsRow
from mzizi_engine.api.schemas.postgres.governance.entities.offices import OfficesRow
from mzizi_engine.api.schemas.postgres.governance.entities.relationships import GovernanceRelationshipsRow
from mzizi_engine.api.schemas.postgres.governance.entities.reports import ReportsRow
from mzizi_engine.api.schemas.postgres.legal.entities.provisions import ProvisionsRow
from mzizi_engine.api.schemas.postgres.official.entities.entities import EntitiesRow
from mzizi_engine.api.schemas.postgres.official.entities.individuals import IndividualsRow
from mzizi_engine.api.schemas.postgres.reference.entities.country import CountryRow
from mzizi_engine.api.schemas.postgres.reference.entities.value import ValueRow
from mzizi_engine.api.schemas.postgres.source.entities.artifacts import ArtifactsRow
from mzizi_engine.api.schemas.postgres.source.entities.citations import CitationsRow

__all__ = [
    "ArtifactsRow",
    "AuthorityScopesRow",
    "CitationsRow",
    "CountryRow",
    "EntitiesRow",
    "FeaturesRow",
    "GovernanceRelationshipsRow",
    "HoldersRow",
    "IndividualsRow",
    "InstitutionsRow",
    "MandatesRow",
    "ObligationsRow",
    "OfficesRow",
    "ProvisionsRow",
    "ReportsRow",
    "ValueRow",
]
