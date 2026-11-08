"""GeoJSON extractor: FeatureCollection, Feature or bare geometry to one `feature` segment per feature.

Segment content is the feature's properties and geometry (WGS84 lon/lat). Diagnostics report what
looks wrong (invalid or empty geometry, non-polygon geometry for boundaries, a non-WGS84 CRS,
duplicate names, coordinate order that looks swapped) instead of repairing it silently.
"""
from __future__ import annotations

import json
from collections import Counter

from shapely.geometry import shape
from shapely.errors import ShapelyError

from .result import Output

MAX_BYTES = 256 * 1024 * 1024
POLYGONAL = {"Polygon", "MultiPolygon"}
NAME_KEYS = ("shapeName", "name", "NAME", "NAME_1", "NAME_2", "ADM1_EN", "ADM2_EN", "COUNTY", "county")


def _diag(level: str, code: str, message: str, locator: dict | None = None) -> dict:
    out = {"level": level, "code": code, "message": message}
    if locator is not None:
        out["locator"] = json.dumps(locator, sort_keys=True)
    return out


def _features(document: dict) -> list[dict] | None:
    kind = document.get("type")
    if kind == "FeatureCollection" and isinstance(document.get("features"), list):
        return document["features"]
    if kind == "Feature":
        return [document]
    if kind in {"Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", "GeometryCollection"}:
        return [{"type": "Feature", "properties": {}, "geometry": document}]
    return None


def extract_geojson(data: bytes, profile: str | None = None) -> Output:
    if len(data) > MAX_BYTES:
        return Output("failed", diagnostics=[_diag("error", "too_large", f"{len(data)} bytes exceeds the {MAX_BYTES} byte limit")])
    try:
        document = json.loads(data)
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        return Output("failed", diagnostics=[_diag("error", "invalid_json", str(error))])
    if not isinstance(document, dict):
        return Output("failed", diagnostics=[_diag("error", "not_geojson", "the document is not a JSON object")])
    features = _features(document)
    if features is None:
        return Output("failed", diagnostics=[_diag("error", "not_geojson", f"unsupported GeoJSON type {document.get('type')!r}")])

    diagnostics: list[dict] = []
    crs = (document.get("crs") or {}).get("properties", {}).get("name") if isinstance(document.get("crs"), dict) else None
    if crs and "CRS84" not in crs and "4326" not in crs:
        diagnostics.append(_diag("warning", "crs_not_wgs84", f"declared CRS {crs}; coordinates were not reprojected"))

    segments, invalid, expect_polygons = [], 0, profile == "admin-boundaries"
    names: Counter[str] = Counter()
    for index, feature in enumerate(features):
        locator = {"feature": index}
        geometry = feature.get("geometry") if isinstance(feature, dict) else None
        properties = (feature.get("properties") or {}) if isinstance(feature, dict) else {}
        if not geometry:
            diagnostics.append(_diag("warning", "no_geometry", "feature has no geometry", locator))
            invalid += 1
            continue
        try:
            geom = shape(geometry)
        except (ShapelyError, ValueError, KeyError, TypeError, AttributeError) as error:
            diagnostics.append(_diag("error", "bad_geometry", str(error), locator))
            invalid += 1
            continue
        if geom.is_empty:
            diagnostics.append(_diag("warning", "empty_geometry", "geometry is empty", locator))
            invalid += 1
            continue
        if not geom.is_valid:
            diagnostics.append(_diag("warning", "invalid_geometry", "geometry is not valid (self-intersection or similar); it was kept as published", locator))
        minx, miny, maxx, maxy = geom.bounds
        if not (-180 <= minx <= maxx <= 180 and -90 <= miny <= maxy <= 90):
            diagnostics.append(_diag("warning", "outside_wgs84_range", f"bounds {geom.bounds} fall outside lon/lat range; a projected CRS or swapped axes is likely", locator))
        if expect_polygons and geometry.get("type") not in POLYGONAL:
            diagnostics.append(_diag("warning", "not_polygonal", f"{geometry.get('type')} where a boundary was expected", locator))
        name = next((str(properties[k]) for k in NAME_KEYS if properties.get(k)), None)
        if name:
            names[name] += 1
        segments.append(
            {
                "key": f"feature-{index}",
                "kind": "feature",
                "locator": json.dumps(locator, sort_keys=True),
                "content": json.dumps({"properties": properties, "geometry": geometry, "bounds": list(geom.bounds), "name": name}, sort_keys=True, ensure_ascii=False),
                "confidence": 1,
            }
        )
    for name, count in names.items():
        if count > 1:
            diagnostics.append(_diag("warning", "duplicate_name", f"name {name!r} appears {count} times"))
    diagnostics.insert(0, _diag("info", "features_read", f"{len(segments)} features read, {invalid} skipped"))
    if not segments:
        return Output("failed", diagnostics=diagnostics)
    return Output("partial" if invalid else "succeeded", segments, diagnostics)


