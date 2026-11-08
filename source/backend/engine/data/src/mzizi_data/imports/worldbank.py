"""World Bank national population series (SP.POP.TOTL) into statistical candidates.

One category, one indicator, one period per year (shared by all countries), one dataset per country
and one observation per country and year. The mappings are country-neutral; the jurisdiction code
is a variable. Promote in this order: category, indicator, periods, dataset, observations, after the
country's national unit exists.
"""
from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

import psycopg
import yaml

from ..seedroot import MAPPINGS_ROOT
from .. import candidates, jobs, pipeline, register
from ..files import LocalDirectoryStore
from ..structure.effective import substitute
from .geoboundaries import COUNTRIES

MAPPINGS = MAPPINGS_ROOT / "worldbank"
ORDER = ["category", "indicator", "period", "dataset", "observation"]


@dataclass
class PopulationImport:
    iso3: str
    document_id: str
    capture_id: str
    result_id: str
    runs: dict[str, str]
    stats: dict[str, candidates.CandidateStats]


def import_population(conn: psycopg.Connection, store: LocalDirectoryStore, path: str | Path, iso3: str) -> PopulationImport:
    country = COUNTRIES[iso3]
    raw = Path(path).read_bytes()
    meta = json.loads(raw)[0]
    publisher_id = register.ensure_publisher(conn, "world-bank", "The World Bank", kind="institution", website_url="https://data.worldbank.org")
    jurisdiction = conn.execute("SELECT id::text AS id FROM reference.jurisdictions WHERE code = %s", (country.jurisdiction,)).fetchone()
    spec = register.DocumentSpec(
        publisher_id, f"World Bank SP.POP.TOTL {iso3} (population, total)", "dataset",
        url=f"https://api.worldbank.org/v2/country/{iso3}/indicator/SP.POP.TOTL?format=json&per_page=100",
        licence="CC BY 4.0 (World Bank Open Data terms; the API response carries no licence field; not confirmed by a human reviewer)",
        citation=f"World Bank, Population, total (SP.POP.TOTL), {iso3}; source data compiled from national statistical offices and the UN Population Division. Last updated {meta.get('lastupdated')}.",
        jurisdiction_id=jurisdiction["id"] if jurisdiction else None,
    )
    document_id, capture_id, ref = pipeline.ingest(conn, store, raw, f"worldbank-SP.POP.TOTL-{iso3}.json", spec, tool="manual-download", mime_type="application/json")
    job_id, _ = pipeline.enqueue_extraction(conn, ref.version_id, "worldbank-indicator", "population", capture_id)
    conn.commit()
    handlers = {"extract": pipeline.extraction_handler(conn, store)}
    while jobs.run_once(conn, handlers, worker="worldbank-import"):
        pass
    row = conn.execute("SELECT status, result_file_version_id::text AS fv, error FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
    if row["status"] != "succeeded":
        raise RuntimeError(f"extraction did not succeed: {row['status']} {row['error']}")
    result = pipeline.load_result(store, row["fv"])
    records = [(s.key, json.loads(s.content)) for s in result.segments]
    single = [records[0]]
    runs, stats = {}, {}
    for name in ORDER:
        mapping = substitute(yaml.safe_load((MAPPINGS / f"{name}.yml").read_text()), {"jurisdiction": country.jurisdiction})
        run_id = candidates.create_run(conn, f"worldbank/SP.POP.TOTL/{iso3}/{name}", "v1", capture_id, str(result.id))
        stats[name] = candidates.add_candidates(conn, run_id, mapping, records if name in ("period", "observation") else single, str(result.id), ["none_known"], [])
        candidates.finish_run(conn, run_id)
        runs[name] = run_id
    conn.commit()
    return PopulationImport(iso3, document_id, capture_id, str(result.id), runs, stats)
