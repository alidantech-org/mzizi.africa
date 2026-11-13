"""Geometry checks that report what looks wrong without repairing it."""

from __future__ import annotations

from shapely.geometry.base import BaseGeometry

from mzizi_extraction.core import Code, Diagnostic, Locator, warning
from mzizi_extraction.geo.document import POLYGONAL

MAX_LON, MAX_LAT = 180.0, 90.0


def bounds_diagnostics(geom: BaseGeometry, locator: Locator) -> list[Diagnostic]:
    minx, miny, maxx, maxy = geom.bounds
    if -MAX_LON <= minx <= maxx <= MAX_LON and -MAX_LAT <= miny <= maxy <= MAX_LAT:
        return []
    return [
        warning(
            Code.OUTSIDE_WGS84_RANGE,
            f"bounds {geom.bounds} fall outside lon/lat range; a projected CRS or swapped axes is likely",
            locator,
        )
    ]


def validity_diagnostics(geom: BaseGeometry, locator: Locator) -> list[Diagnostic]:
    if geom.is_valid:
        return []
    return [
        warning(
            Code.INVALID_GEOMETRY,
            "geometry is not valid (self-intersection or similar); it was kept as published",
            locator,
        )
    ]


def polygon_diagnostics(geometry_type: object, expect_polygons: bool, locator: Locator) -> list[Diagnostic]:
    if not expect_polygons or geometry_type in POLYGONAL:
        return []
    return [warning(Code.NOT_POLYGONAL, f"{geometry_type} where a boundary was expected", locator)]
