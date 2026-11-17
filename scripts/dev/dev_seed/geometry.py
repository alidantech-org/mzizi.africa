"""Real geoBoundaries outlines matched to the seeded counties, constituencies and wards by name inside their parent."""

from __future__ import annotations

import difflib
import json
from pathlib import Path

from shapely import make_valid, to_wkt
from shapely.geometry import MultiPolygon, Point, Polygon, shape
from shapely.geometry.base import BaseGeometry

from dev_seed.common import ADM1, GEO, Feature, slug, write_csv


def polygonal(geometry: BaseGeometry) -> MultiPolygon:
    """The geometry as a valid MultiPolygon (the column accepts any geometry; outlines are polygonal)."""
    fixed = geometry if geometry.is_valid else make_valid(geometry)
    parts: list[Polygon] = []
    pending = [fixed]
    while pending:
        item = pending.pop()
        if isinstance(item, Polygon):
            parts.append(item)
        elif hasattr(item, "geoms"):
            pending.extend(item.geoms)
    return MultiPolygon(parts)


def best_match(name: str, candidates: dict[str, str]) -> str | None:
    """The candidate code whose last segment is `name`, or the closest spelling above a cutoff."""
    wanted = slug(name)
    for code in candidates:
        if code.rsplit(".", 1)[-1] == wanted:
            return code
    close = difflib.get_close_matches(wanted, [code.rsplit(".", 1)[-1] for code in candidates], n=1, cutoff=0.72)
    if not close:
        return None
    return next(code for code in candidates if code.rsplit(".", 1)[-1] == close[0])


def load_shapes(path: Path) -> list[tuple[str, BaseGeometry]]:
    document = json.loads(path.read_text(encoding="utf-8"))
    return [(item["properties"]["shapeName"], shape(item["geometry"])) for item in document["features"]]


def build_geometries(
    counties: list[Feature], constituencies: list[Feature], wards: list[Feature]
) -> dict[str, MultiPolygon]:
    result: dict[str, MultiPolygon] = {}
    county_codes = {f.code: f.name for f in counties}
    county_shapes: dict[str, BaseGeometry] = {}
    for name, geometry in load_shapes(ADM1):
        code = best_match(name, county_codes)
        if code is not None and code not in county_shapes:
            county_shapes[code] = geometry
            result[code] = polygonal(geometry)
    constituency_shapes: dict[str, BaseGeometry] = {}
    for name, geometry in load_shapes(GEO / "KEN-ADM2-simplified.geojson"):
        point = geometry.representative_point()
        county = next((c for c, g in county_shapes.items() if g.contains(point)), None)
        pool = {f.code: f.name for f in constituencies if county is not None and f.code.startswith(f"{county}.")}
        code = best_match(name, pool or {f.code: f.name for f in constituencies})
        if code is not None and code not in constituency_shapes:
            constituency_shapes[code] = geometry
            result[code] = polygonal(geometry)
    taken: set[str] = set()
    for name, geometry in load_shapes(GEO / "KEN-ADM3-simplified.geojson"):
        centre: Point = geometry.representative_point()
        parent = next((c for c, g in constituency_shapes.items() if g.contains(centre)), None)
        if parent is None:
            continue
        pool = {f.code: f.name for f in wards if f.code.startswith(f"{parent}.") and f.code not in taken}
        code = best_match(name, pool)
        if code is not None:
            taken.add(code)
            result[code] = polygonal(geometry)
    return result


def write_geometries(geometries: dict[str, MultiPolygon]) -> None:
    rows = [
        {
            "feature_code": code,
            "geometry_role_code": "geo.geometry.role.outline",
            "basis_code": "geo.geometry.basis.approximate",
            "revision": "1",
            "srid": "4326",
            "geometry": f"SRID=4326;{to_wkt(geometry, rounding_precision=5)}",
            "confidence": "0.7",
            "from_year": "2013",
            "from_to_precision": "exact",
            "min_zoom": "0",
            "max_zoom": "18",
        }
        for code, geometry in sorted(geometries.items())
    ]
    header = [
        "feature_code",
        "geometry_role_code",
        "basis_code",
        "revision",
        "srid",
        "geometry",
        "confidence",
        "from_year",
        "from_to_precision",
        "min_zoom",
        "max_zoom",
    ]
    write_csv("ke/geo/dev-boundaries/geometries.csv", header, rows)
