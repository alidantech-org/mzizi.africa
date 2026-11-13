"""Authorized filesystem HTTP routes of the engine: folders, files, versions, uploads, derivation relations, access
transitions, downloads and sync. Split by concern so no module grows past the repository's size limit; `router` is
shared and each sibling module registers its routes onto it by being imported here.
"""

from __future__ import annotations

from . import folders, relations, sync, uploads  # noqa: F401 (import registers each module's routes)
from ._shared import router

__all__ = ["router"]
