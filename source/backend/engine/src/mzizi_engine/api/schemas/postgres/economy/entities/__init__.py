"""Row models of the Economy group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.economy.entities.baskets import BasketsRow
from mzizi_engine.api.schemas.postgres.economy.entities.codes import EconomyCodesRow
from mzizi_engine.api.schemas.postgres.economy.entities.compositions import CompositionsRow
from mzizi_engine.api.schemas.postgres.economy.entities.crosswalks import CrosswalksRow
from mzizi_engine.api.schemas.postgres.economy.entities.goods import GoodsRow
from mzizi_engine.api.schemas.postgres.economy.entities.names import EconomyNamesRow
from mzizi_engine.api.schemas.postgres.economy.entities.prices import PricesRow
from mzizi_engine.api.schemas.postgres.economy.entities.weights import WeightsRow
from mzizi_engine.api.schemas.postgres.geography.entities.features import FeaturesRow
from mzizi_engine.api.schemas.postgres.reference.entities.countries import CountriesRow
from mzizi_engine.api.schemas.postgres.reference.entities.currencies import CurrenciesRow
from mzizi_engine.api.schemas.postgres.reference.entities.languages import LanguagesRow
from mzizi_engine.api.schemas.postgres.reference.entities.units import UnitsRow
from mzizi_engine.api.schemas.postgres.statistics.entities.collections import CollectionsRow
from mzizi_engine.api.schemas.postgres.vocabulary.entities.terms import TermsRow

__all__ = [
    "BasketsRow",
    "CollectionsRow",
    "CompositionsRow",
    "CountriesRow",
    "CrosswalksRow",
    "CurrenciesRow",
    "EconomyCodesRow",
    "EconomyNamesRow",
    "FeaturesRow",
    "GoodsRow",
    "LanguagesRow",
    "PricesRow",
    "TermsRow",
    "UnitsRow",
    "WeightsRow",
]
