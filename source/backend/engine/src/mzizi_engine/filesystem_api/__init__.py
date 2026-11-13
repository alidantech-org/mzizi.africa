"""Authorized filesystem HTTP routes of the engine: folders, files, versions, uploads, derivation relations, access
transitions, downloads and sync. Split by concern so no module grows past the repository's size limit; `router` is
shared and each sibling module registers its routes onto it by being imported here.
"""

from __future__ import annotations

from mzizi_engine.filesystem_api import folders, relations, sync, uploads
from mzizi_engine.filesystem_api._shared import router

__all__ = ["folders", "relations", "router", "sync", "uploads"]
