"""Acts, Bills, regulations and Gazette notices from registered documents into the legal schema (TSK-2A15C7E9908D).

Works on documents the section crawler registered and the semantics layer classified (kinds act, bill, gazette_notice, and
unclassified documents whose title or URL names an Act, Bill or regulations: the extractor refuses what is not one):
the preserved bytes are read by the `legal-pdf` extractor job (so the extraction result is the staging provenance), then
mapped to candidates. Stage A: instruments. Stage B (after A is promoted): provisions, only for instruments whose section
checks passed (numbers consecutive, body agrees with the arrangement of sections).

Rules: the same instrument seen at two URLs or on two sites is one candidate (the document with the most sections wins and
the others are listed in the report); an Act's status is `in_force` only as published (repeals and amendments are separate
instruments and are not applied here); a Bill is `draft`; nothing is linked that cannot be matched by code (the issuer of
an Act is Parliament; the issuer of anything else stays empty). Scope: an instrument's jurisdiction is the jurisdiction
of the document (Kenya); `legal.instruments` has no finer geography column, and a national instrument is not a place.
"""
from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass, field
from pathlib import Path

import psycopg
import yaml

from .. import candidates, jobs, pipeline
from ..extractors import legal_pdf
from ..files import LocalDirectoryStore
from ..structure.effective import substitute
from .budget_table import MAPPINGS as _BUDGET_MAPPINGS
from .members import slug

MAPPINGS = _BUDGET_MAPPINGS.parent / "legal"
KINDS = {"act": "act", "bill": "bill", "regulation": "regulation", "notice": "gazette-notice"}
CLASSIFICATIONS = {"legal/instrument-kind/act": "Act of Parliament", "legal/instrument-kind/bill": "Bill", "legal/instrument-kind/regulation": "Regulations, rules or order", "legal/instrument-kind/gazette-notice": "Kenya Gazette notice"}
DOCUMENT_KINDS = ("act", "bill", "gazette_notice")
REVIEW_KINDS = ("budget", "audit_report", "financial_statement")
PARLIAMENT = "ke/parliament"


def ensure_reference(conn: psycopg.Connection, jurisdiction: str) -> None:
    j = conn.execute("SELECT id FROM reference.jurisdictions WHERE code = %s", (jurisdiction,)).fetchone()
    if not j:
        raise LookupError(f"jurisdiction {jurisdiction} is not seeded")
    for code, label in CLASSIFICATIONS.items():
        if not conn.execute("SELECT 1 FROM reference.classifications WHERE code = %s AND jurisdiction_id = %s", (code, j["id"])).fetchone():
            conn.execute('INSERT INTO reference.classifications (code, scheme, label, jurisdiction_id, "order", is_current, created_at, updated_at, version) VALUES (%s, %s, %s, %s, 0, true, now(), now(), 1)', (code, code.rsplit("/", 1)[0], label, j["id"]))
    conn.commit()


@dataclass
class LegalImport:
    runs: dict = field(default_factory=dict)
    stats: dict = field(default_factory=dict)
    report: dict = field(default_factory=dict)


