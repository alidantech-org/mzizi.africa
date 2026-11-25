"""Row models of the Legal group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.auth.entities.accounts import AccountsRow
from mzizi_engine.api.schemas.postgres.governance.entities.jurisdictions import JurisdictionsRow
from mzizi_engine.api.schemas.postgres.identity.entities.identities import IdentitiesRow
from mzizi_engine.api.schemas.postgres.legal.entities.editions import LegalEditionsRow
from mzizi_engine.api.schemas.postgres.legal.entities.effects import EffectsRow
from mzizi_engine.api.schemas.postgres.legal.entities.instruments import InstrumentsRow
from mzizi_engine.api.schemas.postgres.legal.entities.provisions import ProvisionsRow
from mzizi_engine.api.schemas.postgres.legal.entities.references import ReferencesRow
from mzizi_engine.api.schemas.postgres.legal.entities.relationships import LegalRelationshipsRow
from mzizi_engine.api.schemas.postgres.legal.entities.translations import TranslationsRow
from mzizi_engine.api.schemas.postgres.legal.entities.wordings import WordingsRow
from mzizi_engine.api.schemas.postgres.reference.entities.languages import LanguagesRow
from mzizi_engine.api.schemas.postgres.vocabulary.entities.terms import TermsRow

__all__ = [
    "AccountsRow",
    "EffectsRow",
    "IdentitiesRow",
    "InstrumentsRow",
    "JurisdictionsRow",
    "LanguagesRow",
    "LegalEditionsRow",
    "LegalRelationshipsRow",
    "ProvisionsRow",
    "ReferencesRow",
    "TermsRow",
    "TranslationsRow",
    "WordingsRow",
]
