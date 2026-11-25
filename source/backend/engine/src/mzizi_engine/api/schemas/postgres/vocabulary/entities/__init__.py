"""Row models of the Vocabulary group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.identity.entities.identities import IdentitiesRow
from mzizi_engine.api.schemas.postgres.reference.entities.countries import CountriesRow
from mzizi_engine.api.schemas.postgres.reference.entities.languages import LanguagesRow
from mzizi_engine.api.schemas.postgres.reference.entities.units import UnitsRow
from mzizi_engine.api.schemas.postgres.vocabulary.entities.labels import LabelsRow
from mzizi_engine.api.schemas.postgres.vocabulary.entities.mappings import MappingsRow
from mzizi_engine.api.schemas.postgres.vocabulary.entities.schemes import SchemesRow
from mzizi_engine.api.schemas.postgres.vocabulary.entities.scopes import VocabularyScopesRow
from mzizi_engine.api.schemas.postgres.vocabulary.entities.terms import TermsRow

__all__ = [
    "CountriesRow",
    "IdentitiesRow",
    "LabelsRow",
    "LanguagesRow",
    "MappingsRow",
    "SchemesRow",
    "TermsRow",
    "UnitsRow",
    "VocabularyScopesRow",
]
