"""Row models of the Politics group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.geography.entities.features import FeaturesRow
from mzizi_engine.api.schemas.postgres.governance.entities.holders import HoldersRow
from mzizi_engine.api.schemas.postgres.governance.entities.offices import OfficesRow
from mzizi_engine.api.schemas.postgres.governance.entities.terms import TermsRow
from mzizi_engine.api.schemas.postgres.official.entities.entities import EntitiesRow
from mzizi_engine.api.schemas.postgres.official.entities.individuals import IndividualsRow
from mzizi_engine.api.schemas.postgres.politics.entities.alignments import AlignmentsRow
from mzizi_engine.api.schemas.postgres.politics.entities.candidates import CandidatesRow
from mzizi_engine.api.schemas.postgres.politics.entities.coalitions import CoalitionsRow
from mzizi_engine.api.schemas.postgres.politics.entities.contests import ContestsRow
from mzizi_engine.api.schemas.postgres.politics.entities.elections import ElectionsRow
from mzizi_engine.api.schemas.postgres.politics.entities.electorates import ElectoratesRow
from mzizi_engine.api.schemas.postgres.politics.entities.manifesto_items import ManifestoItemsRow
from mzizi_engine.api.schemas.postgres.politics.entities.manifestos import ManifestosRow
from mzizi_engine.api.schemas.postgres.politics.entities.memberships import PoliticsMembershipsRow
from mzizi_engine.api.schemas.postgres.politics.entities.option_results import OptionResultsRow
from mzizi_engine.api.schemas.postgres.politics.entities.parties import PartiesRow
from mzizi_engine.api.schemas.postgres.politics.entities.polls import PollsRow
from mzizi_engine.api.schemas.postgres.politics.entities.referendum_options import ReferendumOptionsRow
from mzizi_engine.api.schemas.postgres.politics.entities.results import ResultsRow
from mzizi_engine.api.schemas.postgres.reference.entities.country import CountryRow
from mzizi_engine.api.schemas.postgres.reference.entities.topic import TopicRow
from mzizi_engine.api.schemas.postgres.reference.entities.value import ValueRow
from mzizi_engine.api.schemas.postgres.source.entities.artifacts import ArtifactsRow
from mzizi_engine.api.schemas.postgres.source.entities.citations import CitationsRow

__all__ = [
    "AlignmentsRow",
    "ArtifactsRow",
    "CandidatesRow",
    "CitationsRow",
    "CoalitionsRow",
    "ContestsRow",
    "CountryRow",
    "ElectionsRow",
    "ElectoratesRow",
    "EntitiesRow",
    "FeaturesRow",
    "HoldersRow",
    "IndividualsRow",
    "ManifestoItemsRow",
    "ManifestosRow",
    "OfficesRow",
    "OptionResultsRow",
    "PartiesRow",
    "PoliticsMembershipsRow",
    "PollsRow",
    "ReferendumOptionsRow",
    "ResultsRow",
    "TermsRow",
    "TopicRow",
    "ValueRow",
]
