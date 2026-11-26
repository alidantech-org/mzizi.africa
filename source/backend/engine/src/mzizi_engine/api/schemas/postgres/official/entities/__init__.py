"""Row models of the Official group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.geography.entities.features import FeaturesRow
from mzizi_engine.api.schemas.postgres.identity.entities.identities import IdentitiesRow
from mzizi_engine.api.schemas.postgres.identity.entities.names import IdentityNamesRow
from mzizi_engine.api.schemas.postgres.official.entities.branding import BrandingRow
from mzizi_engine.api.schemas.postgres.official.entities.contacts import ContactsRow
from mzizi_engine.api.schemas.postgres.official.entities.entities import EntitiesRow
from mzizi_engine.api.schemas.postgres.official.entities.individuals import IndividualsRow
from mzizi_engine.api.schemas.postgres.official.entities.parts import PartsRow
from mzizi_engine.api.schemas.postgres.official.entities.premises import PremisesRow
from mzizi_engine.api.schemas.postgres.official.entities.relationships import OfficialRelationshipsRow
from mzizi_engine.api.schemas.postgres.reference.entities.countries import CountriesRow
from mzizi_engine.api.schemas.postgres.reference.entities.languages import LanguagesRow
from mzizi_engine.api.schemas.postgres.vocabulary.entities.terms import TermsRow

__all__ = [
    "BrandingRow",
    "ContactsRow",
    "CountriesRow",
    "EntitiesRow",
    "FeaturesRow",
    "IdentitiesRow",
    "IdentityNamesRow",
    "IndividualsRow",
    "LanguagesRow",
    "OfficialRelationshipsRow",
    "PartsRow",
    "PremisesRow",
    "TermsRow",
]
