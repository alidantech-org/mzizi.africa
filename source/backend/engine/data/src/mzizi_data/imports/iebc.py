"""The IEBC commissioners (chairperson, vice chairperson and commissioners) from the commission's public page.

Stage B: offices and individuals; stage C: holders. The institution (`ke/electoral-commission`) is reference data.
No start dates are claimed because the page does not publish them.
"""
from __future__ import annotations

import json
from pathlib import Path

import psycopg
import yaml

from ..seedroot import MAPPINGS_ROOT
from .. import candidates, jobs, pipeline, register
from ..files import LocalDirectoryStore
from ..structure.effective import substitute
from .members import KEYS, MembersImport, slug

MAPPINGS = MAPPINGS_ROOT / "iebc"
STAGES = {"B": ["office", "individual"], "C": ["holder"]}
INSTITUTION = "ke/electoral-commission"


def enrich(record: dict) -> dict:
    role = record["role"]
    office = {"Chairperson": "chairperson", "Vice Chairperson": "vice-chairperson"}.get(role, f"commissioner/{slug(record['displayName'])}")
    return dict(record, institutionCode=INSTITUTION, personCode=f"ke/person/{slug(record['displayName'])}", officeCode=f"{INSTITUTION}/{office}", officeName=role if role != "Commissioner" else "Commissioner", officeDescription="Independent Electoral and Boundaries Commission", singleton=role != "Commissioner")


def import_iebc(conn: psycopg.Connection, store: LocalDirectoryStore, page: str | Path, meta: str | Path, stage: str = "B", jurisdiction: str = "ke") -> MembersImport:
    info = json.loads(Path(meta).read_text())
    publisher_id = register.ensure_publisher(conn, "ke-iebc", "Independent Electoral and Boundaries Commission", kind="institution", website_url="https://www.iebc.or.ke")
    row = conn.execute("SELECT id::text AS id FROM reference.jurisdictions WHERE code = %s", (jurisdiction,)).fetchone()
    spec = register.DocumentSpec(publisher_id, "IEBC Commissioners page", "official_website", url=info["url"], licence="Not confirmed (public page of the IEBC; reuse terms unassessed)", citation=f"IEBC, Commissioners, retrieved {info['retrieved_at'][:10]}.", jurisdiction_id=row["id"] if row else None)
    document_id, capture_id, ref = pipeline.ingest(conn, store, Path(page).read_bytes(), "iebc-commissioners.html", spec, url=info["url"], tool="gated-fetch", mime_type="text/html")
    job_id, _ = pipeline.enqueue_extraction(conn, ref.version_id, "iebc-commissioners", None, capture_id)
    conn.commit()
    while jobs.run_once(conn, {"extract": pipeline.extraction_handler(conn, store)}, worker="iebc-import"):
        pass
    job = conn.execute("SELECT status, result_file_version_id::text AS fv, error FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
    if job["status"] != "succeeded":
        raise RuntimeError(f"extraction did not succeed: {job['status']} {job['error']}")
    result = pipeline.load_result(store, job["fv"])
    records = [(s.key, enrich(json.loads(s.content))) for s in result.segments]
    runs, stats = {}, {}
    for name in STAGES[stage]:
        mapping = substitute(yaml.safe_load((MAPPINGS / f"{name}.yml").read_text()), {"jurisdiction": jurisdiction})
        run_id = candidates.create_run(conn, f"iebc/{jurisdiction}/commissioners/{name}", "v1", capture_id, str(result.id))
        stats[name] = candidates.add_candidates(conn, run_id, mapping, records, str(result.id), [], [])
        candidates.finish_run(conn, run_id)
        runs[name] = run_id
    conn.commit()
    return MembersImport(1, len(records), runs, stats)
