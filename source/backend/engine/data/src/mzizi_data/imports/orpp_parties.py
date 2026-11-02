"""Political party register from the ORPP PDFs: match, stage new parties, update matched ones, contacts and symbols.

Flow (each step is idempotent):
  1. `stage_register` preserves the two register PDFs (raw artifacts and captures), extracts every row, merges a party that
     is in both registers (the full registration wins), matches rows to the existing party rows and stages candidates only for
     parties that match nothing. A report lists matches (with basis and score), new parties, probable matches left for a
     person, and conflicts. Contact fields never enter staging.
  2. The staged run goes through validate, review (agent account, rationale) and promote in the database engine.
  3. `apply_register` updates the matched rows in place (the party table has one row per code, so a changed record cannot be
     superseded by promotion), each as an `audit.decisions` row naming the account and recording the previous values, adds a
     source attribution to the register capture, records contacts as restricted contact points, and stores each party's symbol
     (cropped from the register page) as a document linked to the party.
A name alone never links a party (DEC-ENTITY-MATCHING): a match needs the same abbreviation, or the abbreviation of the
published ORPP row expanding the stored one ("FORD-K" and "FORD- KENYA"). Renamed parties (the register says
"Formerly ... (WDM)") are reported, not rewritten.
"""
from __future__ import annotations

import io
import json
import re
from dataclasses import dataclass, field
from difflib import SequenceMatcher
from pathlib import Path

import psycopg
import yaml

from .. import candidates, jobs, pipeline, register
from ..extractors import orpp_parties
from ..files import LocalDirectoryStore
from ..structure.effective import substitute
from .budget_table import MAPPINGS as _BUDGET_MAPPINGS
from .members import slug

MAPPINGS = _BUDGET_MAPPINGS.parent / "orpp"
AUTHORITY = "ke/registrar-of-political-parties"
LICENCE = "Not confirmed (public register published by the Office of the Registrar of Political Parties under Political Parties Act s.34(e); reuse terms unassessed)"
CONTACT_FIELDS = ("email", "postalAddress", "headOffice")


def norm(value: str | None) -> str:
    return re.sub(r"[^a-z0-9]", "", (value or "").lower())


def tidy(value: str | None, compact: bool = False) -> str | None:
    """Collapses whitespace and the stray spacing around a hyphen the PDF text carries ('Party- Kenya' becomes 'Party - Kenya',
    an abbreviation 'NAP- K' becomes 'NAP-K'); nothing else is rewritten."""
    if not value:
        return value
    text = re.sub(r"\s+", " ", value).strip()
    return re.sub(r"\s*([-–])\s*", r"\1", text) if compact else re.sub(r"\s+([-–])\s*|([-–])\s+", lambda m: " - " if (m.group(1) or m.group(2)) else m.group(0), text)


def merge_registers(full: list[dict], provisional: list[dict]) -> tuple[list[dict], list[dict]]:
    """A party in both registers is one party: the full record wins, the provisional date is kept as `provisionalDate`."""
    by_key = {(norm(r["abbreviation"]), norm(r["name"])): r for r in full}
    out = [dict(r) for r in full]
    merged = []
    for r in provisional:
        key = (norm(r["abbreviation"]), norm(r["name"]))
        twin = next((f for f in out if norm(f["abbreviation"]) == key[0] and SequenceMatcher(None, norm(f["name"]), key[1]).ratio() >= 0.9), None)
        if twin:
            twin["provisionalDate"] = r["issueDate"]
            twin["provisionalCode"] = r.get("partyCode")
            merged.append({"abbreviation": r["abbreviation"], "name": r["name"], "fullName": twin["name"]})
        else:
            out.append(dict(r))
    return out, merged


@dataclass
class Plan:
    matches: list[dict] = field(default_factory=list)
    new: list[dict] = field(default_factory=list)
    probable: list[dict] = field(default_factory=list)
    conflicts: list[dict] = field(default_factory=list)


