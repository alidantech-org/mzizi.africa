"""Row models of the Legal group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.geography.entities.features import FeaturesRow
from mzizi_engine.api.schemas.postgres.legal.entities.amendments import AmendmentsRow
from mzizi_engine.api.schemas.postgres.legal.entities.bases import BasesRow
from mzizi_engine.api.schemas.postgres.legal.entities.instrument_versions import InstrumentVersionsRow
from mzizi_engine.api.schemas.postgres.legal.entities.instruments import InstrumentsRow
from mzizi_engine.api.schemas.postgres.legal.entities.provision_references import ProvisionReferencesRow
from mzizi_engine.api.schemas.postgres.legal.entities.provision_translations import ProvisionTranslationsRow
from mzizi_engine.api.schemas.postgres.legal.entities.provision_versions import ProvisionVersionsRow
from mzizi_engine.api.schemas.postgres.legal.entities.provisions import ProvisionsRow
from mzizi_engine.api.schemas.postgres.official.entities.entities import EntitiesRow
from mzizi_engine.api.schemas.postgres.reference.entities.language import LanguageRow
from mzizi_engine.api.schemas.postgres.reference.entities.value import ValueRow
from mzizi_engine.api.schemas.postgres.source.entities.citations import CitationsRow
from mzizi_engine.api.schemas.postgres.source.entities.documents import DocumentsRow
from mzizi_engine.api.schemas.postgres.source.entities.evidence import EvidenceRow

__all__ = [
    "AmendmentsRow",
    "BasesRow",
    "CitationsRow",
    "DocumentsRow",
    "EntitiesRow",
    "EvidenceRow",
    "FeaturesRow",
    "InstrumentVersionsRow",
    "InstrumentsRow",
    "LanguageRow",
    "ProvisionReferencesRow",
    "ProvisionTranslationsRow",
    "ProvisionVersionsRow",
    "ProvisionsRow",
    "ValueRow",
]
