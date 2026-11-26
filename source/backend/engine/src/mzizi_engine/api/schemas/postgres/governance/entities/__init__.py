"""Row models of the Governance group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.election.entities.contests import ContestsRow
from mzizi_engine.api.schemas.postgres.election.entities.elections import ElectionsRow
from mzizi_engine.api.schemas.postgres.filesystem.entities.versions import VersionsRow
from mzizi_engine.api.schemas.postgres.geography.entities.areas import AreasRow
from mzizi_engine.api.schemas.postgres.governance.entities.appointments import AppointmentsRow
from mzizi_engine.api.schemas.postgres.governance.entities.assignments import AssignmentsRow
from mzizi_engine.api.schemas.postgres.governance.entities.functions import FunctionsRow
from mzizi_engine.api.schemas.postgres.governance.entities.holders import HoldersRow
from mzizi_engine.api.schemas.postgres.governance.entities.institutions import InstitutionsRow
from mzizi_engine.api.schemas.postgres.governance.entities.jurisdictions import JurisdictionsRow
from mzizi_engine.api.schemas.postgres.governance.entities.obligations import ObligationsRow
from mzizi_engine.api.schemas.postgres.governance.entities.office_terms import OfficeTermsRow
from mzizi_engine.api.schemas.postgres.governance.entities.offices import OfficesRow
from mzizi_engine.api.schemas.postgres.governance.entities.positions import PositionsRow
from mzizi_engine.api.schemas.postgres.governance.entities.powers import PowersRow
from mzizi_engine.api.schemas.postgres.governance.entities.procedures import ProceduresRow
from mzizi_engine.api.schemas.postgres.governance.entities.relationships import GovernanceRelationshipsRow
from mzizi_engine.api.schemas.postgres.governance.entities.reports import ReportsRow
from mzizi_engine.api.schemas.postgres.identity.entities.identities import IdentitiesRow
from mzizi_engine.api.schemas.postgres.legislature.entities.motions import MotionsRow
from mzizi_engine.api.schemas.postgres.official.entities.individuals import IndividualsRow
from mzizi_engine.api.schemas.postgres.official.entities.premises import PremisesRow
from mzizi_engine.api.schemas.postgres.reference.entities.countries import CountriesRow
from mzizi_engine.api.schemas.postgres.reference.entities.levels import LevelsRow
from mzizi_engine.api.schemas.postgres.template.entities.templates import TemplatesRow
from mzizi_engine.api.schemas.postgres.vocabulary.entities.terms import TermsRow

__all__ = [
    "AppointmentsRow",
    "AreasRow",
    "AssignmentsRow",
    "ContestsRow",
    "CountriesRow",
    "ElectionsRow",
    "FunctionsRow",
    "GovernanceRelationshipsRow",
    "HoldersRow",
    "IdentitiesRow",
    "IndividualsRow",
    "InstitutionsRow",
    "JurisdictionsRow",
    "LevelsRow",
    "MotionsRow",
    "ObligationsRow",
    "OfficeTermsRow",
    "OfficesRow",
    "PositionsRow",
    "PowersRow",
    "PremisesRow",
    "ProceduresRow",
    "ReportsRow",
    "TemplatesRow",
    "TermsRow",
    "VersionsRow",
]
