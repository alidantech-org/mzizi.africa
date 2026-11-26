"""Row models of the Election group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.election.entities.attachments import ElectionAttachmentsRow
from mzizi_engine.api.schemas.postgres.election.entities.candidates import CandidatesRow
from mzizi_engine.api.schemas.postgres.election.entities.choices import ChoicesRow
from mzizi_engine.api.schemas.postgres.election.entities.contests import ContestsRow
from mzizi_engine.api.schemas.postgres.election.entities.elections import ElectionsRow
from mzizi_engine.api.schemas.postgres.election.entities.forms import FormsRow
from mzizi_engine.api.schemas.postgres.election.entities.results import ResultsRow
from mzizi_engine.api.schemas.postgres.election.entities.stations import StationsRow
from mzizi_engine.api.schemas.postgres.election.entities.tallies import TalliesRow
from mzizi_engine.api.schemas.postgres.election.entities.turnouts import TurnoutsRow
from mzizi_engine.api.schemas.postgres.event.entities.events import EventsRow
from mzizi_engine.api.schemas.postgres.geography.entities.areas import AreasRow
from mzizi_engine.api.schemas.postgres.geography.entities.features import FeaturesRow
from mzizi_engine.api.schemas.postgres.governance.entities.holders import HoldersRow
from mzizi_engine.api.schemas.postgres.governance.entities.office_terms import OfficeTermsRow
from mzizi_engine.api.schemas.postgres.governance.entities.offices import OfficesRow
from mzizi_engine.api.schemas.postgres.identity.entities.identities import IdentitiesRow
from mzizi_engine.api.schemas.postgres.media.entities.articles import ArticlesRow
from mzizi_engine.api.schemas.postgres.media.entities.assets import MediaAssetsRow
from mzizi_engine.api.schemas.postgres.official.entities.individuals import IndividualsRow
from mzizi_engine.api.schemas.postgres.politics.entities.parties import PartiesRow
from mzizi_engine.api.schemas.postgres.reference.entities.countries import CountriesRow
from mzizi_engine.api.schemas.postgres.reference.entities.languages import LanguagesRow
from mzizi_engine.api.schemas.postgres.statistics.entities.collections import CollectionsRow
from mzizi_engine.api.schemas.postgres.template.entities.templates import TemplatesRow
from mzizi_engine.api.schemas.postgres.vocabulary.entities.terms import TermsRow

__all__ = [
    "AreasRow",
    "ArticlesRow",
    "CandidatesRow",
    "ChoicesRow",
    "CollectionsRow",
    "ContestsRow",
    "CountriesRow",
    "ElectionAttachmentsRow",
    "ElectionsRow",
    "EventsRow",
    "FeaturesRow",
    "FormsRow",
    "HoldersRow",
    "IdentitiesRow",
    "IndividualsRow",
    "LanguagesRow",
    "MediaAssetsRow",
    "OfficeTermsRow",
    "OfficesRow",
    "PartiesRow",
    "ResultsRow",
    "StationsRow",
    "TalliesRow",
    "TemplatesRow",
    "TermsRow",
    "TurnoutsRow",
]
