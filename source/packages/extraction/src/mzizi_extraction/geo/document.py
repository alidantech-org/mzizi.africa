"""Typed view of a GeoJSON document. Parsing from untyped JSON happens here, once."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, TypeAdapter, ValidationError

from mzizi_extraction.core import JsonValue

GEOMETRY_TYPES = frozenset(
    {"Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", "GeometryCollection"}
)
POLYGONAL = frozenset({"Polygon", "MultiPolygon"})
WGS84_MARKERS = ("CRS84", "4326")


class _External(BaseModel):
    """Third-party data: unknown fields are ignored, not rejected."""

    model_config = ConfigDict(frozen=True, extra="ignore")


class GeoFeature(_External):
    properties: dict[str, JsonValue] | None = None
    geometry: dict[str, JsonValue] | None = None


class GeoDocument(_External):
    type: str
    crs: dict[str, JsonValue] | None = None
    features: list[JsonValue] | None = None


_FEATURE: TypeAdapter[GeoFeature] = TypeAdapter(GeoFeature)


def parse_document(value: JsonValue) -> GeoDocument | None:
    """The document when it is a JSON object, else None."""
    if not isinstance(value, dict):
        return None
    try:
        return GeoDocument.model_validate(value)
    except ValidationError:
        return None


def declared_crs_name(document: GeoDocument) -> str | None:
    properties = document.crs.get("properties") if document.crs else None
    name = properties.get("name") if isinstance(properties, dict) else None
    return name if isinstance(name, str) else None


def is_wgs84(crs_name: str) -> bool:
    return any(marker in crs_name for marker in WGS84_MARKERS)


def parse_feature(value: JsonValue) -> GeoFeature:
    """A feature; a malformed entry becomes a feature with no geometry so it is reported, not hidden."""
    try:
        return _FEATURE.validate_python(value)
    except ValidationError:
        return GeoFeature()


def features_of(value: JsonValue, document: GeoDocument) -> list[JsonValue] | None:
    """The features in a FeatureCollection, Feature or bare geometry; None for unsupported documents."""
    if document.type == "FeatureCollection" and document.features is not None:
        return document.features
    if document.type == "Feature":
        return [value]
    if document.type in GEOMETRY_TYPES:
        return [{"type": "Feature", "properties": {}, "geometry": value}]
    return None
