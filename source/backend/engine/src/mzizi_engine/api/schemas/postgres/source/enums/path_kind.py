"""Path Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class PathKind(StrEnum):
    ENDPOINT = "endpoint"
    FILE = "file"
    LISTING = "listing"
    PAGE = "page"
