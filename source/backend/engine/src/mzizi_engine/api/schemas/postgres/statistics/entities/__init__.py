"""Row models of the Statistics group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.geography.entities.features import FeaturesRow
from mzizi_engine.api.schemas.postgres.identity.entities.identities import IdentitiesRow
from mzizi_engine.api.schemas.postgres.reference.entities.countries import CountriesRow
from mzizi_engine.api.schemas.postgres.reference.entities.units import UnitsRow
from mzizi_engine.api.schemas.postgres.statistics.entities.breakdowns import BreakdownsRow
from mzizi_engine.api.schemas.postgres.statistics.entities.collections import CollectionsRow
from mzizi_engine.api.schemas.postgres.statistics.entities.components import ComponentsRow
from mzizi_engine.api.schemas.postgres.statistics.entities.dimensions import DimensionsRow
from mzizi_engine.api.schemas.postgres.statistics.entities.figures import FiguresRow
from mzizi_engine.api.schemas.postgres.statistics.entities.indicators import IndicatorsRow
from mzizi_engine.api.schemas.postgres.statistics.entities.metrics import MetricsRow
from mzizi_engine.api.schemas.postgres.statistics.entities.observations import ObservationsRow
from mzizi_engine.api.schemas.postgres.statistics.entities.priorities import PrioritiesRow
from mzizi_engine.api.schemas.postgres.vocabulary.entities.schemes import SchemesRow
from mzizi_engine.api.schemas.postgres.vocabulary.entities.terms import TermsRow

__all__ = [
    "BreakdownsRow",
    "CollectionsRow",
    "ComponentsRow",
    "CountriesRow",
    "DimensionsRow",
    "FeaturesRow",
    "FiguresRow",
    "IdentitiesRow",
    "IndicatorsRow",
    "MetricsRow",
    "ObservationsRow",
    "PrioritiesRow",
    "SchemesRow",
    "TermsRow",
    "UnitsRow",
]
