"""Row models of the Statistics group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.geography.entities.features import FeaturesRow
from mzizi_engine.api.schemas.postgres.reference.entities.language import LanguageRow
from mzizi_engine.api.schemas.postgres.reference.entities.topic import TopicRow
from mzizi_engine.api.schemas.postgres.reference.entities.unit import UnitRow
from mzizi_engine.api.schemas.postgres.reference.entities.value import ValueRow
from mzizi_engine.api.schemas.postgres.source.entities.citations import CitationsRow
from mzizi_engine.api.schemas.postgres.statistics.entities.indicators import IndicatorsRow
from mzizi_engine.api.schemas.postgres.statistics.entities.observations import ObservationsRow

__all__ = [
    "CitationsRow",
    "FeaturesRow",
    "IndicatorsRow",
    "LanguageRow",
    "ObservationsRow",
    "TopicRow",
    "UnitRow",
    "ValueRow",
]
