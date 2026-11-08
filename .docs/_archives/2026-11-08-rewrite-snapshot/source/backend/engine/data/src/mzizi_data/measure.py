"""Geography measurements: geodesic area, perimeter and label point of every unit, computed from its current boundary shape.

The numbers are derived, not sourced: PostGIS computes them from `geography.boundary_shapes.geom` on the WGS84 ellipsoid
(`geometry::geography`, so no projection distortion). Each figure is a statistical observation (indicators `geography.area_km2`
and `geography.perimeter_km`) with estimate kind `derived`, a vintage naming the geometry release, a release label naming the
boundary version it came from, and an attribution to a preserved computation report. A replaced boundary produces a new value that
supersedes the old one; running `measure` again is idempotent when nothing changed.
"""
from __future__ import annotations

import json
from pathlib import Path

import psycopg

from . import statload
from .files import LocalDirectoryStore
from .geo_link import norm

METHOD = "PostGIS ST_Area and ST_Perimeter on geometry::geography (WGS84 ellipsoid), square kilometres and kilometres"
TOOL = "postgis-geodesic-measure"
PUBLISHER = ("mzizi-derived", "Mzizi derived computations")
DATASET = "mzizi/geography-measurements"
CATEGORY = ("geography", "Geography")
INDICATORS = {
    "geography.area_km2": ("Area", "km2", "Geodesic area of the unit's current boundary shape."),
    "geography.perimeter_km": ("Perimeter", "km", "Geodesic perimeter of the unit's current boundary shape."),
}


def geodesic_km(conn: psycopg.Connection, geometry_json: str) -> tuple[float, float]:
    """(area in km2, perimeter in km) of a GeoJSON geometry on the WGS84 ellipsoid, by the same expressions `compute` uses."""
    row = conn.execute(
        "SELECT ST_Area(g::geography) / 1e6 AS a, ST_Perimeter(g::geography) / 1000 AS p FROM (SELECT ST_SetSRID(ST_GeomFromGeoJSON(%s), 4326) AS g) t", (geometry_json,)
    ).fetchone()
    return float(row["a"]), float(row["p"])


def compute(conn: psycopg.Connection) -> list[dict]:
    """One row per unit with a valid current shape. Areas below the shape's precision are not rounded here."""
    return conn.execute(
        """SELECT u.code, u.name, b.id::text AS boundary_id, b.version_number, b.reference_year,
                  ST_Area(s.geom::geography) / 1e6 AS area_km2,
                  ST_Perimeter(s.geom::geography) / 1000 AS perimeter_km,
                  ST_AsGeoJSON(ST_PointOnSurface(s.geom), 6) AS label_point
             FROM geography.units u JOIN geography.boundaries b ON b.unit_id = u.id AND b.is_current
             JOIN geography.boundary_shapes s ON s.boundary_id = b.id AND s.is_valid
            ORDER BY u.code"""
    ).fetchall()


