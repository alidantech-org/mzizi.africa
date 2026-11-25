"""Row models of the Politics group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.civic.entities.contracts import ContractsRow
from mzizi_engine.api.schemas.postgres.civic.entities.projects import ProjectsRow
from mzizi_engine.api.schemas.postgres.election.entities.candidates import CandidatesRow
from mzizi_engine.api.schemas.postgres.election.entities.elections import ElectionsRow
from mzizi_engine.api.schemas.postgres.event.entities.occurrences import EventOccurrencesRow
from mzizi_engine.api.schemas.postgres.filesystem.entities.versions import VersionsRow
from mzizi_engine.api.schemas.postgres.finance.entities.appropriations import AppropriationsRow
from mzizi_engine.api.schemas.postgres.geography.entities.features import FeaturesRow
from mzizi_engine.api.schemas.postgres.governance.entities.offices import OfficesRow
from mzizi_engine.api.schemas.postgres.identity.entities.identities import IdentitiesRow
from mzizi_engine.api.schemas.postgres.legal.entities.instruments import InstrumentsRow
from mzizi_engine.api.schemas.postgres.legislature.entities.bills import BillsRow
from mzizi_engine.api.schemas.postgres.media.entities.articles import ArticlesRow
from mzizi_engine.api.schemas.postgres.media.entities.assets import MediaAssetsRow
from mzizi_engine.api.schemas.postgres.official.entities.individuals import IndividualsRow
from mzizi_engine.api.schemas.postgres.politics.entities.alignments import AlignmentsRow
from mzizi_engine.api.schemas.postgres.politics.entities.attachments import PoliticsAttachmentsRow
from mzizi_engine.api.schemas.postgres.politics.entities.coalitions import CoalitionsRow
from mzizi_engine.api.schemas.postgres.politics.entities.commitments import CommitmentsRow
from mzizi_engine.api.schemas.postgres.politics.entities.contributions import ContributionsRow
from mzizi_engine.api.schemas.postgres.politics.entities.fulfilments import FulfilmentsRow
from mzizi_engine.api.schemas.postgres.politics.entities.manifestos import ManifestosRow
from mzizi_engine.api.schemas.postgres.politics.entities.memberships import PoliticsMembershipsRow
from mzizi_engine.api.schemas.postgres.politics.entities.parties import PartiesRow
from mzizi_engine.api.schemas.postgres.reference.entities.countries import CountriesRow
from mzizi_engine.api.schemas.postgres.reference.entities.currencies import CurrenciesRow
from mzizi_engine.api.schemas.postgres.reference.entities.languages import LanguagesRow
from mzizi_engine.api.schemas.postgres.reference.entities.units import UnitsRow
from mzizi_engine.api.schemas.postgres.vocabulary.entities.terms import TermsRow

__all__ = [
    "AlignmentsRow",
    "AppropriationsRow",
    "ArticlesRow",
    "BillsRow",
    "CandidatesRow",
    "CoalitionsRow",
    "CommitmentsRow",
    "ContractsRow",
    "ContributionsRow",
    "CountriesRow",
    "CurrenciesRow",
    "ElectionsRow",
    "EventOccurrencesRow",
    "FeaturesRow",
    "FulfilmentsRow",
    "IdentitiesRow",
    "IndividualsRow",
    "InstrumentsRow",
    "LanguagesRow",
    "ManifestosRow",
    "MediaAssetsRow",
    "OfficesRow",
    "PartiesRow",
    "PoliticsAttachmentsRow",
    "PoliticsMembershipsRow",
    "ProjectsRow",
    "TermsRow",
    "UnitsRow",
    "VersionsRow",
]
