"""Political Parties Fund allocations (ORPP distribution tables and the annual Gazette notice) as finance transfers.

Model (no schema invention beyond `finance.units.party_id`): the Fund is one finance unit administered by the Registrar
(`institution_id`); each party that received money is a finance unit at level `political-party`, linked to the party by
`party_id` when the party is known; each yearly amount is a `finance.transfers` row from the Fund unit to the party unit,
`approved` (the documents say money was distributed to qualifying parties, not when cash moved), `earmarked` (the Act
restricts its use), in the financial year's own row. Parties are linked, never guessed: by the party code of the notice
(equal to the register's certificate number), by the party's normalised name, by a former name the ORPP register states, or
by a one-letter spelling variant (flagged in the report); otherwise the unit stays unlinked and is reported.
Stage A: units. Stage B: transfers (units must be promoted first).
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass
from difflib import SequenceMatcher
from pathlib import Path

import psycopg
import yaml

from .. import candidates, jobs, pipeline, register
from ..files import LocalDirectoryStore
from ..structure.effective import substitute
from .budget_table import MAPPINGS as _BUDGET_MAPPINGS
from .members import slug

MAPPINGS = _BUDGET_MAPPINGS.parent / "ppf"
AUTHORITY = "ke/registrar-of-political-parties"
FUND_CODE = "ke/fund/political-parties-fund"
LEGAL_BASIS = "Political Parties Act (Cap. 7D), sections 23, 25 and 34(b); Political Parties (Funding) Regulations, 2019"
CLASSIFICATIONS = {
    "finance/unit-level/fund": "Fund",
    "finance/unit-level/political-party": "Political party",
    "finance/transfer-type/political-parties-fund-allocation": f"Political Parties Fund allocation to a party. Legal basis: {LEGAL_BASIS}",
}
LICENCE = "Not confirmed (public Registrar notice and distribution tables; reuse terms unassessed)"


def norm_name(value: str | None) -> str:
    text = re.sub(r"\(.*?\)", "", (value or "").lower())
    return re.sub(r"^the", "", re.sub(r"[^a-z0-9]", "", text))


def aliases_from(records: list[dict]) -> dict[str, str]:
    """Former names the register states ("Formerly Wiper Democratic Movement (WDM)"), mapped to the party code of the row that says so."""
    out: dict[str, str] = {}
    for r in records:
        code = r.get("partyCode")
        for former in re.findall(r"[Ff]ormerly\s+(.+?)(?=\s+[Ff]ormerly\s|$)", r.get("changes") or ""):
            out.setdefault(norm_name(former), code)
    return out


def link_party(row: dict, parties: list[dict], aliases: dict[str, str]) -> tuple[str | None, str]:
    """Returns (party code or None, basis)."""
    if row.get("partyCode"):
        wanted = int(row["partyCode"])
        hit = [p for p in parties if (p["registry_identifier"] or "").isdigit() and int(p["registry_identifier"]) == wanted]
        if len(hit) == 1:
            return hit[0]["code"], "party-code"
    key = norm_name(row["partyName"])
    by_name = [p for p in parties if norm_name(p["name"]) == key]
    if len(by_name) == 1:
        return by_name[0]["code"], "name"
    if key in aliases and aliases[key]:
        return aliases[key], "former-name"
    loose = {k.replace("kenya", ""): v for k, v in aliases.items() if v}
    if key.replace("kenya", "") in loose and len(key.replace("kenya", "")) > 8:
        return loose[key.replace("kenya", "")], "former-name"
    near = [(SequenceMatcher(None, key, norm_name(p["name"])).ratio(), p) for p in parties]
    near = sorted(near, key=lambda t: -t[0])
    if near and near[0][0] >= 0.96 and (len(near) < 2 or near[1][0] < 0.9):
        return near[0][1]["code"], "spelling-variant"
    return None, "unlinked"


def ensure_reference(conn: psycopg.Connection, jurisdiction: str) -> None:
    j = conn.execute("SELECT id FROM reference.jurisdictions WHERE code = %s", (jurisdiction,)).fetchone()
    if not j:
        raise LookupError(f"jurisdiction {jurisdiction} is not seeded")
    for code, label in CLASSIFICATIONS.items():
        scheme = code.rsplit("/", 1)[0]
        if not conn.execute("SELECT 1 FROM reference.classifications WHERE code = %s AND jurisdiction_id = %s", (code, j["id"])).fetchone():
            conn.execute(
                'INSERT INTO reference.classifications (code, scheme, label, jurisdiction_id, "order", is_current, created_at, updated_at, version) VALUES (%s, %s, %s, %s, 0, true, now(), now(), 1)',
                (code, scheme, label, j["id"]),
            )
    conn.commit()


@dataclass
class PpfImport:
    runs: dict
    stats: dict
    report: dict


def stage_ppf(conn: psycopg.Connection, store: LocalDirectoryStore, pdfs: list[str | Path], plan_path: str | Path | None, stage: str, report_path: str | Path, jurisdiction: str = "ke") -> PpfImport:
    ensure_reference(conn, jurisdiction)
    publisher_id = register.ensure_publisher(conn, "ke-orpp", "Office of the Registrar of Political Parties", kind="institution", website_url="https://orpp.or.ke")
    row = conn.execute("SELECT id::text AS id FROM reference.jurisdictions WHERE code = %s", (jurisdiction,)).fetchone()
    handlers = {"extract": pipeline.extraction_handler(conn, store)}
    parties = [dict(r) for r in conn.execute("SELECT code, name, abbreviation, registry_identifier FROM political.parties WHERE is_current").fetchall()]
    aliases: dict[str, str] = {}
    if plan_path and Path(plan_path).exists():
        plan = json.loads(Path(plan_path).read_text())
        code_of = {m["register"]: m["partyCode"] for m in plan["matches"]} | {n["name"]: n["code"] for n in plan["new"]}
        aliases = aliases_from([dict(r, partyCode=code_of.get(r["name"])) for r in plan["records"]])
    years = {r["code"]: r["starts_on"] for r in conn.execute("SELECT code, starts_on FROM finance.years").fetchall()}
    fund = {"unitCode": FUND_CODE, "unitName": "Political Parties Fund", "levelCode": "finance/unit-level/fund", "institutionCode": AUTHORITY, "partyCode": None}
    rows, per_doc, refused, seen = [], [], [], set()
    for pdf in sorted(Path(p) for p in pdfs):
        meta = json.loads(Path(str(pdf) + ".provenance.json").read_text())
        spec = register.DocumentSpec(publisher_id, f"Political Parties Fund: {pdf.name.split('-', 1)[1]}", "official_website", url=meta["url"], licence=LICENCE, citation=f"Office of the Registrar of Political Parties, Political Parties Fund distribution, retrieved {meta['retrieved_at'][:10]}. Legal basis: {LEGAL_BASIS}.", jurisdiction_id=row["id"] if row else None)
        document_id, capture_id, ref = pipeline.ingest(conn, store, pdf.read_bytes(), pdf.name.split("-", 1)[1], spec, url=meta["url"], tool="gated-fetch", mime_type="application/pdf", assessment_id=meta.get("assessment_id"))
        job_id, _ = pipeline.enqueue_extraction(conn, ref.version_id, "ppf-distribution", None, capture_id)
        conn.commit()
        while jobs.run_once(conn, handlers, worker="ppf-import"):
            pass
        job = conn.execute("SELECT status, result_file_version_id::text AS fv, error FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
        if job["status"] != "succeeded":
            raise RuntimeError(f"extraction of {meta['url']} did not succeed: {job['status']} {job['error']}")
        result = pipeline.load_result(store, job["fv"])
        refused += [d.message for d in (getattr(result, "diagnostics", None) or []) if d.level == "error"]
        per_doc.append((capture_id, str(result.id), [(s.key, json.loads(s.content)) for s in result.segments]))
    for capture_id, result_id, records in per_doc:
        for key, r in records:
            if r["fiscalYear"] not in years:
                refused.append(f"{r['fiscalYear']}: financial year not in finance.years")
                continue
            # a year published by more than one document is loaded once (the first document is its provenance)
            ident = (r["fiscalYear"], r["serial"], norm_name(r["partyName"]))
            if ident in seen:
                continue
            seen.add(ident)
            code, basis = link_party(r, parties, aliases)
            unit_code = f"ke/party-finance/{code.rsplit('/', 1)[-1]}" if code else f"ke/party-finance/unlinked/{slug(r['partyName'])}"
            rows.append((capture_id, result_id, key, dict(r, partyLink=code, linkBasis=basis, unitCode=unit_code, unitName=f"{r['partyName']} (political party finance)", levelCode="finance/unit-level/political-party", partyCode=code, institutionCode=None, fundUnitCode=FUND_CODE, fyStart=str(years[r["fiscalYear"]]), row=r["serial"])))
    runs, stats = {}, {}
    names = {"A": ["unit"], "B": ["transfer"]}[stage]
    for name in names:
        mapping = substitute(yaml.safe_load((MAPPINGS / f"{name}.yml").read_text()), {"jurisdiction": jurisdiction})
        run_id = candidates.create_run(conn, f"ppf/{jurisdiction}/{name}", "v1", per_doc[0][0], per_doc[0][1])
        total = candidates.CandidateStats()
        by_capture: dict[tuple, list] = {}
        done: set = set()
        if name == "unit":
            by_capture.setdefault((per_doc[0][0], per_doc[0][1]), []).append(("fund", dict(fund, page=0, row=0)))
            done.add(FUND_CODE)
        for capture_id, result_id, key, r in rows:
            if name == "unit":
                if r["unitCode"] in done:
                    continue
                done.add(r["unitCode"])
            by_capture.setdefault((capture_id, result_id), []).append((key, r))
        for (capture_id, result_id), subset in by_capture.items():
            one = candidates.add_candidates(conn, run_id, mapping, subset, result_id, [], [])
            for field in ("created", "unchanged", "superseding", "quarantined", "invalid"):
                setattr(total, field, getattr(total, field) + getattr(one, field))
            total.ids += one.ids
        candidates.finish_run(conn, run_id)
        runs[name], stats[name] = run_id, total
    conn.commit()
    linked = {}
    for _c, _r, _k, r in rows:
        linked.setdefault(r["linkBasis"], set()).add(r["partyName"])
    report = {
        "years": sorted({r["fiscalYear"] for _c, _r, _k, r in rows}), "rows": len(rows), "tablesRefused": refused,
        "linkedBy": {k: len(v) for k, v in linked.items()}, "unlinkedParties": sorted(linked.get("unlinked", [])), "spellingVariants": sorted(linked.get("spelling-variant", [])),
        "totalByYear": {fy: sum(float(r["amount"].replace(",", "")) for _c, _r, _k, r in rows if r["fiscalYear"] == fy) for fy in sorted({r["fiscalYear"] for _c, _r, _k, r in rows})},
        "reconciliation": "not possible: no national budget or Controller of Budget lines for the Fund are loaded; the documents state no totals",
        "runs": runs,
    }
    Path(report_path).parent.mkdir(parents=True, exist_ok=True)
    Path(report_path).write_text(json.dumps(report, indent=1))
    return PpfImport(runs, stats, report)
