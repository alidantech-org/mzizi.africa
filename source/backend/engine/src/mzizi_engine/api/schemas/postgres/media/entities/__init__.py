"""Row models of the Media group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.community.entities.actors import ActorsRow
from mzizi_engine.api.schemas.postgres.filesystem.entities.versions import VersionsRow
from mzizi_engine.api.schemas.postgres.identity.entities.identities import IdentitiesRow
from mzizi_engine.api.schemas.postgres.media.entities.articles import ArticlesRow
from mzizi_engine.api.schemas.postgres.media.entities.assets import MediaAssetsRow
from mzizi_engine.api.schemas.postgres.media.entities.captions import CaptionsRow
from mzizi_engine.api.schemas.postgres.media.entities.subjects import MediaSubjectsRow
from mzizi_engine.api.schemas.postgres.media.entities.texts import TextsRow
from mzizi_engine.api.schemas.postgres.media.entities.uses import UsesRow
from mzizi_engine.api.schemas.postgres.reference.entities.languages import LanguagesRow
from mzizi_engine.api.schemas.postgres.vocabulary.entities.terms import TermsRow

__all__ = [
    "ActorsRow",
    "ArticlesRow",
    "CaptionsRow",
    "IdentitiesRow",
    "LanguagesRow",
    "MediaAssetsRow",
    "MediaSubjectsRow",
    "TermsRow",
    "TextsRow",
    "UsesRow",
    "VersionsRow",
]
