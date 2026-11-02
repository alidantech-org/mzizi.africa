"""All four administrative levels of a country from geoBoundaries-style GeoJSON, with parents found by geometry.

Level files (ADM0 country, ADM1 counties, ADM2 constituencies, ADM3 wards) carry names and shape ids but no parent.
Each unit's parent is the previous level's polygon that contains its representative point (the nearest one when
the point falls in a gap, with a note). Codes are `<country>/<county>/<constituency>/<ward>` slugs, so names that repeat
across parents stay distinct; names that repeat inside one parent get a numeric suffix and a note.

Deduplication: a repeated shape id is dropped; features with the same parent, the same normalised name and almost the same
area (within 2 %) are one unit; any other repeat is kept, suffixed and reported. Nothing is merged silently: every
decision is in `problems`. Stages: units level by level (A0..A3), then boundaries (B0..B3), each after the former is promoted.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from pathlib import Path

import psycopg
import yaml
from shapely.geometry import shape
from shapely.strtree import STRtree

from .. import candidates, jobs, pipeline, register
from ..files import LocalDirectoryStore
from ..structure.effective import substitute
from .budget_table import MAPPINGS as _BUDGET_MAPPINGS
from .members import slug

MAPPINGS = _BUDGET_MAPPINGS.parent / "geoadmin"
LEVELS = {0: ("ADM0", "geography/level/country"), 1: ("ADM1", "geography/level/county"), 2: ("ADM2", "geography/level/constituency"), 3: ("ADM3", "geography/level/ward")}


@dataclass
class Unit:
    level: int
    shape_id: str
    name: str
    code: str
    parent_code: str | None
    geometry: dict
    problems: list[str] = field(default_factory=list)


def _norm(name: str) -> str:
    return re.sub(r"[^a-z0-9]", "", name.lower())


def build_units(features_by_level: dict[int, list[dict]], country_code: str, country_name: str) -> tuple[list[Unit], list[str]]:
    """Units for every level with codes and parents, and the list of dedup and parent-matching decisions."""
    problems: list[str] = []
    units: dict[int, list[Unit]] = {}
    for level in sorted(features_by_level):
        feats = features_by_level[level]
        seen_ids: set[str] = set()
        parents = units.get(level - 1, [])
        tree = STRtree([shape(p.geometry) for p in parents]) if parents else None
        parent_shapes = [shape(p.geometry) for p in parents]
        taken: dict[str, Unit] = {}
        out: list[Unit] = []
        for feat in feats:
            props = feat["properties"]
            sid, name = props.get("shapeID"), " ".join((props.get("shapeName") or "").split())
            if not name:
                problems.append(f"ADM{level}: feature {sid} has no name, skipped")
                continue
            if sid in seen_ids:
                problems.append(f"ADM{level}: repeated shape id {sid} ({name}) dropped")
                continue
            seen_ids.add(sid)
            geom = shape(feat["geometry"])
            if level == 0:
                out.append(Unit(0, sid, country_name, country_code, None, feat["geometry"]))
                continue
            point = geom.representative_point()
            # The parent is the polygon holding most of the shape, not the one under its representative point: the
            # simplified shapes of neighbours overlap along their borders, and a point can fall in the wrong one.
            hits = [(parent_shapes[i].intersection(geom).area, i) for i in tree.query(geom) if parent_shapes[i].intersects(geom)]
            note = None
            if hits and max(hits)[0] > 0:
                parent = parents[max(hits)[1]]
                under_point = [i for i in tree.query(point) if parent_shapes[i].contains(point)]
                if under_point and parents[under_point[0]] is not parent:
                    note = f"ADM{level} {name}: most of the shape lies in {parent.name}, not in {parents[under_point[0]].name} under its representative point; {parent.name} used"
                    problems.append(note)
            else:
                nearest = tree.nearest(point)
                parent = parents[int(nearest)]
                note = f"ADM{level} {name}: shape meets no ADM{level - 1} polygon; nearest parent {parent.name} used"
                problems.append(note)
            base = f"{parent.code}/{slug(name)}"
            twin = taken.get(base)
            if twin is not None:
                a, b = shape(twin.geometry).area, geom.area
                if a and abs(a - b) / max(a, b) <= 0.02:
                    problems.append(f"ADM{level}: {name} under {parent.name} repeats a feature of almost the same area; treated as one unit (kept {twin.shape_id}, dropped {sid})")
                    continue
                n = 2
                while f"{base}-{n}" in taken:
                    n += 1
                code = f"{base}-{n}"
                problems.append(f"ADM{level}: {name} under {parent.name} repeats with a different shape; coded {code}")
            else:
                code = base
            unit = Unit(level, sid, name, code, parent.code, feat["geometry"], [note] if note else [])
            taken[code] = unit
            out.append(unit)
        units[level] = out
        taken.clear()
    return [u for level in sorted(units) for u in units[level]], problems


@dataclass
class GeoAdminImport:
    units: int
    problems: list[str]
    runs: dict[str, str]
    stats: dict[str, candidates.CandidateStats]


def import_geo_admin(conn: psycopg.Connection, store: LocalDirectoryStore, directory: str | Path, level: int, part: str, jurisdiction: str = "ke", country_name: str = "Kenya", reference_year: str = "") -> GeoAdminImport:
    """part 'units' or 'boundaries' for one level; the parents' units must already be promoted (units) or the units themselves (boundaries)."""
    directory = Path(directory)
    features_by_level: dict[int, list[dict]] = {}
    files = {}
    for lv, (name, _code) in LEVELS.items():
        path = directory / f"geoBoundaries-KEN-{name}_simplified.geojson"
        if path.exists():
            features_by_level[lv] = json.loads(path.read_text())["features"]
            files[lv] = path
    units, problems = build_units(features_by_level, jurisdiction, country_name)
    mine = [u for u in units if u.level == level]
    publisher_id = register.ensure_publisher(conn, "geoboundaries", "geoBoundaries (William & Mary geoLab)", kind="repository", website_url="https://www.geoboundaries.org")
    row = conn.execute("SELECT id::text AS id FROM reference.jurisdictions WHERE code = %s", (jurisdiction,)).fetchone()
    name = LEVELS[level][0]
    spec = register.DocumentSpec(publisher_id, f"geoBoundaries gbOpen KEN {name} (simplified), as kept in the Polifin repository", "dataset", url="https://github.com/Alidantech/polifin/tree/290ffbfa46e3ef38e7e35ce534406a6c31873ffc/public/admin", licence="Open licence stated by geoBoundaries (gbOpen); not confirmed by a reviewer", citation="Runfola, D. et al. (2020) geoBoundaries: A global database of political administrative boundaries. PLoS ONE 15(4): e0231866.", jurisdiction_id=row["id"] if row else None)
    document_id, capture_id, ref = pipeline.ingest(conn, store, files[level].read_bytes(), files[level].name, spec, url=spec.url, tool="gh-api-download", mime_type="application/geo+json")
    job_id, _ = pipeline.enqueue_extraction(conn, ref.version_id, "geojson", "admin-boundaries", capture_id)
    conn.commit()
    while jobs.run_once(conn, {"extract": pipeline.extraction_handler(conn, store)}, worker="geoadmin-import"):
        pass
    job = conn.execute("SELECT status, result_file_version_id::text AS fv, error FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
    if job["status"] != "succeeded":
        raise RuntimeError(f"extraction of {name} did not succeed: {job['status']} {job['error']}")
    result = pipeline.load_result(store, job["fv"])
    by_shape = {}
    for segment in result.segments:
        content = json.loads(segment.content)
        by_shape[content["properties"].get("shapeID")] = segment.key
    variables = {"jurisdiction": jurisdiction, "reference_year": reference_year}
    mapping_name = "unit" if part == "units" else "boundary"
    mapping = substitute(yaml.safe_load((MAPPINGS / f"{mapping_name}.yml").read_text()), variables)
    records = [(by_shape.get(u.shape_id, u.shape_id), {"name": u.name, "unitCode": u.code, "parentCode": u.parent_code, "levelRef": {"$ref": {"kind": "reference.classifications", "where": {"code": LEVELS[u.level][1], "jurisdictionId": {"$ref": {"kind": "reference.jurisdictions", "where": {"code": jurisdiction}}}}}}, "geometry": json.dumps(u.geometry, separators=(",", ":"))}) for u in mine]
    run_id = candidates.create_run(conn, f"geoadmin/{jurisdiction}/{name}/{mapping_name}", "v1", capture_id, str(result.id))
    stats = candidates.add_candidates(conn, run_id, mapping, records, str(result.id), ["none_known"], [])
    candidates.finish_run(conn, run_id)
    conn.commit()
    return GeoAdminImport(len(mine), problems, {mapping_name: run_id}, {mapping_name: stats})
