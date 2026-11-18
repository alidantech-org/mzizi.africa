"""Row models of the Governance group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.events.entities.occurrences import OccurrencesRow
from mzizi_engine.api.schemas.postgres.finance.entities.budget_versions import BudgetVersionsRow
from mzizi_engine.api.schemas.postgres.finance.entities.fiscal_periods import FiscalPeriodsRow
from mzizi_engine.api.schemas.postgres.geography.entities.features import FeaturesRow
from mzizi_engine.api.schemas.postgres.governance.entities.agenda import AgendaRow
from mzizi_engine.api.schemas.postgres.governance.entities.authority_scopes import AuthorityScopesRow
from mzizi_engine.api.schemas.postgres.governance.entities.bills import BillsRow
from mzizi_engine.api.schemas.postgres.governance.entities.hansards import HansardsRow
from mzizi_engine.api.schemas.postgres.governance.entities.holders import HoldersRow
from mzizi_engine.api.schemas.postgres.governance.entities.institutions import InstitutionsRow
from mzizi_engine.api.schemas.postgres.governance.entities.mandates import MandatesRow
from mzizi_engine.api.schemas.postgres.governance.entities.motions import MotionsRow
from mzizi_engine.api.schemas.postgres.governance.entities.obligations import ObligationsRow
from mzizi_engine.api.schemas.postgres.governance.entities.offices import OfficesRow
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
from mzizi_engine.api.schemas.postgres.reference.entities.value import ValueRow
from mzizi_engine.api.schemas.postgres.source.entities.artifacts import ArtifactsRow
from mzizi_engine.api.schemas.postgres.source.entities.citations import CitationsRow

__all__ = [
    "AgendaRow",
    "ArtifactsRow",
    "AuthorityScopesRow",
    "BillsRow",
    "BudgetVersionsRow",
    "CitationsRow",
    "CountryRow",
    "EntitiesRow",
    "FeaturesRow",
    "FiscalPeriodsRow",
    "GovernanceRelationshipsRow",
    "HansardsRow",
    "HoldersRow",
    "IndividualsRow",
    "InstitutionsRow",
    "InstrumentsRow",
    "LanguageRow",
    "MandatesRow",
    "MotionsRow",
    "ObligationsRow",
    "OccurrencesRow",
    "OfficesRow",
    "ProvisionsRow",
    "ReportsRow",
    "SittingsRow",
    "SpeechesRow",
    "StagesRow",
    "TermsRow",
    "ValueRow",
    "VotesRow",
]
