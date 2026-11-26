"""Row models of the Template group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.identity.entities.identities import IdentitiesRow
from mzizi_engine.api.schemas.postgres.reference.entities.countries import CountriesRow
from mzizi_engine.api.schemas.postgres.reference.entities.languages import LanguagesRow
from mzizi_engine.api.schemas.postgres.reference.entities.levels import LevelsRow
from mzizi_engine.api.schemas.postgres.template.entities.items import TemplateItemsRow
from mzizi_engine.api.schemas.postgres.template.entities.lines import LinesRow
from mzizi_engine.api.schemas.postgres.template.entities.patterns import PatternsRow
from mzizi_engine.api.schemas.postgres.template.entities.templates import TemplatesRow
from mzizi_engine.api.schemas.postgres.template.entities.texts import TemplateTextsRow
from mzizi_engine.api.schemas.postgres.vocabulary.entities.terms import TermsRow

__all__ = [
    "CountriesRow",
    "IdentitiesRow",
    "LanguagesRow",
    "LevelsRow",
    "LinesRow",
    "PatternsRow",
    "TemplateItemsRow",
    "TemplateTextsRow",
    "TemplatesRow",
    "TermsRow",
]
