"""Hansard reports and order papers of Parliament as calendar events (TSK-2A15C7E9908D).

One `calendar.events` row per sitting document: a Hansard is a completed sitting, an order paper a planned one (the agenda, kept under its own
code so the two never overwrite each other). The event is national: its geography unit is the jurisdiction's root unit. The description carries the
public-office facts the extractor read (who presided, how many Members spoke, Bills named, division counts); the full speaker list stays in the
extraction result that is the candidate's provenance. A document the extractor refuses (no date, impossible division counts) is reported and not staged.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, field

import psycopg
import yaml

from .. import candidates, jobs, pipeline
from ..extractors import sitting_pdf
from ..files import LocalDirectoryStore
from ..structure.effective import substitute
from .budget_table import MAPPINGS as _BUDGET_MAPPINGS

MAPPINGS = _BUDGET_MAPPINGS.parent / "sitting"
TYPE_CODE = "calendar/event-type/parliamentary-sitting"
HOUSES = {"national-assembly": "National Assembly", "senate": "Senate"}


def ensure_reference(conn: psycopg.Connection, jurisdiction: str) -> None:
    j = conn.execute("SELECT id FROM reference.jurisdictions WHERE code = %s", (jurisdiction,)).fetchone()
    if not conn.execute("SELECT 1 FROM reference.classifications WHERE code = %s AND jurisdiction_id = %s", (TYPE_CODE, j["id"])).fetchone():
        conn.execute('INSERT INTO reference.classifications (code, scheme, label, jurisdiction_id, "order", is_current, created_at, updated_at, version) VALUES (%s, %s, %s, %s, 0, true, now(), now(), 1)', (TYPE_CODE, "calendar/event-type", "Parliamentary sitting", j["id"]))
    conn.commit()


def to_event(s: dict) -> dict:
    house = HOUSES[s["house"]]
    when = re.sub(r"[^0-9a-z]+", "", (s.get("startTime") or "unspecified").lower())
    hansard = s["documentKind"] == "hansard"
    code = f"ke/sitting/{s['house']}/{s['date']}/{when}" + ("" if hansard else "/order-paper")
    parts = [f"{house} {'sitting' if hansard else 'order paper'}" + (f", Hansard Vol. {s['volume']} No. {s['number']}" if hansard and s.get("volume") else "")]
    if s.get("presiding"):
        parts.append(f"Presiding: {s['presiding']['role']} {s['presiding']['name']}.")
    if s["speakers"]:
        top = ", ".join(f"{x['name']} ({x['area']}{', ' + x['party'] if x['party'] else ''})" for x in s["speakers"][:5])
        parts.append(f"{len(s['speakers'])} Members spoke; most contributions: {top}.")
    if s["bills"]:
        parts.append("Bills: " + "; ".join(s["bills"][:12]) + ".")
    if s["divisions"]:
        parts.append("Divisions: " + "; ".join(f"{d['ayes']} Ayes, {d['noes']} Noes" for d in s["divisions"]) + ".")
    return {"eventCode": code, "title": f"{house} {'sitting' if hansard else 'order paper'}, {s['date']}" + (f" ({s['startTime']})" if s.get("startTime") else ""), "description": " ".join(parts)[:3900], "typeCode": TYPE_CODE,
            "date": s["date"], "status": "completed" if hansard else "planned", "speakers": len(s["speakers"]), "bills": len(s["bills"]), "divisions": len(s["divisions"])}


@dataclass
class SittingImport:
    run: str | None = None
    stats: dict = field(default_factory=dict)
    report: dict = field(default_factory=dict)


def stage_sittings(conn: psycopg.Connection, store: LocalDirectoryStore, sites: list[str] | None = None, limit: int | None = None, jurisdiction: str = "ke") -> SittingImport:
    ensure_reference(conn, jurisdiction)
    handlers = {"extract": pipeline.extraction_handler(conn, store)}
    rows = conn.execute(
        """SELECT DISTINCT ON (d.id) d.id::text AS id, k.id::text AS capture_id, k.file_version_id::text AS fv, k.retrieved_url AS url
             FROM source.documents d JOIN source.document_classifications c ON c.document_id = d.id AND c.kind IN ('hansard', 'order_paper')
             JOIN source.captures k ON k.document_id = d.id AND k.file_version_id IS NOT NULL
        WHERE (%s::text[] IS NULL OR EXISTS (SELECT 1 FROM website.document_sightings s JOIN website.sites st ON st.id = s.site_id WHERE s.document_id = d.id AND st.code = ANY(%s)))
        ORDER BY d.id, c.classified_at DESC""", (sites, sites)).fetchall()
    report: dict = {"documents": len(rows), "refused": [], "duplicates": []}
    best: dict[str, tuple[dict, str, str]] = {}
    for row in rows[: limit or None]:
        job_id, created = pipeline.enqueue_extraction(conn, row["fv"], "sitting-pdf", sitting_pdf.EXTRACTOR.version, row["capture_id"])
        if not created and conn.execute("SELECT status FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()["status"] != "succeeded":
            job_id, _ = pipeline.enqueue_extraction(conn, row["fv"], "sitting-pdf", sitting_pdf.EXTRACTOR.version, row["capture_id"], rerun=True)
        conn.commit()
        while jobs.run_once(conn, handlers, worker="sitting-import"):
            pass
        job = conn.execute("SELECT status, result_file_version_id::text AS fv, error FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
        if job["status"] != "succeeded":
            report["refused"].append({"url": row["url"], "why": (job["error"] or job["status"])[:160]})
            continue
        result = pipeline.load_result(store, job["fv"])
        for seg in result.segments:
            event = to_event(json.loads(seg.content))
            if event["eventCode"] in best:
                report["duplicates"].append({"code": event["eventCode"], "url": row["url"]})
                continue
            best[event["eventCode"]] = (event, row["capture_id"], str(result.id))
    mapping = substitute(yaml.safe_load((MAPPINGS / "event.yml").read_text()), {"jurisdiction": jurisdiction})
    first = next(iter(best.values()), None)
    run_id = candidates.create_run(conn, f"sittings/{jurisdiction}/event", "v1", first[1] if first else None, first[2] if first else None)
    total = candidates.CandidateStats()
    for code, (event, _cap, result_id) in sorted(best.items()):
        one = candidates.add_candidates(conn, run_id, mapping, [(code, event)], result_id, [], [])
        for f in ("created", "unchanged", "superseding", "quarantined", "invalid"):
            setattr(total, f, getattr(total, f) + getattr(one, f))
    candidates.finish_run(conn, run_id)
    conn.commit()
    report["events"] = {c: {"title": v[0]["title"], "speakers": v[0]["speakers"], "bills": v[0]["bills"], "divisions": v[0]["divisions"]} for c, v in best.items()}
    return SittingImport(run_id, {f: getattr(total, f) for f in ("created", "unchanged", "invalid", "quarantined")}, report)
