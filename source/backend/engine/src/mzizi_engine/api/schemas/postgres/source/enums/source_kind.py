"""Source Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class SourceKind(StrEnum):
    API = "api"
    FEED = "feed"
    PORTAL = "portal"
    WEBSITE = "website"