def match_register(records: list[dict], existing: list[dict]) -> Plan:
    """existing: rows of political.parties (id, code, name, abbreviation). Returns the plan; applies nothing."""
    plan = Plan()
    key_of = lambda e: norm(e["abbreviation"] or e["name"])  # noqa: E731
    by_key: dict[str, list[dict]] = {}
    for e in existing:
        by_key.setdefault(key_of(e), []).append(e)
    abbreviations: dict[str, list[dict]] = {}
    for r in records:
        abbreviations.setdefault(norm(r["abbreviation"]), []).append(r)
    claimed: dict[str, dict] = {}
    for r in records:
        k = norm(r["abbreviation"])
        found = by_key.get(k, [])
        basis, score = "abbreviation", 1.0
        if not found:
            expansions = [e for e in existing if key_of(e).endswith("k") and k == key_of(e) + "enya"]
            found, basis, score = expansions, "abbreviation-expansion", 0.95
        if len(abbreviations[k]) > 1:
            plan.conflicts.append({"record": r["name"], "abbreviation": r["abbreviation"], "problem": "two different parties in the ORPP registers share this abbreviation; none staged or matched"})
            continue
        if len(found) > 1:
            plan.conflicts.append({"record": r["name"], "abbreviation": r["abbreviation"], "problem": f"matches more than one stored party: {[e['code'] for e in found]}"})
            continue
        if found:
            e = found[0]
            if e["code"] in claimed:
                plan.conflicts.append({"record": r["name"], "abbreviation": r["abbreviation"], "problem": f"{e['code']} is already matched to {claimed[e['code']]['name']}"})
                continue
            claimed[e["code"]] = r
            plan.matches.append({"partyCode": e["code"], "partyId": e["id"], "storedName": e["name"], "storedAbbreviation": e["abbreviation"], "basis": basis, "score": score, "record": r})
            continue
        plan.new.append(r)
    # a party the register itself says was renamed from a stored abbreviation ("Formerly Wiper Democratic Movement (WDM)")
    for e in existing:
        abbr = e["abbreviation"] or ""
        if e["code"] in claimed or not abbr:
            continue
        renamed = [r for r in plan.new if re.search(rf"\(\s*{re.escape(abbr)}\s*\)", r.get("changes") or "", re.I)]
        if len(renamed) == 1:
            r = renamed[0]
            plan.new.remove(r)
            claimed[e["code"]] = r
            plan.matches.append({"partyCode": e["code"], "partyId": e["id"], "storedName": e["name"], "storedAbbreviation": e["abbreviation"], "basis": "former-name", "score": 0.95, "record": r})
    # existing rows nothing matched: say why, so a person can decide (renames are named by the register itself)
    for e in existing:
        if e["code"] in claimed:
            continue
        abbr = e["abbreviation"] or ""
        renamed = [r for r in records if re.search(rf"\(\s*{re.escape(abbr)}\s*\)", r.get("changes") or "", re.I)] if abbr else []
        if renamed:
            plan.probable.append({"partyCode": e["code"], "stored": e["name"], "register": renamed[0]["name"], "reason": f"the register says '{renamed[0]['changes']}'; renamed party, not rewritten"})
        else:
            best = max(records, key=lambda r: SequenceMatcher(None, norm(e["name"]), norm(r["name"])).ratio())
            plan.conflicts.append({"stored": e["code"], "storedName": e["name"], "problem": "no ORPP row with this abbreviation" + (" (a coalition label mixed with a party, or a label that is not a registered party)" if (not abbr or abbr == "IND" or "|" in e["name"]) else ""), "nearest": best["name"]})
    return plan


def _row_id(conn, sql: str, params: tuple) -> str | None:
    row = conn.execute(sql, params).fetchone()
    return str(row["id"]) if row else None


@dataclass
class StageResult:
    plan: Plan
    merged: list[dict]
    run_id: str | None
    stats: object
    report: dict


