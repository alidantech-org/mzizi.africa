"""Import of a geoBoundaries release (admin boundaries as GeoJSON) into staging candidates.

Steps: preserve the downloaded files, register the document and capture (licence taken from the
dataset's own metadata and flagged as unconfirmed), extract features, and map them to unit and
boundary candidates through YAML mappings. Nothing canonical is written; promotion belongs to the
database engine. Units are promoted before boundaries because boundaries reference units by code.
"""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path

import psycopg
import yaml

from .. import candidates, jobs, pipeline, register
from ..files import LocalDirectoryStore

MAPPINGS = Path(__file__).resolve().parents[3] / "mappings" / "geoboundaries"
CITATION = "Runfola, D. et al. (2020) geoBoundaries: A global database of political administrative boundaries. PLoS ONE 15(4): e0231866."


@dataclass
class LevelImport:
    level: str
    document_id: str
    capture_id: str
    file_version_id: str
    result_id: str
    unit_run: str
    boundary_run: str
    units: candidates.CandidateStats
    boundaries: candidates.CandidateStats


@dataclass
class ImportResult:
    levels: list[LevelImport] = field(default_factory=list)


def load_mapping(name: str) -> dict:
    return yaml.safe_load((MAPPINGS / f"{name}.yml").read_text())


def segment_records(result) -> list[tuple[str, dict]]:
    """One record per feature segment: the properties, the name and the geometry as GeoJSON text."""
    records = []
    for segment in result.segments:
        content = json.loads(segment.content)
        records.append((segment.key, {**content["properties"], "name": content.get("name"), "geometry": json.dumps(content["geometry"], separators=(",", ":"))}))
    return records


def import_level(conn: psycopg.Connection, store: LocalDirectoryStore, publisher_id: str, geojson: bytes, metadata: dict, level: str, jurisdiction_id: str | None = None) -> LevelImport:
    iso3 = metadata["boundaryISO"]
    built = datetime.strptime(metadata["buildDate"], "%b %d, %Y").date() if metadata.get("buildDate") else None
    spec = register.DocumentSpec(
        publisher_id, f"geoBoundaries gbOpen {iso3} {level} (simplified)", "dataset", url=metadata.get("simplifiedGeometryGeoJSON"),
        licence=f"{metadata['boundaryLicense']} (from geoBoundaries metadata; not confirmed by a human reviewer)", citation=f"{CITATION} Boundary source: {metadata.get('boundarySource', 'unknown')}.",
        published_on=built, published_on_precision="exact" if built else None, jurisdiction_id=jurisdiction_id,
    )
    document_id, capture_id, ref = pipeline.ingest(conn, store, geojson, f"geoBoundaries-{iso3}-{level}-simplified.geojson", spec, tool="manual-download", mime_type="application/geo+json")
    job_id, _ = pipeline.enqueue_extraction(conn, ref.version_id, "geojson", "admin-boundaries", capture_id)
    conn.commit()
    handlers = {"extract": pipeline.extraction_handler(conn, store)}
    while jobs.run_once(conn, handlers, worker="geoboundaries-import"):
        pass
    row = conn.execute("SELECT status, result, result_file_version_id::text AS fv, error FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
    if row["status"] != "succeeded":
        raise RuntimeError(f"extraction of {level} did not succeed: {row['status']} {row['error']}")
    result = pipeline.load_result(store, row["fv"])
    records = segment_records(result)
    kind = "adm0" if level == "ADM0" else "adm1"
    runs, stats = {}, {}
    for what in ("unit", "boundary"):
        mapping = load_mapping(f"{what}-{kind}")
        run_id = candidates.create_run(conn, f"geoboundaries/{iso3}/{level}/{what}", "v1", capture_id, str(result.id))
        stats[what] = candidates.add_candidates(conn, run_id, mapping, records, str(result.id), ["none_known"], [])
        candidates.finish_run(conn, run_id)
        runs[what] = run_id
    conn.commit()
    return LevelImport(level, document_id, capture_id, ref.version_id, str(result.id), runs["unit"], runs["boundary"], stats["unit"], stats["boundary"])


def import_directory(conn: psycopg.Connection, store: LocalDirectoryStore, directory: str | Path, iso3: str = "KEN", jurisdiction_code: str = "ke") -> ImportResult:
    """Imports ADM0 then ADM1 files named KEN-ADM0-simplified.geojson with a KEN-ADM0-metadata.json beside each."""
    directory = Path(directory)
    jurisdiction = conn.execute("SELECT id::text AS id FROM reference.jurisdictions WHERE code = %s", (jurisdiction_code,)).fetchone()
    publisher_id = register.ensure_publisher(conn, "geoboundaries", "geoBoundaries (William & Mary geoLab)", kind="repository", website_url="https://www.geoboundaries.org")
    out = ImportResult()
    for level in ("ADM0", "ADM1"):
        metadata = json.loads((directory / f"{iso3}-{level}-metadata.json").read_text())
        data = (directory / f"{iso3}-{level}-simplified.geojson").read_bytes()
        out.levels.append(import_level(conn, store, publisher_id, data, metadata, level, jurisdiction["id"] if jurisdiction else None))
    return out
