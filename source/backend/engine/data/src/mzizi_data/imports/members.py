"""Members of the National Assembly and the Senate (13th Parliament) from the Parliament of Kenya member lists.

Only public-office facts the list pages publish: who holds which seat, the party and how the seat was filled.
Stages (each promoted before the next, because later ones reference earlier ones by code):
  A institutions and parties, B offices and individuals, C holders and party memberships.
Photos are fetched separately (`fetch-photos`) and stay raw artifacts with their source URL.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path

import psycopg
import yaml

from .. import candidates, jobs, pipeline, register
from ..files import LocalDirectoryStore
from ..structure.effective import substitute
from .budget_table import MAPPINGS as _BUDGET_MAPPINGS

MAPPINGS = _BUDGET_MAPPINGS.parent / "members"
STAGES = {"A": ["institution", "party"], "B": ["office", "individual"], "C": ["holder", "membership"]}
KEYS = {"institution": ("institutionCode",), "party": ("partyCode",), "office": ("officeCode",), "individual": ("personCode",), "holder": ("officeCode", "personCode"), "membership": ("partyCode", "personCode")}
INSTITUTIONS = {"national-assembly": ("ke/national-assembly", "National Assembly of Kenya"), "senate": ("ke/senate", "Senate of Kenya")}


def slug(value: str) -> str:
    from ..structure.transforms import apply

    return apply({"slug_code": ""}, value) if False else __import__("re").sub(r"-+", "-", __import__("re").sub(r"[^a-z0-9]+", "-", value.lower().replace("'", "").replace("’", ""))).strip("-")


def enrich(record: dict, geo=None) -> dict:
    """Adds the codes the mappings reference: person, office, institution and party."""
    code, name = INSTITUTIONS[record["chamber"]]
    out = dict(record, institutionCode=code, institutionName=name, personCode=f"ke/person/{slug(record['displayName'])}")
    out["partyAbbreviation"] = record["party"] if record["party"] and len(record["party"]) <= 40 else None
    out["partyCode"] = f"ke/party/{slug(record['party'])}" if record["party"] else None
    if record["chamber"] == "senate":
        seat = record["county"] or "nominated"
        out["officeCode"] = f"ke/senate/{slug(seat)}" if record["county"] else f"ke/senate/nominated/{slug(record['displayName'])}"
        out["officeName"] = f"Senator, {record['county'].title()}" if record["county"] else "Nominated Senator"
        out["singleton"] = False  # a county has one elected senator but nominated seats share a title
        place = geo.county(record["county"]) if geo and record["county"] else None
        out["officeDescription"] = f"Seat kind: {record['seatStatus']}." + (f" Geography: {place}" if place else "")
    else:
        label = record["constituency"] or record["seatStatus"] or "nominated"
        elected = bool(record["constituency"]) and record["seatStatus"].lower() == "elected"
        out["officeCode"] = f"ke/national-assembly/{slug(label)}" if elected else f"ke/national-assembly/{slug(label)}/{slug(record['displayName'])}"
        out["officeName"] = f"Member of the National Assembly, {record['constituency'].title()}" if record["constituency"] else f"Member of the National Assembly ({record['seatStatus'] or 'special seat'})"
        out["singleton"] = elected
        place = geo.constituency(record["county"], record["constituency"]) if geo and elected else None
        out["officeDescription"] = f"County: {record['county'].title()}. Seat kind: {record['seatStatus']}." + (f" Geography: {place}" if place else "")
    return out


@dataclass
class MembersImport:
    pages: int
    members: int
    runs: dict[str, str]
    stats: dict[str, candidates.CandidateStats]


def import_members(conn: psycopg.Connection, store: LocalDirectoryStore, directory: str | Path, jurisdiction: str = "ke", stage: str = "A") -> MembersImport:
    publisher_id = register.ensure_publisher(conn, "ke-parliament", "Parliament of Kenya", kind="institution", website_url="https://www.parliament.go.ke")
    row = conn.execute("SELECT id::text AS id FROM reference.jurisdictions WHERE code = %s", (jurisdiction,)).fetchone()
    pages = sorted(Path(directory).glob("*.provenance.json"))
    from ..geo_link import GeoResolver

    geo = GeoResolver(conn, jurisdiction)
    handlers = {"extract": pipeline.extraction_handler(conn, store)}
    per_page: list[tuple[str, str, list[tuple[str, dict]]]] = []
    for meta_path in pages:
        meta = json.loads(meta_path.read_text())
        url = meta["url"]
        if "/the-national-assembly/mps" in url:
            profile, label = "national-assembly", "Members of the National Assembly"
        elif "/the-senate/senators" in url:
            profile, label = "senate", "Senators"
        else:
            continue
        data_path = Path(str(meta_path)[: -len(".provenance.json")])
        number = url.rsplit("page=", 1)[-1]
        spec = register.DocumentSpec(publisher_id, f"{label}, 13th Parliament, list page {number}", "official_website", url=url, licence="Not confirmed (public member list on the official Parliament site; reuse terms unassessed)", citation=f"Parliament of Kenya, {label} list, retrieved {meta['retrieved_at'][:10]}.", jurisdiction_id=row["id"] if row else None)
        document_id, capture_id, ref = pipeline.ingest(conn, store, data_path.read_bytes(), f"{profile}-{number}.html", spec, url=url, tool="gated-fetch", mime_type="text/html")
        job_id, _ = pipeline.enqueue_extraction(conn, ref.version_id, "parliament-members", profile, capture_id)
        conn.commit()
        while jobs.run_once(conn, handlers, worker="members-import"):
            pass
        job = conn.execute("SELECT status, result_file_version_id::text AS fv, error FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
        if job["status"] != "succeeded":
            raise RuntimeError(f"extraction of {url} did not succeed: {job['status']} {job['error']}")
        result = pipeline.load_result(store, job["fv"])
        per_page.append((capture_id, str(result.id), [(s.key, enrich(json.loads(s.content), geo)) for s in result.segments]))
    total = sum(len(records) for _, _, records in per_page)
    runs, stats = {}, {}
    for name in STAGES[stage]:
        mapping = substitute(yaml.safe_load((MAPPINGS / f"{name}.yml").read_text()), {"jurisdiction": jurisdiction})
        run_id = candidates.create_run(conn, f"members/{jurisdiction}/13th/{name}", "v1", per_page[0][0] if per_page else None, per_page[0][1] if per_page else None)
        total_stats = candidates.CandidateStats()
        allowed = ["political_opinion"] if name == "membership" else []
        seen: set[tuple] = set()
        for _capture, result_id, records in per_page:
            subset = []
            for k, r in records:
                ident = tuple(r.get(f) for f in KEYS[name])
                if None in ident or ident in seen:
                    continue  # one candidate per natural key; the first page that shows it is its provenance
                seen.add(ident)
                subset.append((k, r))
            one = candidates.add_candidates(conn, run_id, mapping, subset, result_id, allowed, [])
            for field in ("created", "unchanged", "superseding", "quarantined", "invalid"):
                setattr(total_stats, field, getattr(total_stats, field) + getattr(one, field))
            total_stats.ids += one.ids
        candidates.finish_run(conn, run_id)
        runs[name], stats[name] = run_id, total_stats
    conn.commit()
    return MembersImport(len(per_page), total, runs, stats)