def _ingest_register(conn, store, handlers, publisher_id, jurisdiction_id, path: Path, meta: dict, title: str) -> tuple[str, str, str, list[dict]]:
    spec = register.DocumentSpec(publisher_id, title, "official_website", url=meta["url"], licence=LICENCE, citation=f"Office of the Registrar of Political Parties, {title}, retrieved {meta['retrieved_at'][:10]}.", jurisdiction_id=jurisdiction_id)
    document_id, capture_id, ref = pipeline.ingest(conn, store, path.read_bytes(), path.name.split("-", 1)[1] if "-" in path.name else path.name, spec, url=meta["url"], tool="gated-fetch", mime_type="application/pdf", assessment_id=meta.get("assessment_id"))
    job_id, _ = pipeline.enqueue_extraction(conn, ref.version_id, "orpp-parties", None, capture_id)
    conn.commit()
    while jobs.run_once(conn, handlers, worker="orpp-import"):
        pass
    job = conn.execute("SELECT status, result_file_version_id::text AS fv, error FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
    if job["status"] != "succeeded":
        raise RuntimeError(f"extraction of {meta['url']} did not succeed: {job['status']} {job['error']}")
    result = pipeline.load_result(store, job["fv"])
    records = []
    for segment in result.segments:
        record = json.loads(segment.content)
        record.update(_capture=capture_id, _result=str(result.id), _document=document_id, _key=segment.key)
        records.append(record)
    return document_id, capture_id, str(result.id), records


def stage_register(conn: psycopg.Connection, store: LocalDirectoryStore, full_pdf: str | Path, provisional_pdf: str | Path, plan_path: str | Path, jurisdiction: str = "ke") -> StageResult:
    publisher_id = register.ensure_publisher(conn, "ke-orpp", "Office of the Registrar of Political Parties", kind="institution", website_url="https://orpp.or.ke")
    row = conn.execute("SELECT id::text AS id FROM reference.jurisdictions WHERE code = %s", (jurisdiction,)).fetchone()
    handlers = {"extract": pipeline.extraction_handler(conn, store)}
    docs = {}
    full, provisional = [], []
    for kind, pdf, title in (("full", full_pdf, "Fully registered political parties (ORPP register)"), ("provisional", provisional_pdf, "Provisionally registered political parties (ORPP register)")):
        path = Path(pdf)
        meta = json.loads(Path(str(path) + ".provenance.json").read_text())
        document_id, capture_id, result_id, records = _ingest_register(conn, store, handlers, publisher_id, row["id"] if row else None, path, meta, title)
        docs[kind] = {"document": document_id, "capture": capture_id, "result": result_id, "pdf": str(path), "url": meta["url"]}
        (full if kind == "full" else provisional).extend(records)
    for r in full + provisional:
        for name in ("name", "slogan", "colours", "symbolDescription", "changes"):
            r[name] = tidy(r.get(name))
        r["abbreviation"] = tidy(r.get("abbreviation"), compact=True)
    merged_records, merged = merge_registers(full, provisional)
    existing = [dict(r) for r in conn.execute("SELECT id::text AS id, code, name, abbreviation FROM political.parties WHERE is_current ORDER BY code").fetchall()]
    plan = match_register(merged_records, existing)
    taken = {e["code"] for e in existing}
    for r in plan.new + [m["record"] for m in plan.matches]:
        r["registryIdentifier"] = r.get("certificateNumber") or r.get("partyCode")
        r["authorityCode"] = AUTHORITY
    for r in plan.new:
        base = f"ke/party/{slug(r['abbreviation'] or r['name'])}"
        r["partyCode"] = base if base not in taken else f"{base}-{slug(r['name'])}"
        taken.add(r["partyCode"])
    # staging: new parties only; contact fields never leave the extraction result
    run_id, stats = None, None
    if plan.new:
        mapping = substitute(yaml.safe_load((MAPPINGS / "party.yml").read_text()), {"jurisdiction": jurisdiction})
        first = plan.new[0]
        run_id = candidates.create_run(conn, f"orpp/{jurisdiction}/parties/party", "v1", first["_capture"], first["_result"])
        stats = candidates.CandidateStats()
        for source in {r["_capture"] for r in plan.new}:
            subset = [(r["_key"], {k: v for k, v in r.items() if k not in CONTACT_FIELDS and not k.startswith("_")} | {"row": r["serial"]}) for r in plan.new if r["_capture"] == source]
            one = candidates.add_candidates(conn, run_id, mapping, subset, next(r["_result"] for r in plan.new if r["_capture"] == source), [], [])
            for name in ("created", "unchanged", "superseding", "quarantined", "invalid"):
                setattr(stats, name, getattr(stats, name) + getattr(one, name))
            stats.ids += one.ids
        candidates.finish_run(conn, run_id)
    conn.commit()
    report = {
        "documents": docs,
        "counts": {"full": len(full), "provisional": len(provisional), "merged": len(merged), "parties": len(merged_records), "matched": len(plan.matches), "new": len(plan.new), "probable": len(plan.probable), "conflicts": len(plan.conflicts)},
        "merged": merged,
        "matches": [{k: v for k, v in m.items() if k != "record"} | {"register": m["record"]["name"], "registerAbbreviation": m["record"]["abbreviation"]} for m in plan.matches],
        "new": [{"code": r["partyCode"], "name": r["name"], "abbreviation": r["abbreviation"], "status": r["status"]} for r in plan.new],
        "probable": plan.probable, "conflicts": plan.conflicts, "run": run_id,
        "records": merged_records,
    }
    Path(plan_path).parent.mkdir(parents=True, exist_ok=True)
    Path(plan_path).write_text(json.dumps(report, indent=1, ensure_ascii=False))
    return StageResult(plan, merged, run_id, stats, report)


# ---------------------------------------------------------------------------------------------------- step 3

def crop_symbols(pdf_path: str | Path, boxes: dict[int, list[tuple[str, list[float]]]], scale: float = 4.0) -> dict[str, bytes]:
    """Renders each page once and crops each party's symbol box (PDF points) to a PNG. pypdfium2 and Pillow only (no AGPL code)."""
    import pypdfium2 as pdfium

    out: dict[str, bytes] = {}
    document = pdfium.PdfDocument(str(pdf_path))
    for page_number, items in boxes.items():
        image = document[page_number - 1].render(scale=scale).to_pil().convert("RGB")
        for key, (x0, y0, x1, y1) in items:
            crop = image.crop((int(x0 * scale) - 2, int(y0 * scale) - 2, int(x1 * scale) + 2, int(y1 * scale) + 2))
            buffer = io.BytesIO()
            crop.save(buffer, "PNG")
            out[key] = buffer.getvalue()
    return out


def apply_register(conn: psycopg.Connection, store: LocalDirectoryStore, plan_path: str | Path, actor_id: str, rationale: str) -> dict:
    """Applies a staged plan after the new parties were promoted. Returns counts."""
    report = json.loads(Path(plan_path).read_text())
    docs = report["documents"]
    stats = {"updated": 0, "unchanged": 0, "attributed": 0, "contacts": 0, "symbols": 0, "symbols_skipped": 0, "unlinked": 0}
    method_id = register.ensure_method(conn, "extracted", "ORPP register table reader", "mzizi-data orpp-parties", "0.1.0")
    authority = _row_id(conn, "SELECT id FROM governance.institutions WHERE code = %s AND is_current", (AUTHORITY,))
    allowed = conn.execute("SELECT 1 FROM access.account_permissions WHERE account_id = %s AND permission_code = 'review.decide' LIMIT 1", (actor_id,)).fetchone()
    if not allowed:
        raise PermissionError("the account does not hold review.decide")
    publisher_id = register.ensure_publisher(conn, "ke-orpp", "Office of the Registrar of Political Parties", kind="institution", website_url="https://orpp.or.ke")
    jurisdiction = conn.execute("SELECT id::text AS id FROM reference.jurisdictions WHERE code = 'ke'").fetchone()
    by_code = {r["partyCode"]: r for r in report["records"] if r.get("partyCode")}
    matched = {m["partyCode"]: next(r for r in report["records"] if r["name"] == m["register"]) for m in report["matches"]}
    targets: dict[str, dict] = {}
    for code, record in list(matched.items()) + [(c, r) for c, r in by_code.items() if c not in matched]:
        row = conn.execute("SELECT id::text AS id, code, name, abbreviation, status::text AS status, registry_identifier, registry_authority_id::text AS auth, valid_from FROM political.parties WHERE code = %s AND is_current", (code,)).fetchone()
        if not row:
            stats["unlinked"] += 1  # a new party that was not promoted (yet); reported, not guessed
            continue
        targets[code] = {"row": row, "record": record, "matched": code in matched}
    capture_of = lambda record: docs[record["register"]]["capture"]  # noqa: E731
    document_of = lambda record: docs[record["register"]]["document"]  # noqa: E731
    for code, t in targets.items():
        row, record = t["row"], t["record"]
        if t["matched"]:
            before = {"name": row["name"], "abbreviation": row["abbreviation"], "status": row["status"], "registry_identifier": row["registry_identifier"], "registry_authority_id": row["auth"], "valid_from": str(row["valid_from"]) if row["valid_from"] else None}
            after = {"name": record["name"], "abbreviation": record["abbreviation"], "status": record["status"], "registry_identifier": record["registryIdentifier"], "registry_authority_id": authority, "valid_from": record["issueDate"]}
            if before != after:
                conn.execute(
                    """UPDATE political.parties SET name = %s, abbreviation = %s, status = %s::political.parties_status_enum, registry_identifier = %s, registry_authority_id = %s,
                         valid_from = %s, valid_from_precision = CASE WHEN %s::date IS NULL THEN valid_from_precision ELSE 'exact'::political.parties_valid_from_precision_enum END, version = version + 1, updated_at = now() WHERE id = %s""",
                    (after["name"], after["abbreviation"], after["status"], after["registry_identifier"], after["registry_authority_id"], after["valid_from"], after["valid_from"], row["id"]),
                )
                conn.execute(
                    "INSERT INTO audit.decisions (target_kind, target_id, decision, proposed_state, rationale, reviewer_id, created_at, updated_at, version) VALUES ('political.parties', %s, 'approve', 'unverified', %s, %s, now(), now(), 1)",
                    (row["id"], f"{rationale} Matched on {next(m for m in report['matches'] if m['partyCode'] == code)['basis']}. Previous values: {json.dumps(before)}", actor_id),
                )
                stats["updated"] += 1
            else:
                stats["unchanged"] += 1
        if not conn.execute("SELECT 1 FROM source.attributions WHERE target_kind = 'political.parties' AND target_id = %s AND capture_id = %s AND relation = 'supports'", (row["id"], capture_of(record))).fetchone():
            conn.execute(
                """INSERT INTO source.attributions (document_id, capture_id, method_id, target_kind, target_id, relation, locator, confidence, attributed_by, created_at, updated_at, version)
                   VALUES (%s, %s, %s, 'political.parties', %s, 'supports', %s, 1, %s, now(), now(), 1)""",
                (document_of(record), capture_of(record), method_id, row["id"], json.dumps({"page": record["page"], "row": record["serial"]}), actor_id),
            )
            stats["attributed"] += 1
        for channel, label, value in (("email", "Party email (provisional register)", record.get("email")), ("postal", "Postal address (ORPP register)", record.get("postalAddress")), ("postal", "Head office (ORPP register)", record.get("headOffice"))):
            if value and not conn.execute("SELECT 1 FROM contact.points WHERE scope_kind = 'political.parties' AND scope_id = %s AND channel = %s::contact.points_channel_enum AND value = %s", (row["id"], channel, value[:500])).fetchone():
                conn.execute(
                    "INSERT INTO contact.points (scope_kind, scope_id, channel, label, value, visibility, is_current, created_at, updated_at, version) VALUES ('political.parties', %s, %s::contact.points_channel_enum, %s, %s, 'restricted', true, now(), now(), 1)",
                    (row["id"], channel, label, value[:500]),
                )
                stats["contacts"] += 1
    conn.commit()
    # symbols: crop once per page of each register that has boxes
    for kind in ("full", "provisional"):
        pages: dict[int, list[tuple[str, list[float]]]] = {}
        for code, t in targets.items():
            record = t["record"]
            if record["register"] == kind and record.get("symbolBox"):
                title = f"Symbol of {record['name']} (ORPP register of political parties)"
                if conn.execute("SELECT 1 FROM source.documents WHERE publisher_id = %s AND title = %s", (publisher_id, title)).fetchone():
                    stats["symbols_skipped"] += 1
                    continue
                pages.setdefault(record["page"], []).append((code, record["symbolBox"]))
        if not pages:
            continue
        crops = crop_symbols(docs[kind]["pdf"], pages)
        for code, png in crops.items():
            t = targets[code]
            record = t["record"]
            title = f"Symbol of {record['name']} (ORPP register of political parties)"
            spec = register.DocumentSpec(publisher_id, title, "official_website", url=docs[kind]["url"], licence="Not confirmed (the party symbol is the party's registered mark, published in the ORPP register; reuse terms unassessed)", citation=f"ORPP register of political parties, page {record['page']} row {record['serial']}.", jurisdiction_id=jurisdiction["id"] if jurisdiction else None)
            document_id, capture_id, _ref = pipeline.ingest(conn, store, png, f"symbol-{code.rsplit('/', 1)[-1]}.png", spec, url=docs[kind]["url"], tool="orpp-register-crop", mime_type="image/png")
            conn.execute(
                """INSERT INTO source.attributions (document_id, capture_id, target_kind, target_id, target_field, relation, method_id, locator, confidence, attributed_by, created_at, updated_at, version)
                   VALUES (%s, %s, 'political.parties', %s, 'symbol', 'derived_from', %s, %s, 1, %s, now(), now(), 1)""",
                (document_id, capture_id, t["row"]["id"], method_id, json.dumps({"page": record["page"], "box": record["symbolBox"]}), actor_id),
            )
            conn.commit()
            stats["symbols"] += 1
    return stats
