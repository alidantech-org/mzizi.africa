"""Row models of the Filesystem group."""

from __future__ import annotations

from mzizi_engine.api.schemas.postgres.filesystem.entities.file_extensions import FileExtensionsRow
from mzizi_engine.api.schemas.postgres.filesystem.entities.file_relations import FileRelationsRow
from mzizi_engine.api.schemas.postgres.filesystem.entities.file_versions import FileVersionsRow
from mzizi_engine.api.schemas.postgres.filesystem.entities.files import FilesRow
from mzizi_engine.api.schemas.postgres.filesystem.entities.folders import FoldersRow
from mzizi_engine.api.schemas.postgres.filesystem.entities.taggings import TaggingsRow
from mzizi_engine.api.schemas.postgres.filesystem.entities.tags import TagsRow
from mzizi_engine.api.schemas.postgres.reference.entities.value import ValueRow

__all__ = [
    "FileExtensionsRow",
    "FileRelationsRow",
    "FileVersionsRow",
    "FilesRow",
    "FoldersRow",
    "TaggingsRow",
    "TagsRow",
    "ValueRow",
]
