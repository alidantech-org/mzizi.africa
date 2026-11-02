"""Resolves boundaries that the containment check deferred.

Two corrections, both reported and neither silent:

1. A unit whose parent was chosen by representative point, when at least REPARENT_MIN of its shape lies in a sibling of that
   parent and at most REPARENT_MAX lies in the assigned one, is moved to that sibling (its code follows its parent).
2. A boundary that lies at least CLIP_MIN (75 percent) inside its (now correct) parent is re-staged clipped to the parent, as an `inferred`
   candidate; the original candidate becomes `superseded`. Shapes that lie mostly outside every parent are left deferred.
"""
from __future__ import annotations

import json

import psycopg

from . import candidates
from .imports.geo_admin import MAPPINGS
import yaml

REPARENT_MIN = 0.6
REPARENT_MAX = 0.4
CLIP_MIN = 0.75
BUFFER = 0.01  # same tolerance as the containment check

_INVALID = """SELECT c.id::text AS cid, c.run_id::text AS run_id, c.segment_key, c.extraction_result_id::text AS result_id,
       u.id::text AS unit_id, u.code, u.parent_id::text AS parent_id, u.level_id::text AS level_id,
       ST_SetSRID(ST_GeomFromGeoJSON(c.payload->>'geometry'), 4326) AS g
  FROM staging.candidates c JOIN geography.units u ON u.code = c.payload->'unitId'->'$ref'->'where'->>'code'
        OR (NOT EXISTS (SELECT 1 FROM geography.units x WHERE x.code = c.payload->'unitId'->'$ref'->'where'->>'code')
            AND u.code LIKE '%%/' || split_part(c.payload->'unitId'->'$ref'->'where'->>'code', '/', 2) || '/%%/' || split_part(c.payload->'unitId'->'$ref'->'where'->>'code', '/', 4)
            AND split_part(u.code, '/', 4) = split_part(c.payload->'unitId'->'$ref'->'where'->>'code', '/', 4) AND split_part(u.code, '/', 2) = split_part(c.payload->'unitId'->'$ref'->'where'->>'code', '/', 2))
 WHERE c.status = 'invalid' AND c.target_kind = 'geography.boundaries'"""


def fix_containment(conn: psycopg.Connection, apply: bool = False) -> dict:
    report = {"reparented": [], "clipped": [], "left_deferred": []}
    rows = conn.execute(_INVALID).fetchall()
    for r in rows:
        best = conn.execute(
            """WITH c AS (SELECT ST_SetSRID(ST_GeomFromGeoJSON(c.payload->>'geometry'), 4326) AS g FROM staging.candidates c WHERE c.id = %s)
               SELECT pu.id::text AS id, pu.code, ST_Area(ST_Intersection(c.g, s.geom)) / NULLIF(ST_Area(c.g), 0) AS share
                 FROM c, geography.units pu JOIN geography.boundaries b ON b.unit_id = pu.id AND b.is_current JOIN geography.boundary_shapes s ON s.boundary_id = b.id
                WHERE pu.level_id = (SELECT level_id FROM geography.units WHERE id = %s)
                ORDER BY 3 DESC NULLS LAST LIMIT 1""",
            (r["cid"], r["parent_id"]),
        ).fetchone()
        own = conn.execute(
            """SELECT ST_Area(ST_Intersection(%s::geometry, s.geom)) / NULLIF(ST_Area(%s::geometry), 0) AS share
                 FROM geography.boundaries b JOIN geography.boundary_shapes s ON s.boundary_id = b.id WHERE b.unit_id = %s AND b.is_current""",
            (r["g"], r["g"], r["parent_id"]),
        ).fetchone()
        r["own"] = float(own["share"] or 0) if own else 0.0
        if best and best["id"] != r["parent_id"] and (best["share"] or 0) >= REPARENT_MIN and r["own"] <= REPARENT_MAX:
            leaf = r["code"].rsplit("/", 1)[1]
            new_code = f"{best['code']}/{leaf}"
            report["reparented"].append({"from": r["code"], "to": new_code, "inside_old": round(r["own"], 2), "inside_new": round(float(best["share"]), 2)})
            if apply:
                conn.execute("UPDATE geography.units SET parent_id = %s, code = %s, version = version + 1 WHERE id = %s", (best["id"], new_code, r["unit_id"]))
            r["code"], r["parent_id"], r["own"] = new_code, best["id"], float(best["share"])
    clipped = []
    for r in rows:
        if r["own"] < CLIP_MIN:
            report["left_deferred"].append({"code": r["code"], "inside_parent": round(r["own"], 2)})
            continue
        geo = conn.execute(
            """SELECT ST_AsGeoJSON(ST_CollectionExtract(ST_MakeValid(ST_Intersection(%s::geometry, ST_Buffer(s.geom, %s))), 3)) AS gj
                 FROM geography.boundaries b JOIN geography.boundary_shapes s ON s.boundary_id = b.id WHERE b.unit_id = %s AND b.is_current""",
            (r["g"], BUFFER, r["parent_id"]),
        ).fetchone()
        report["clipped"].append({"code": r["code"], "inside_parent": round(r["own"], 2)})
        clipped.append((r, geo["gj"]))
    if apply and clipped:
        mapping = yaml.safe_load((MAPPINGS / "boundary.yml").read_text())
        mapping["fields"]["referenceYear"] = {"const": "2020"}  # the geoBoundaries release year of the source shapes
        mapping["provenance"]["method"] = "inferred"
        for run_id in {r["run_id"] for r, _ in clipped}:
            old = conn.execute("SELECT capture_id::text AS cap, extraction_result_id::text AS res FROM staging.runs WHERE id = %s", (run_id,)).fetchone()
            new_run = candidates.create_run(conn, "geoadmin/ke/containment-clip", "v1", old["cap"], old["res"])
            mine = [(r, gj) for r, gj in clipped if r["run_id"] == run_id]
            records = [(r["segment_key"] or r["code"], {"unitCode": r["code"], "geometry": gj}) for r, gj in mine]
            candidates.add_candidates(conn, new_run, mapping, records, old["res"], ["none_known"], [], method="inferred")
            candidates.finish_run(conn, new_run)
            for r, _ in mine:
                conn.execute("UPDATE staging.candidates SET status = 'superseded' WHERE id = %s", (r["cid"],))
        conn.commit()
    return report
