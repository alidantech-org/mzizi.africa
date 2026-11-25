"""Asset Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class AssetKind(StrEnum):
    EMBED = "embed"
    EXTERNAL = "external"
    HELD = "held"
