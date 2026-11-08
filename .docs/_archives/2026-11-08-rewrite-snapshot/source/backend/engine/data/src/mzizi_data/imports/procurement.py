"""Public procurement from tenders.go.ke: procuring entities, suppliers, tenders and contracts.

Sources: the procuring-entity directory pages (`/api/pe/all-pe`, county and published contact data) and the OCDS 1.1 bulk
files per financial year (buyers, tenders, awards, contracts, suppliers). Procuring entities become finance units (the
issuer of tenders) and organisations (so schools, hospitals and agencies can be found and placed), each linked to the
county's geography unit; suppliers become organisations keyed by their portal id. Published contact details of public
procuring entities are kept as identifiers; suppliers' contact points stay only in the preserved raw packages.

Stages (each promoted before the next): A units and entities, B identifiers, places and contact points, C tenders and occupancies (the occupancy refers to its promoted place), D contracts.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path

import psycopg
import yaml

from ..seedroot import MAPPINGS_ROOT
from .. import candidates, jobs, pipeline, register
from ..files import LocalDirectoryStore
from ..geo_link import GeoResolver
from ..structure.effective import substitute
from .members import slug

MAPPINGS = MAPPINGS_ROOT / "procurement"
STAGES = {"A": ["pe_unit", "entity"], "B": ["identifier", "place", "contact"], "C": ["tender", "occupancy"], "D": ["contract"]}
ROLE_BY_TYPE = {"school": "school-campus", "tertiary-institution": "school-campus", "hospital": "service-site"}
METHODS = {"open": "open", "selective": "restricted", "direct": "direct"}
KINDS = {"goods", "works", "services"}
TYPE_RULES = [
    (r"\b(UNIVERSITY|COLLEGE|POLYTECHNIC|TVET|TECHNICAL AND VOCATIONAL|INSTITUTE OF TECHNOLOGY)\b", "tertiary-institution"),
    (r"\b(SCHOOL|ACADEMY|PRIMARY|SECONDARY|SEC\.?)\b", "school"),
    (r"\b(HOSPITAL|HEALTH CENTRE|HEALTH CENTER|DISPENSARY|CLINIC|MEDICAL|SUB.?COUNTY HEALTH)\b", "hospital"),
    (r"\b(COUNTY GOVERNMENT|COUNTY ASSEMBLY|MUNICIPALITY|CITY BOARD)\b", "county-government"),
    (r"\b(MINISTRY|STATE DEPARTMENT|DEPARTMENT)\b", "ministry"),
    (r"\b(AUTHORITY|COMMISSION|CORPORATION|BOARD|COUNCIL|FUND|SERVICE|AGENCY|BUREAU|KENYA [A-Z]+)\b", "state-corporation"),
]


def entity_type(name: str) -> str:
    upper = name.upper()
    for pattern, kind in TYPE_RULES:
        if re.search(pattern, upper):
            return kind
    return "other-public-entity"


def cref(code: str, jurisdiction: str) -> dict:
    return {"$ref": {"kind": "reference.classifications", "where": {"code": code, "jurisdictionId": {"$ref": {"kind": "reference.jurisdictions", "where": {"code": jurisdiction}}}}}}


_CONTACT = re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+|(?<!\d)(?:\+254|254|0)[17]\d{8}(?!\d)")


def _fit(text, limit):
    """Titles longer than the column are cut with an ellipsis; the raw package keeps the full title."""
    if text and len(text) > limit:
        return text[: limit - 1].rstrip() + "\u2026"
    return text


def _iso_date(value):
    """Only a real calendar date; the portal sometimes publishes placeholders such as -0001-11-3."""
    if not value:
        return value
    from datetime import date
    try:
        return date.fromisoformat(str(value)[:10]).isoformat() if re.match(r"^\d{4}-\d\d-\d\d", str(value)) else None
    except ValueError:
        return None


def _scrub_contact(text):
    """Directory address fields sometimes hold an email or phone number; that is contact data, not an address."""
    if not text:
        return text
    cleaned = _CONTACT.sub("", str(text)).strip(" ,;:-")
    return cleaned or None


@dataclass
class ProcurementImport:
    sources: int
    runs: dict[str, str]
    stats: dict[str, candidates.CandidateStats]
    notes: list[str]


def _ingest(conn, store, handlers, publisher_id, jurisdiction_id, path: Path, meta: dict, extractor: str, profile: str | None, title: str):
    spec = register.DocumentSpec(publisher_id, title, "dataset", url=meta["url"], licence="Not confirmed (public procurement data published by the Public Procurement Regulatory Authority; reuse terms unassessed)", citation=f"Public Procurement Information Portal (tenders.go.ke), {title}, retrieved {meta['retrieved_at'][:10]}.", jurisdiction_id=jurisdiction_id)
    document_id, capture_id, ref = pipeline.ingest(conn, store, path.read_bytes(), path.name, spec, url=meta["url"], tool="gated-fetch", mime_type="application/json")
    job_id, _ = pipeline.enqueue_extraction(conn, ref.version_id, extractor, profile, capture_id)
    conn.commit()
    while jobs.run_once(conn, handlers, worker="procurement-import"):
        pass
    job = conn.execute("SELECT status, result_file_version_id::text AS fv, error FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
    if job["status"] != "succeeded":
        raise RuntimeError(f"extraction of {title} did not succeed: {job['status']} {job['error']}")
    return capture_id, pipeline.load_result(store, job["fv"])


def import_procurement(conn: psycopg.Connection, store: LocalDirectoryStore, pe_dir: str | Path, ocds_dir: str | Path, stage: str, years: list[str] | None = None, jurisdiction: str = "ke") -> ProcurementImport:
    geo = GeoResolver(conn, jurisdiction)
    publisher_id = register.ensure_publisher(conn, "ke-ppra", "Public Procurement Regulatory Authority", kind="institution", website_url="https://tenders.go.ke")
    row = conn.execute("SELECT id::text AS id FROM reference.jurisdictions WHERE code = %s", (jurisdiction,)).fetchone()
    handlers = {"extract": pipeline.extraction_handler(conn, store)}
    notes: list[str] = []
    sources: list[tuple[str, str, str, dict]] = []  # (kind, capture id, result id, ...)
    pes: dict[str, dict] = {}
    level_ref = cref("finance/unit-level/procuring-entity", jurisdiction)
    first = None

    contacts: dict[str, dict] = {}

    def entity_record(pe_id, name, county, city, address, phone, email, pin, website) -> dict:
        """The record the model uses. Published contact data is kept apart (`contacts`) and only reaches the identifier stage."""
        kind = entity_type(name)
        address = _scrub_contact(address)
        if phone or email or pin:
            contacts[str(pe_id)] = {"contact-phone": phone, "contact-email": email, "kra-pin": pin}
        return {"id": pe_id, "name": name, "unitCode": f"ke/pe/{pe_id}", "entityCode": f"ke/pe/{pe_id}", "levelRef": level_ref, "typeRef": cref(f"organization/entity-type/{kind}", jurisdiction), "geoUnitCode": geo.county(county), "addressText": ", ".join(x for x in (address, city, county) if x) or None}

    for meta_path in sorted(Path(pe_dir).glob("*.provenance.json")):
        meta = json.loads(meta_path.read_text())
        path = Path(str(meta_path)[: -len(".provenance.json")])
        capture_id, result = _ingest(conn, store, handlers, publisher_id, row["id"] if row else None, path, meta, "tenders-pe", None, f"tenders.go.ke procuring entities, {meta['url'].rsplit('?', 1)[-1]}")
        first = first or (capture_id, str(result.id))
        for segment in result.segments:
            c = json.loads(segment.content)
            pes[str(c["id"])] = dict(entity_record(c["id"], c["name"], c["county"], c["city"], c["address"], c["phone"], c["email"], c["pin"], c["website"]), _capture=capture_id, _result=str(result.id), _key=segment.key)
    tenders: dict[str, tuple] = {}
    contracts: dict[str, tuple] = {}
    suppliers: dict[str, tuple] = {}
    for path in sorted(Path(ocds_dir).glob("*.json")):
        if path.name.endswith(".provenance.json") or (years and not any(y in path.name for y in years)):
            continue
        meta = json.loads(Path(str(path) + ".provenance.json").read_text())
        capture_id, result = _ingest(conn, store, handlers, publisher_id, row["id"] if row else None, path, meta, "ocds", None, f"tenders.go.ke OCDS {path.name.split('-', 1)[-1].removesuffix('.json')}")
        first = first or (capture_id, str(result.id))
        for segment in result.segments:
            r = json.loads(segment.content)
            buyer = str(r["buyerId"]) if r.get("buyerId") is not None else None
            if buyer and buyer not in pes:
                pes[buyer] = dict(entity_record(buyer, r["buyerName"], None, None, None, None, None, None, None), _capture=capture_id, _result=str(result.id), _key=segment.key)
            kind = r["category"] if r["category"] in KINDS else None
            if not buyer or kind is None:
                notes.append(f"{r['ocid']}: no buyer or procurement category; tender skipped")
                continue
            code = r["ocid"]
            if len(code) > 200:
                notes.append(f"{code[:60]}...: tender code is {len(code)} characters (maximum 200); tender and its contracts skipped, raw package keeps it")
                continue
            if code not in tenders:
                tenders[code] = (capture_id, str(result.id), segment.key, {"ocid": code, "tenderCode": code, "title": _fit(_scrub_contact(r["title"]), 300), "kindRef": cref(f"procurement/tender-kind/{kind}", jurisdiction), "methodRef": cref(f"procurement/method/{METHODS.get(r['method'], 'other')}", jurisdiction), "buyerCode": f"ke/pe/{buyer}", "status": "awarded" if r["awards"] else "published", "publishedOn": r["starts"], "closesOn": _iso_date(r["ends"])})
            for award in r["awards"]:
                sid = str(award["supplierId"])
                suppliers.setdefault(sid, (capture_id, str(result.id), segment.key, {"id": sid, "name": award["supplierName"], "entityCode": f"ke/supplier/{sid}", "typeRef": cref("organization/entity-type/company", jurisdiction)}))
                for contract in r["contracts"]:
                    if contract["awardId"] == award["awardId"] and (contract["value"] or award["value"]):
                        ccode = f"{code}#{contract['contractId']}"
                        contracts.setdefault(ccode, (capture_id, str(result.id), segment.key, {"ocid": code, "contractCode": ccode, "tenderCode": code, "supplierCode": f"ke/supplier/{sid}", "buyerCode": f"ke/pe/{buyer}", "value": str(contract["value"] or award["value"]), "awardedOn": contract["signed"]}))
        del result
    runs, stats = {}, {}
    for name in STAGES[stage]:
        mapping = substitute(yaml.safe_load((MAPPINGS / f"{name}.yml").read_text()), {"jurisdiction": jurisdiction})
        run_id = candidates.create_run(conn, f"procurement/{jurisdiction}/{name}", "v1", first[0] if first else None, first[1] if first else None)
        total = candidates.CandidateStats()
        batches: dict[tuple[str, str], list] = {}

        def add(capture, result, key, record):
            batches.setdefault((capture, result), []).append((key, record))

        if name in ("pe_unit", "entity"):
            for pe in pes.values():
                add(pe["_capture"], pe["_result"], pe["_key"], pe)
            if name == "entity":
                for cap, res, key, rec in suppliers.values():
                    add(cap, res, key, rec)
        elif name == "identifier":
            for pe in pes.values():
                held = contacts.get(str(pe["id"]), {})
                for scheme, value in (("tenders-portal-id", str(pe["id"])), ("kra-pin", held.get("kra-pin"))):
                    if value:
                        add(pe["_capture"], pe["_result"], pe["_key"], {"id": pe["id"], "entityCode": pe["entityCode"], "schemeRef": cref(f"organization/identifier-scheme/{scheme}", jurisdiction), "value": value})
            for cap, res, key, rec in suppliers.values():
                add(cap, res, key, {"id": rec["id"], "entityCode": rec["entityCode"], "schemeRef": cref("organization/identifier-scheme/tenders-portal-id", jurisdiction), "value": rec["id"]})
        elif name == "contact":
            # Published contact data of public procuring entities: contact points at entity scope, restricted from the public API.
            for pe in pes.values():
                held = contacts.get(str(pe["id"]), {})
                for channel, scheme in (("phone", "contact-phone"), ("email", "contact-email")):
                    if held.get(scheme):
                        add(pe["_capture"], pe["_result"], pe["_key"], {"id": pe["id"], "entityCode": pe["entityCode"], "channel": channel, "value": held[scheme]})
        elif name == "place":
            for pe in pes.values():
                if pe["geoUnitCode"] or pe["addressText"]:
                    add(pe["_capture"], pe["_result"], pe["_key"], dict(pe, name=_fit(pe["name"], 300)))
        elif name == "occupancy":
            for pe in pes.values():
                if pe["geoUnitCode"] or pe["addressText"]:
                    place = {"$ref": {"kind": "place.places", "where": {"name": _fit(pe["name"], 300), "addressText": pe["addressText"]}}}
                    role = ROLE_BY_TYPE.get(pe["typeRef"]["$ref"]["where"]["code"].rsplit("/", 1)[-1], "official-workplace")
                    add(pe["_capture"], pe["_result"], pe["_key"], {"id": pe["id"], "entityCode": pe["entityCode"], "placeRef": place, "roleRef": cref(f"place/occupancy-role/{role}", jurisdiction)})
        elif name == "tender":
            for cap, res, key, rec in tenders.values():
                add(cap, res, key, rec)
        elif name == "contract":
            for cap, res, key, rec in contracts.values():
                add(cap, res, key, rec)
        for (cap, res), records in batches.items():
            allowed = ["email", "phone", "national_id"] if name in ("identifier", "contact") else []  # published contact data of public procuring entities
            one = candidates.add_candidates(conn, run_id, mapping, records, res, allowed, [])
            for field in ("created", "unchanged", "superseding", "quarantined", "invalid"):
                setattr(total, field, getattr(total, field) + getattr(one, field))
            conn.commit()
        candidates.finish_run(conn, run_id)
        runs[name], stats[name] = run_id, total
    conn.commit()
    return ProcurementImport(len(pes), runs, stats, notes)
