import json

from mzizi_extraction import extract_geojson


def run(document, profile=None):
    data = document if isinstance(document, bytes) else json.dumps(document).encode()
    return extract_geojson(data, profile)


def feature(name, ring, **props):
    return {"type": "Feature", "properties": {"shapeName": name, **props}, "geometry": {"type": "Polygon", "coordinates": [ring]}}


SQUARE = [[36, -1], [37, -1], [37, -2], [36, -2], [36, -1]]


def test_reads_a_feature_collection():
    out = run({"type": "FeatureCollection", "features": [feature("Nairobi", SQUARE), feature("Mombasa", [[39, -4], [40, -4], [40, -5], [39, -5], [39, -4]])]}, "admin-boundaries")
    assert out.status == "succeeded"
    assert [s["key"] for s in out.segments] == ["feature-0", "feature-1"]
    assert json.loads(out.segments[0]["content"])["name"] == "Nairobi"
    assert out.diagnostics[0]["code"] == "features_read"


def test_invalid_json_fails_without_a_traceback():
    out = run(b"{not json")
    assert out.status == "failed" and out.diagnostics[0]["code"] == "invalid_json"


def test_unsupported_document_fails():
    assert run({"type": "Topology"}).status == "failed"
    assert run([1, 2]).status == "failed"


def test_missing_and_empty_geometry_make_the_result_partial():
    out = run({"type": "FeatureCollection", "features": [feature("A", SQUARE), {"type": "Feature", "properties": {"shapeName": "B"}, "geometry": None}]})
    assert out.status == "partial"
    assert any(d["code"] == "no_geometry" for d in out.diagnostics)


def test_warnings_for_invalid_geometry_projected_coordinates_and_duplicates():
    bowtie = [[0, 0], [2, 2], [2, 0], [0, 2], [0, 0]]
    projected = [[500000, 9900000], [510000, 9900000], [510000, 9910000], [500000, 9900000]]
    out = run({"type": "FeatureCollection", "features": [feature("A", bowtie), feature("A", SQUARE), feature("P", projected)]})
    codes = {d["code"] for d in out.diagnostics}
    assert {"invalid_geometry", "outside_wgs84_range", "duplicate_name"} <= codes
    assert out.status == "succeeded"  # kept as published, nothing silently repaired


def test_non_polygon_is_flagged_for_boundary_profile_only():
    point = {"type": "Feature", "properties": {"shapeName": "P"}, "geometry": {"type": "Point", "coordinates": [36.8, -1.3]}}
    assert any(d["code"] == "not_polygonal" for d in run({"type": "FeatureCollection", "features": [point]}, "admin-boundaries").diagnostics)
    assert not any(d["code"] == "not_polygonal" for d in run({"type": "FeatureCollection", "features": [point]}).diagnostics)


def test_declared_projected_crs_is_reported_not_reprojected():
    doc = {"type": "FeatureCollection", "crs": {"type": "name", "properties": {"name": "EPSG:32737"}}, "features": [feature("A", SQUARE)]}
    assert any(d["code"] == "crs_not_wgs84" for d in run(doc).diagnostics)
