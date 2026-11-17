"""Row models of the Legal group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.geography.entities.features import FeaturesRow
from mzizi_engine.api.schemas.postgres.legal.entities.editions import LegalEditionsRow
from mzizi_engine.api.schemas.postgres.legal.entities.effects import EffectsRow
from mzizi_engine.api.schemas.postgres.legal.entities.instruments import InstrumentsRow
from mzizi_engine.api.schemas.postgres.legal.entities.names import LegalNamesRow
from mzizi_engine.api.schemas.postgres.legal.entities.provisions import ProvisionsRow
from mzizi_engine.api.schemas.postgres.legal.entities.references import ReferencesRow
from mzizi_engine.api.schemas.postgres.legal.entities.relationships import LegalRelationshipsRow
from mzizi_engine.api.schemas.postgres.legal.entities.translations import TranslationsRow
from mzizi_engine.api.schemas.postgres.legal.entities.wordings import WordingsRow
from mzizi_engine.api.schemas.postgres.official.entities.entities import EntitiesRow
from mzizi_engine.api.schemas.postgres.reference.entities.language import LanguageRow
from mzizi_engine.api.schemas.postgres.reference.entities.value import ValueRow
from mzizi_engine.api.schemas.postgres.source.entities.citations import CitationsRow

__all__ = [
    "CitationsRow",
    "EffectsRow",
    "EntitiesRow",
    "FeaturesRow",
    "InstrumentsRow",
    "LanguageRow",
    "LegalEditionsRow",
    "LegalNamesRow",
    "LegalRelationshipsRow",
    "ProvisionsRow",
    "ReferencesRow",
    "TranslationsRow",
    "ValueRow",
    "WordingsRow",
]
