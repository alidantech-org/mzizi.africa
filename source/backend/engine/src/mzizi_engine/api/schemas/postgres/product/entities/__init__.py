"""Row models of the Product group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.identity.entities.identities import IdentitiesRow
from mzizi_engine.api.schemas.postgres.product.entities.apps import AppsRow
from mzizi_engine.api.schemas.postgres.product.entities.keys import KeysRow
from mzizi_engine.api.schemas.postgres.product.entities.lang import LangRow
from mzizi_engine.api.schemas.postgres.product.entities.messages import MessagesRow
from mzizi_engine.api.schemas.postgres.product.entities.releases import ReleasesRow
from mzizi_engine.api.schemas.postgres.product.entities.sites import ProductSitesRow
from mzizi_engine.api.schemas.postgres.reference.entities.countries import CountriesRow
from mzizi_engine.api.schemas.postgres.reference.entities.languages import LanguagesRow
from mzizi_engine.api.schemas.postgres.reference.entities.locales import LocalesRow

__all__ = [
    "AppsRow",
    "CountriesRow",
    "IdentitiesRow",
    "KeysRow",
    "LangRow",
    "LanguagesRow",
    "LocalesRow",
    "MessagesRow",
    "ProductSitesRow",
    "ReleasesRow",
]
