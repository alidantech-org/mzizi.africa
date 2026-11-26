"""Row models of the Legislature group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.event.entities.occurrences import EventOccurrencesRow
from mzizi_engine.api.schemas.postgres.filesystem.entities.versions import VersionsRow
from mzizi_engine.api.schemas.postgres.finance.entities.periods import PeriodsRow
from mzizi_engine.api.schemas.postgres.finance.entities.revisions import RevisionsRow
from mzizi_engine.api.schemas.postgres.governance.entities.holders import HoldersRow
from mzizi_engine.api.schemas.postgres.governance.entities.institutions import InstitutionsRow
from mzizi_engine.api.schemas.postgres.governance.entities.office_terms import OfficeTermsRow
from mzizi_engine.api.schemas.postgres.identity.entities.identities import IdentitiesRow
from mzizi_engine.api.schemas.postgres.legal.entities.instruments import InstrumentsRow
from mzizi_engine.api.schemas.postgres.legislature.entities.agenda import AgendaRow
from mzizi_engine.api.schemas.postgres.legislature.entities.attachments import LegislatureAttachmentsRow
from mzizi_engine.api.schemas.postgres.legislature.entities.bills import BillsRow
from mzizi_engine.api.schemas.postgres.legislature.entities.hansards import HansardsRow
from mzizi_engine.api.schemas.postgres.legislature.entities.motions import MotionsRow
from mzizi_engine.api.schemas.postgres.legislature.entities.sittings import SittingsRow
from mzizi_engine.api.schemas.postgres.legislature.entities.speeches import SpeechesRow
from mzizi_engine.api.schemas.postgres.legislature.entities.stages import StagesRow
from mzizi_engine.api.schemas.postgres.legislature.entities.summaries import SummariesRow
from mzizi_engine.api.schemas.postgres.legislature.entities.votes import VotesRow
from mzizi_engine.api.schemas.postgres.media.entities.articles import ArticlesRow
from mzizi_engine.api.schemas.postgres.media.entities.assets import MediaAssetsRow
from mzizi_engine.api.schemas.postgres.politics.entities.parties import PartiesRow
from mzizi_engine.api.schemas.postgres.reference.entities.countries import CountriesRow
from mzizi_engine.api.schemas.postgres.reference.entities.languages import LanguagesRow
from mzizi_engine.api.schemas.postgres.vocabulary.entities.terms import TermsRow

__all__ = [
    "AgendaRow",
    "ArticlesRow",
    "BillsRow",
    "CountriesRow",
    "EventOccurrencesRow",
    "HansardsRow",
    "HoldersRow",
    "IdentitiesRow",
    "InstitutionsRow",
    "InstrumentsRow",
    "LanguagesRow",
    "LegislatureAttachmentsRow",
    "MediaAssetsRow",
    "MotionsRow",
    "OfficeTermsRow",
    "PartiesRow",
    "PeriodsRow",
    "RevisionsRow",
    "SittingsRow",
    "SpeechesRow",
    "StagesRow",
    "SummariesRow",
    "TermsRow",
    "VersionsRow",
    "VotesRow",
]
