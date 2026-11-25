"""Row models of the Geography group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.filesystem.entities.versions import VersionsRow
from mzizi_engine.api.schemas.postgres.geography.entities.assets import GeographyAssetsRow
from mzizi_engine.api.schemas.postgres.geography.entities.changes import GeographyChangesRow
from mzizi_engine.api.schemas.postgres.geography.entities.features import FeaturesRow
from mzizi_engine.api.schemas.postgres.geography.entities.geometries import GeometriesRow
from mzizi_engine.api.schemas.postgres.geography.entities.outlines import OutlinesRow
from mzizi_engine.api.schemas.postgres.geography.entities.pieces import PiecesRow
from mzizi_engine.api.schemas.postgres.geography.entities.relationships import GeographyRelationshipsRow
from mzizi_engine.api.schemas.postgres.history.entities.occurrences import HistoryOccurrencesRow
from mzizi_engine.api.schemas.postgres.identity.entities.identities import IdentitiesRow
from mzizi_engine.api.schemas.postgres.reference.entities.hierarchies import HierarchiesRow
from mzizi_engine.api.schemas.postgres.reference.entities.languages import LanguagesRow
from mzizi_engine.api.schemas.postgres.reference.entities.levels import LevelsRow
from mzizi_engine.api.schemas.postgres.vocabulary.entities.terms import TermsRow

__all__ = [
    "FeaturesRow",
    "GeographyAssetsRow",
    "GeographyChangesRow",
    "GeographyRelationshipsRow",
    "GeometriesRow",
    "HierarchiesRow",
    "HistoryOccurrencesRow",
    "IdentitiesRow",
    "LanguagesRow",
    "LevelsRow",
    "OutlinesRow",
    "PiecesRow",
    "TermsRow",
    "VersionsRow",
]