def instrument_records(document: dict, segments: list[tuple[str, dict]]) -> tuple[list[dict], list[dict], list[str]]:
    """(instrument records, provision records, notes) for one document's extraction segments."""
    notes: list[str] = []
    inst: list[dict] = []
    provs: list[dict] = []
    base = {"documentUrl": document["url"], "contentHash": document["hash"]}
    for kind, content in segments:
        if kind == "instrument":
            code = f"ke/{content['kind']}/{slug(content['title'])}"
            issuer = PARLIAMENT if content["kind"] == "act" else None
            inst.append({**base, "instrumentCode": code, "title": content["title"], "kindCode": f"legal/instrument-kind/{KINDS[content['kind']]}", "issuerCode": issuer, "status": "draft" if content["kind"] == "bill" else "in_force", "validFrom": content.get("commencement"), "summary": content.get("actNumber"), "sections": content.get("sectionCount", 0), "documentTitle": document["title"]})
        elif kind == "notice":
            issue = content["issue"]
            vol = f"{issue['volume']}-{issue['number']}" if issue.get("volume") else "unknown-issue"
            code = f"ke/gazette-notice/{slug(vol)}/{content['noticeNumber']}"
            title = f"Gazette Notice No. {content['noticeNumber']}" + (f" (Vol. {issue['volume']}, No. {issue['number']})" if issue.get("volume") else "")
            inst.append({**base, "instrumentCode": code, "title": title, "kindCode": "legal/instrument-kind/gazette-notice", "issuerCode": None, "status": "in_force", "validFrom": issue.get("date"), "summary": content["text"][:3900], "sections": 0, "documentTitle": document["title"]})
        elif kind == "provision":
            provs.append(content)
    if provs and inst:
        for order, p in enumerate(provs, 1):
            provs[order - 1] = {"instrumentCode": inst[0]["instrumentCode"], "provisionCode": f"{inst[0]['instrumentCode']}/s-{p['number'].lower()}", "provisionCitation": f"{inst[0]['title']}, s. {p['number']}", "heading": (p.get("heading") or None) and p["heading"][:300], "text": p["text"], "order": order * 10}
    return inst, provs, notes


