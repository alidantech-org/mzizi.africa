"""Cross-checks the promoted Kenyan boundaries against the HDX COD-AB (OCHA) boundaries.

Counties (ADM1) and constituencies (ADM2) are matched by name within their county, then compared by overlap (area of the
intersection over the area of the union). A boundary whose overlap is at least VERIFIED_IOU and whose HDX parent county
is the same county becomes `verified` (a new verification row; the old row stays, no longer current). Everything else is
reported, never changed. Wards have no second source here and stay `unverified`.
"""
from __future__ import annotations

import json
from pathlib import Path

import psycopg
from shapely.geometry import shape
from shapely.validation import make_valid

from .geo_link import norm

VERIFIED_IOU = 0.9


def _iou(a, b) -> float:
    a, b = make_valid(a), make_valid(b)
    union = a.union(b).area
    return a.intersection(b).area / union if union else 0.0


def crosscheck(conn: psycopg.Connection, hdx_dir: str | Path, actor_id: str | None = None, apply: bool = False) -> dict:
    hdx_dir = Path(hdx_dir)
    h1 = {norm(f["properties"]["adm1_name"]): f for f in json.loads((hdx_dir / "ken_admin1.geojson").read_text())["features"]}
    h2: dict[tuple[str, str], dict] = {}
    for f in json.loads((hdx_dir / "ken_admin2.geojson").read_text())["features"]:
        h2[(norm(f["properties"]["adm1_name"]), norm(f["properties"]["adm2_name"]))] = f
    rows = conn.execute(
        """SELECT u.code, u.name, l."order" AS level, p.name AS parent, b.id AS boundary_id, ST_AsGeoJSON(s.geom) AS geojson
             FROM geography.units u JOIN reference.classifications l ON l.id = u.level_id LEFT JOIN geography.units p ON p.id = u.parent_id
             JOIN geography.boundaries b ON b.unit_id = u.id AND b.is_current JOIN geography.boundary_shapes s ON s.boundary_id = b.id AND s.is_valid
            WHERE l."order" IN (1, 2)"""
    ).fetchall()
    report = {"checked": 0, "verified": 0, "low_overlap": [], "not_in_hdx": [], "hdx_not_in_mzizi": []}
    seen2: set[tuple[str, str]] = set()
    for r in rows:
        report["checked"] += 1
        if r["level"] == 1:
            match = h1.get(norm(r["name"]))
        else:
            key = (norm(r["parent"]), norm(r["name"]))
            match = h2.get(key)
            if match is None:  # names spelled differently: a unique containment match inside the county
                hits = [(k, f) for k, f in h2.items() if k[0] == key[0] and (k[1] in key[1] or key[1] in k[1])]
                match = hits[0][1] if len(hits) == 1 else None
                key = hits[0][0] if len(hits) == 1 else key
            seen2.add(key)
        if match is None:
            report["not_in_hdx"].append(r["code"])
            continue
        overlap = _iou(shape(json.loads(r["geojson"])), shape(match["geometry"]))
        if overlap < VERIFIED_IOU:
            report["low_overlap"].append({"code": r["code"], "iou": round(overlap, 3)})
            continue
        report["verified"] += 1
        if apply:
            conn.execute("UPDATE source.verifications SET is_current = false, updated_at = now() WHERE target_kind = 'geography.boundaries' AND target_id = %s AND is_current", (r["boundary_id"],))
            conn.execute(
                """INSERT INTO source.verifications (target_kind, target_id, state, decided_by, rationale, is_current, created_at, updated_at, version)
                   VALUES ('geography.boundaries', %s, 'verified', %s, %s, true, now(), now(), 1)""",
                (r["boundary_id"], actor_id, f"cross-checked against HDX COD-AB (OCHA): same unit name and parent, overlap {overlap:.3f}"),
            )
    report["hdx_not_in_mzizi"] = sorted(f"{a}/{b}" for (a, b) in h2 if (a, b) not in seen2)
    if apply:
        conn.commit()
    return report
