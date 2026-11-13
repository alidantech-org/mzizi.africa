"""GeoJSON extractor: FeatureCollection, Feature or bare geometry to one `feature` segment per feature.

Segment content is the feature's properties and geometry (WGS84 lon/lat). Diagnostics report what looks wrong
(invalid or empty geometry, non-polygon geometry for boundaries, a non-WGS84 CRS, duplicate names, coordinates
outside the lon/lat range) instead of repairing it silently.
"""

from __future__ import annotations

from collections import Counter

from shapely.errors import ShapelyError
from shapely.geometry import shape

from mzizi_extraction.core import (
    Code,
    Diagnostic,
    ExtractionProfile,
    FeatureContent,
    JsonValue,
    Locator,
    Output,
    Segment,
    SegmentKind,
    Status,
    error,
    failed,
    info,
    warning,
)
from mzizi_extraction.geo.checks import bounds_diagnostics, polygon_diagnostics, validity_diagnostics
from mzizi_extraction.geo.document import (
    GeoFeature,
    declared_crs_name,
    features_of,
    is_wgs84,
    parse_document,
    parse_feature,
)
from mzizi_extraction.parse import JsonParseError, load_json


def _feature_name(properties: dict[str, JsonValue], name_keys: tuple[str, ...]) -> str | None:
    for key in name_keys:
        value = properties.get(key)
        if value:
            return str(value)
    return None


def _read_feature(
    index: int, feature: GeoFeature, profile: ExtractionProfile
) -> tuple[Segment | None, list[Diagnostic]]:
    locator = Locator(feature=index)
    geometry = feature.geometry
    if not geometry:
        return None, [warning(Code.NO_GEOMETRY, "feature has no geometry", locator)]
    try:
        geom = shape(geometry)
    except (ShapelyError, ValueError, KeyError, TypeError, AttributeError) as problem:
        return None, [error(Code.BAD_GEOMETRY, str(problem), locator)]
    if geom.is_empty:
        return None, [warning(Code.EMPTY_GEOMETRY, "geometry is empty", locator)]
    diagnostics = [
        *validity_diagnostics(geom, locator),
        *bounds_diagnostics(geom, locator),
        *polygon_diagnostics(geometry.get("type"), profile.expect_polygons, locator),
    ]
    properties = feature.properties or {}
    content = FeatureContent(
        properties=properties,
        geometry=geometry,
        bounds=geom.bounds,
        name=_feature_name(properties, profile.name_keys),
    )
    segment = Segment(
        key=f"feature-{index}", kind=SegmentKind.FEATURE, locator=locator, content=content, confidence=1.0
    )
    return segment, diagnostics


def extract_geojson(data: bytes, profile: ExtractionProfile | None = None) -> Output:
    profile = profile or ExtractionProfile()
    if len(data) > profile.limits.max_bytes:
        return failed(error(Code.TOO_LARGE, f"{len(data)} bytes exceeds the {profile.limits.max_bytes} byte limit"))
    try:
        value = load_json(data)
    except JsonParseError as problem:
        return failed(error(Code.INVALID_JSON, str(problem)))
    document = parse_document(value)
    if document is None:
        return failed(error(Code.NOT_GEOJSON, "the document is not a JSON object"))
    raw_features = features_of(value, document)
    if raw_features is None:
        return failed(error(Code.NOT_GEOJSON, f"unsupported GeoJSON type {document.type!r}"))

    diagnostics: list[Diagnostic] = []
    crs = declared_crs_name(document)
    if crs and not is_wgs84(crs):
        diagnostics.append(warning(Code.CRS_NOT_WGS84, f"declared CRS {crs}; coordinates were not reprojected"))

    segments: list[Segment] = []
    skipped = 0
    for index, raw in enumerate(raw_features):
        segment, found = _read_feature(index, parse_feature(raw), profile)
        diagnostics.extend(found)
        if segment is None:
            skipped += 1
        else:
            segments.append(segment)

    names = Counter(
        s.content.name for s in segments if isinstance(s.content, FeatureContent) and s.content.name is not None
    )
    for name, count in names.items():
        if count > 1:
            diagnostics.append(warning(Code.DUPLICATE_NAME, f"name {name!r} appears {count} times"))
    diagnostics.insert(0, info(Code.FEATURES_READ, f"{len(segments)} features read, {skipped} skipped"))
    if not segments:
        return Output(status=Status.FAILED, diagnostics=tuple(diagnostics))
    status = Status.PARTIAL if skipped else Status.SUCCEEDED
    return Output(status=status, segments=tuple(segments), diagnostics=tuple(diagnostics))