def stage_legal(conn: psycopg.Connection, store: LocalDirectoryStore, stage: str, sites: list[str] | None = None, limit: int | None = None, jurisdiction: str = "ke") -> LegalImport:
    ensure_reference(conn, jurisdiction)
    handlers = {"extract": pipeline.extraction_handler(conn, store)}
    rows = conn.execute(
        """SELECT DISTINCT ON (d.id) d.id::text AS id, d.title, c.kind, k.id::text AS capture_id, k.file_version_id::text AS fv, k.retrieved_url AS url
             FROM source.documents d
             JOIN source.document_classifications c ON c.document_id = d.id
             JOIN source.captures k ON k.document_id = d.id AND k.file_version_id IS NOT NULL
        WHERE (c.kind = ANY(%s) OR (c.kind = 'unclassified' AND (d.title || ' ' || COALESCE(d.url, '')) ~* '(^|[^a-z])(act|bill|regulations|rules)([^a-z]|$)'))
          AND (%s::text[] IS NULL OR EXISTS (SELECT 1 FROM website.document_sightings s JOIN website.sites st ON st.id = s.site_id WHERE s.document_id = d.id AND st.code = ANY(%s)))
        ORDER BY d.id, c.classified_at DESC, k.retrieved_at""",
        (list(DOCUMENT_KINDS), sites, sites),
    ).fetchall()
    if limit:
        rows = rows[:limit]
    report: dict = {"documents": len(rows), "refused": [], "duplicates": [], "unreadable": []}
    best: dict[str, tuple[dict, dict, list[dict], str, str]] = {}
    for row in rows:
        data = store.get(row["fv"])
        document = {"id": row["id"], "title": row["title"], "url": row["url"], "hash": hashlib.sha256(data).hexdigest()}
        job_id, created = pipeline.enqueue_extraction(conn, row["fv"], "legal-pdf", legal_pdf.EXTRACTOR.version, row["capture_id"])
        if not created and conn.execute("SELECT status FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()["status"] != "succeeded":
            job_id, _ = pipeline.enqueue_extraction(conn, row["fv"], "legal-pdf", legal_pdf.EXTRACTOR.version, row["capture_id"], rerun=True)  # the extractor may have changed since the failed run
        conn.commit()
        while jobs.run_once(conn, handlers, worker="legal-import"):
            pass
        job = conn.execute("SELECT status, result_file_version_id::text AS fv, error FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
        if job["status"] != "succeeded":
            report["unreadable"].append({"url": row["url"], "why": f"extraction {job['status']}: {(job['error'] or '')[:150]}"})
            continue
        result = pipeline.load_result(store, job["fv"])
        for d in getattr(result, "diagnostics", None) or []:
            if d.level == "error":
                report["refused"].append({"url": row["url"], "why": d.message})
        insts, provs, _notes = instrument_records(document, [(json.loads(s.content)["type"], json.loads(s.content)) for s in result.segments])
        for inst in insts:
            mine = [p for p in provs if p["instrumentCode"] == inst["instrumentCode"]]
            current = best.get(inst["instrumentCode"])
            if current and len(current[2]) >= len(mine):
                report["duplicates"].append({"code": inst["instrumentCode"], "kept": current[0]["documentUrl"], "also_seen": inst["documentUrl"]})
                continue
            if current:
                report["duplicates"].append({"code": inst["instrumentCode"], "kept": inst["documentUrl"], "also_seen": current[0]["documentUrl"]})
            best[inst["instrumentCode"]] = (inst, document, mine, row["capture_id"], str(result.id))
    runs, stats = {}, {}
    mapping_name = {"A": "instrument", "B": "provision"}[stage]
    mapping = substitute(yaml.safe_load((MAPPINGS / f"{mapping_name}.yml").read_text()), {"jurisdiction": jurisdiction})
    first = next(iter(best.values()), None)
    run_id = candidates.create_run(conn, f"legal-documents/{jurisdiction}/{mapping_name}", "v1", first[3] if first else None, first[4] if first else None)
    total = candidates.CandidateStats()
    for code, (inst, _doc, provs, capture_id, result_id) in sorted(best.items()):
        records = [(code, inst)] if stage == "A" else [(p["provisionCode"], p) for p in provs]
        if not records:
            continue
        one = candidates.add_candidates(conn, run_id, mapping, records, result_id, [], [])
        for f in ("created", "unchanged", "superseding", "quarantined", "invalid"):
            setattr(total, f, getattr(total, f) + getattr(one, f))
        total.ids += one.ids
    candidates.finish_run(conn, run_id)
    conn.commit()
    runs[mapping_name], stats[mapping_name] = run_id, total
    report["instruments"] = {c: {"title": v[0]["title"], "sections": len(v[2]), "url": v[0]["documentUrl"]} for c, v in best.items()}
    return LegalImport(runs, stats, report)


def flag_figures_for_review(conn: psycopg.Connection, sites: list[str] | None = None) -> dict:
    """Budget, audit and financial-statement documents keep their extracted figures as facts with spans (semantics); each is
    flagged for a reviewer by an open `figures_review` gap on the document. Nothing is promoted from the figures."""
    rows = conn.execute(
        """SELECT DISTINCT ON (d.id) d.id::text AS id, c.kind, c.facts
             FROM source.documents d JOIN source.document_classifications c ON c.document_id = d.id AND c.kind = ANY(%s)
        WHERE (%s::text[] IS NULL OR EXISTS (SELECT 1 FROM website.document_sightings s JOIN website.sites st ON st.id = s.site_id WHERE s.document_id = d.id AND st.code = ANY(%s)))
        ORDER BY d.id, c.classified_at DESC""",
        (list(REVIEW_KINDS), sites, sites),
    ).fetchall()
    flagged = with_figures = 0
    for r in rows:
        facts = r["facts"] or []
        figures = [f for f in facts if (f.get("kind") if isinstance(f, dict) else None) in ("amount", "money", "kes_amount")]
        with_figures += bool(figures)
        flagged += conn.execute("""INSERT INTO engine.gaps (target_kind, target_id, field, reason, status, priority, refill_sources) VALUES ('source.documents', %s, 'figures_review', 'missing', 'open', 5, '[]')
            ON CONFLICT (target_kind, target_id, field) DO NOTHING""", (r["id"],)).rowcount
    conn.commit()
    return {"documents": len(rows), "newly_flagged": flagged, "with_amount_facts": with_figures}
