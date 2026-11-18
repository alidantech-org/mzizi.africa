"""Row models of the Geography group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.filesystem.entities.file_versions import FileVersionsRow
from mzizi_engine.api.schemas.postgres.geography.entities.assets import AssetsRow
from mzizi_engine.api.schemas.postgres.geography.entities.changes import GeographyChangesRow
from mzizi_engine.api.schemas.postgres.geography.entities.classifications import ClassificationsRow
from mzizi_engine.api.schemas.postgres.geography.entities.features import FeaturesRow
from mzizi_engine.api.schemas.postgres.geography.entities.geometries import GeometriesRow
from mzizi_engine.api.schemas.postgres.geography.entities.identifiers import GeographyIdentifiersRow
from mzizi_engine.api.schemas.postgres.geography.entities.levels import LevelsRow
from mzizi_engine.api.schemas.postgres.geography.entities.names import GeographyNamesRow
from mzizi_engine.api.schemas.postgres.geography.entities.relationships import GeographyRelationshipsRow
from mzizi_engine.api.schemas.postgres.reference.entities.country import CountryRow
from mzizi_engine.api.schemas.postgres.reference.entities.language import LanguageRow
from mzizi_engine.api.schemas.postgres.reference.entities.value import ValueRow

__all__ = [
    "AssetsRow",
    "ClassificationsRow",
    "CountryRow",
    "FeaturesRow",
    "FileVersionsRow",
    "GeographyChangesRow",
    "GeographyIdentifiersRow",
    "GeographyNamesRow",
    "GeographyRelationshipsRow",
    "GeometriesRow",
    "LanguageRow",
    "LevelsRow",
    "ValueRow",
]
