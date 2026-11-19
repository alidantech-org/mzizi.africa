"""Row models of the Governance group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.civic.entities.contracts import ContractsRow
from mzizi_engine.api.schemas.postgres.civic.entities.projects import ProjectsRow
from mzizi_engine.api.schemas.postgres.event.entities.occurrences import OccurrencesRow
from mzizi_engine.api.schemas.postgres.finance.entities.appropriations import AppropriationsRow
from mzizi_engine.api.schemas.postgres.finance.entities.budget_versions import BudgetVersionsRow
from mzizi_engine.api.schemas.postgres.finance.entities.fiscal_periods import FiscalPeriodsRow
from mzizi_engine.api.schemas.postgres.geography.entities.features import FeaturesRow
from mzizi_engine.api.schemas.postgres.geography.entities.levels import LevelsRow
from mzizi_engine.api.schemas.postgres.governance.entities.agenda import AgendaRow
from mzizi_engine.api.schemas.postgres.governance.entities.assignments import AssignmentsRow
from mzizi_engine.api.schemas.postgres.governance.entities.authority_scopes import AuthorityScopesRow
from mzizi_engine.api.schemas.postgres.governance.entities.bills import BillsRow
from mzizi_engine.api.schemas.postgres.governance.entities.fulfilments import FulfilmentsRow
from mzizi_engine.api.schemas.postgres.governance.entities.functions import FunctionsRow
from mzizi_engine.api.schemas.postgres.governance.entities.hansards import HansardsRow
from mzizi_engine.api.schemas.postgres.governance.entities.holders import HoldersRow
from mzizi_engine.api.schemas.postgres.governance.entities.institutions import InstitutionsRow
from mzizi_engine.api.schemas.postgres.governance.entities.mandates import MandatesRow
from mzizi_engine.api.schemas.postgres.governance.entities.motions import MotionsRow
from mzizi_engine.api.schemas.postgres.governance.entities.obligations import ObligationsRow
from mzizi_engine.api.schemas.postgres.governance.entities.offices import OfficesRow
from mzizi_engine.api.schemas.postgres.governance.entities.positions import PositionsRow
from mzizi_engine.api.schemas.postgres.governance.entities.powers import PowersRow
from mzizi_engine.api.schemas.postgres.governance.entities.procedures import ProceduresRow
from mzizi_engine.api.schemas.postgres.governance.entities.promises import PromisesRow
from mzizi_engine.api.schemas.postgres.governance.entities.relationships import GovernanceRelationshipsRow
from mzizi_engine.api.schemas.postgres.governance.entities.reports import ReportsRow
from mzizi_engine.api.schemas.postgres.governance.entities.sittings import SittingsRow
from mzizi_engine.api.schemas.postgres.governance.entities.speeches import SpeechesRow
from mzizi_engine.api.schemas.postgres.governance.entities.stages import StagesRow
from mzizi_engine.api.schemas.postgres.governance.entities.terms import TermsRow
from mzizi_engine.api.schemas.postgres.governance.entities.votes import VotesRow
from mzizi_engine.api.schemas.postgres.legal.entities.instruments import InstrumentsRow
from mzizi_engine.api.schemas.postgres.legal.entities.provisions import ProvisionsRow
from mzizi_engine.api.schemas.postgres.official.entities.entities import EntitiesRow
from mzizi_engine.api.schemas.postgres.official.entities.individuals import IndividualsRow
from mzizi_engine.api.schemas.postgres.reference.entities.country import CountryRow
from mzizi_engine.api.schemas.postgres.reference.entities.language import LanguageRow
from mzizi_engine.api.schemas.postgres.reference.entities.topic import TopicRow
from mzizi_engine.api.schemas.postgres.reference.entities.unit import UnitRow
from mzizi_engine.api.schemas.postgres.reference.entities.value import ValueRow
from mzizi_engine.api.schemas.postgres.source.entities.artifacts import ArtifactsRow
from mzizi_engine.api.schemas.postgres.source.entities.citations import CitationsRow

__all__ = [
    "AgendaRow",
    "AppropriationsRow",
    "ArtifactsRow",
    "AssignmentsRow",
    "AuthorityScopesRow",
    "BillsRow",
    "BudgetVersionsRow",
    "CitationsRow",
    "ContractsRow",
    "CountryRow",
    "EntitiesRow",
    "FeaturesRow",
    "FiscalPeriodsRow",
    "FulfilmentsRow",
    "FunctionsRow",
    "GovernanceRelationshipsRow",
    "HansardsRow",
    "HoldersRow",
    "IndividualsRow",
    "InstitutionsRow",
    "InstrumentsRow",
    "LanguageRow",
    "LevelsRow",
    "MandatesRow",
    "MotionsRow",
    "ObligationsRow",
    "OccurrencesRow",
    "OfficesRow",
    "PositionsRow",
    "PowersRow",
    "ProceduresRow",
    "ProjectsRow",
    "PromisesRow",
    "ProvisionsRow",
    "ReportsRow",
    "SittingsRow",
    "SpeechesRow",
    "StagesRow",
    "TermsRow",
    "TopicRow",
    "UnitRow",
    "ValueRow",
    "VotesRow",
]
