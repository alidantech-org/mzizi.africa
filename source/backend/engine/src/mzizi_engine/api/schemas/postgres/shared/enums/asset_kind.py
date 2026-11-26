"""Asset Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class AssetKind(StrEnum):
    ELEVATION = "elevation"
    OUTLINE = "outline"
    RASTER = "raster"
    THUMBNAIL = "thumbnail"
    TILE = "tile"
    TOPOJSON = "topojson"
    VECTOR_BOUNDARY = "vector-boundary"