def run(conn: psycopg.Connection, store: LocalDirectoryStore, jurisdiction: str = "ke", fill_label_points: bool = True) -> dict:
    measured = compute(conn)
    rows = [{k: (float(v) if k in ("area_km2", "perimeter_km") else v) for k, v in r.items()} for r in measured]
    report = json.dumps({"method": METHOD, "unit_count": len(rows), "rows": rows}, sort_keys=True, indent=1).encode()
    pub = statload.publisher(conn, *PUBLISHER, kind="institution")
    source = statload.preserve(
        conn, store, report, "geography-measurements.json", pub, "Geography measurements computed from boundary shapes", None,
        "Derived by Mzizi; the shapes keep the licence of their source (geoBoundaries CC BY 4.0), the computed numbers add no claim of their own",
        f"Computed {METHOD}.", TOOL, "application/json",
    )
    year = {r["reference_year"] for r in measured if r["reference_year"]}
    release = f"boundary shapes, reference year {min(year)}" if len(year) == 1 else "boundary shapes, mixed reference years"
    vintage_code = f"geometry/{min(year)}" if len(year) == 1 else "geometry/mixed"
    J = statload.jurisdiction_id(conn, jurisdiction)
    categories = [{"code": CATEGORY[0], "label": CATEGORY[1]}]
    indicators = [{"code": c, "name": n, "unitOfMeasure": u, "definition": d, "categoryId": statload.ref("statistical.categories", code=CATEGORY[0])} for c, (n, u, d) in INDICATORS.items()]
    period_year = min(year) if len(year) == 1 else None
    periods = [{"code": f"year/{y}", "startsOn": f"{y}-01-01", "endsOn": f"{y}-12-31", "granularity": "year"} for y in sorted(year)]
    vintages = [{"code": vintage_code, "label": release}]
    datasets = [{"code": DATASET, "title": "Geography measurements (area, perimeter) computed from boundary shapes", "methodology": METHOD, "collector": PUBLISHER[1], "jurisdictionId": J}]
    obs = []
    for r in rows:
        y = r["reference_year"] or period_year
        if not y:
            continue
        for ind, field in (("geography.area_km2", "area_km2"), ("geography.perimeter_km", "perimeter_km")):
            obs.append(
                {
                    "tableId": statload.ref("statistical.datasets", code=DATASET),
                    "indicatorId": statload.ref("statistical.indicators", code=ind),
                    "periodId": statload.ref("statistical.periods", code=f"year/{y}"),
                    "geoUnitId": statload.ref("geography.units", code=r["code"]),
                    "vintageId": statload.ref("statistical.vintages", code=vintage_code),
                    "numericValue": f"{r[field]:.4f}",
                    "confidenceLevel": "estimate",
                    "estimateKind": "derived",
                    "measureType": "other",
                    "releaseLabel": f"boundary version {r['version_number']}",
                }
            )
    groups = [
        statload.Group("category", "statistical.categories", ["code"], categories),
        statload.Group("indicator", "statistical.indicators", ["code"], indicators),
        statload.Group("period", "statistical.periods", ["code"], periods),
        statload.Group("vintage", "statistical.vintages", ["code"], vintages),
        statload.Group("dataset", "statistical.datasets", ["code"], datasets),
        statload.Group("observation", "statistical.observations", ["tableId", "indicatorId", "periodId", "geoUnitId", "vintageId"], obs, method="inferred"),
    ]
    staged = statload.stage(conn, store, source, TOOL, "1", f"measure/{jurisdiction}", groups)
    labels = 0
    if fill_label_points:
        for r in rows:
            labels += conn.execute("UPDATE geography.boundaries SET label_point = %s, updated_at = now() WHERE id = %s AND label_point IS DISTINCT FROM %s", (r["label_point"], r["boundary_id"], r["label_point"])).rowcount
        conn.commit()
    return {"rows": len(rows), "runs": staged.runs, "stats": staged.stats, "label_points_set": labels}


def compare_hdx(conn: psycopg.Connection, hdx_dir: str | Path, threshold: float = 0.05) -> dict:
    """Areas of the promoted shapes against the HDX COD-AB shapes (counties and constituencies); differences above the threshold are listed."""
    hdx_dir = Path(hdx_dir)
    h1 = {norm(f["properties"]["adm1_name"]): f for f in json.loads((hdx_dir / "ken_admin1.geojson").read_text())["features"]}
    h2 = {(norm(f["properties"]["adm1_name"]), norm(f["properties"]["adm2_name"])): f for f in json.loads((hdx_dir / "ken_admin2.geojson").read_text())["features"]}

    def area_km2(geometry: dict) -> float:
        return float(conn.execute("SELECT ST_Area(ST_SetSRID(ST_GeomFromGeoJSON(%s), 4326)::geography) / 1e6 AS a", (json.dumps(geometry),)).fetchone()["a"])

    rows = conn.execute(
        """SELECT u.code, u.name, l."order" AS level, p.name AS parent, ST_AsGeoJSON(s.geom) AS gj
             FROM geography.units u JOIN reference.classifications l ON l.id = u.level_id LEFT JOIN geography.units p ON p.id = u.parent_id
             JOIN geography.boundaries b ON b.unit_id = u.id AND b.is_current JOIN geography.boundary_shapes s ON s.boundary_id = b.id AND s.is_valid
            WHERE l."order" IN (1, 2)"""
    ).fetchall()
    report = {"compared": 0, "within": 0, "differ": [], "unmatched": []}
    for r in rows:
        match = h1.get(norm(r["name"])) if r["level"] == 1 else h2.get((norm(r["parent"]), norm(r["name"])))
        if match is None and r["level"] == 2:
            hits = [f for k, f in h2.items() if k[0] == norm(r["parent"]) and (k[1] in norm(r["name"]) or norm(r["name"]) in k[1])]
            match = hits[0] if len(hits) == 1 else None
        if match is None:
            report["unmatched"].append(r["code"])
            continue
        a, b = area_km2(json.loads(r["gj"])), area_km2(match["geometry"])
        report["compared"] += 1
        diff = abs(a - b) / b if b else 1.0
        if diff > threshold:
            report["differ"].append({"code": r["code"], "mzizi_km2": round(a, 1), "hdx_km2": round(b, 1), "difference": round(diff, 3)})
        else:
            report["within"] += 1
    return report
