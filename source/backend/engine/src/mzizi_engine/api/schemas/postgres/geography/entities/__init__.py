"""Row models of the Geography group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.geography.entities.changes import ChangesRow
from mzizi_engine.api.schemas.postgres.geography.entities.classifications import ClassificationsRow
from mzizi_engine.api.schemas.postgres.geography.entities.datasets import GeographyDatasetsRow
from mzizi_engine.api.schemas.postgres.geography.entities.features import FeaturesRow
from mzizi_engine.api.schemas.postgres.geography.entities.geometries import GeometriesRow
from mzizi_engine.api.schemas.postgres.geography.entities.identifiers import GeographyIdentifiersRow
from mzizi_engine.api.schemas.postgres.geography.entities.names import GeographyNamesRow
from mzizi_engine.api.schemas.postgres.geography.entities.relationships import GeographyRelationshipsRow
from mzizi_engine.api.schemas.postgres.reference.entities.language import LanguageRow
from mzizi_engine.api.schemas.postgres.reference.entities.unit import UnitRow
from mzizi_engine.api.schemas.postgres.reference.entities.value import ValueRow

__all__ = [
    "ChangesRow",
    "ClassificationsRow",
    "FeaturesRow",
    "GeographyDatasetsRow",
    "GeographyIdentifiersRow",
    "GeographyNamesRow",
    "GeographyRelationshipsRow",
    "GeometriesRow",
    "LanguageRow",
    "UnitRow",
    "ValueRow",
]
