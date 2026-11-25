"""Row models of the Identity group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.identity.entities.addresses import AddressesRow
from mzizi_engine.api.schemas.postgres.identity.entities.classifications import ClassificationsRow
from mzizi_engine.api.schemas.postgres.identity.entities.identifiers import IdentifiersRow
from mzizi_engine.api.schemas.postgres.identity.entities.identities import IdentitiesRow
from mzizi_engine.api.schemas.postgres.identity.entities.names import IdentityNamesRow
from mzizi_engine.api.schemas.postgres.identity.entities.tags import TagsRow
from mzizi_engine.api.schemas.postgres.reference.entities.countries import CountriesRow
from mzizi_engine.api.schemas.postgres.reference.entities.languages import LanguagesRow
from mzizi_engine.api.schemas.postgres.vocabulary.entities.terms import TermsRow

__all__ = [
    "AddressesRow",
    "ClassificationsRow",
    "CountriesRow",
    "IdentifiersRow",
    "IdentitiesRow",
    "IdentityNamesRow",
    "LanguagesRow",
    "TagsRow",
    "TermsRow",
]
