"""Path Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class PathKind(StrEnum):
    API = "api"
    FEED = "feed"
    FILE = "file"
    LISTING = "listing"
    PAGE = "page"
