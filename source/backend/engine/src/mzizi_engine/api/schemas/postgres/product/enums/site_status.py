"""Site Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class SiteStatus(StrEnum):
    LIVE = "live"
    PLANNED = "planned"
    RETIRED = "retired"
