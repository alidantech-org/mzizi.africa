"""County executives (governors and deputy governors) from Wikidata, through the gated official API.

Wikidata holds one position item per county ("Governor of Nairobi County"). The people who held it are the items whose `position held`
(P39) statement points at that item, found with the API's `haswbstatement` search; each holder's statement carries qualifiers for
start (P580), end (P582), the party (P102 as a qualifier or on the person) and the reason the term ended (P1534). Nothing is scraped.
Raw API answers are kept as JSON under the raw directory with a provenance file; the parsing below reads only those files.
Counties are matched by exact normalised name to the geography tree; a position that does not match exactly one county is reported
and skipped, never guessed.
"""
from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

from ..seedroot import MAPPINGS_ROOT
from ..geo_link import norm
from ..wikimedia import WIKIDATA_API, Wikimedia

POSITIONS = {"governor": "Governor of {county} County", "deputy-governor": "Deputy Governor of {county} County"}
START, END, PARTY, REASON, ELECTED = "P580", "P582", "P102", "P1534", "P2715"
NAME_FIXES = {"nairobi": "Nairobi City", "murang'a": "Murang'a", "tharaka nithi": "Tharaka-Nithi", "elgeyo marakwet": "Elgeyo-Marakwet", "taita taveta": "Taita-Taveta", "trans nzoia": "Trans Nzoia"}


def harvest(wm: Wikimedia, counties: list[tuple[str, str]], out: Path, only: set[str] | None = None) -> dict:
    """counties: (geography code, name). Writes <out>/<kind>-<slug>.json per position; returns a report."""
    out.mkdir(parents=True, exist_ok=True)
    report = {"positions": 0, "no_position": [], "no_holders": []}
    for kind, pattern in POSITIONS.items():
        for code, name in counties:
            path = out / f"{kind}-{code.rsplit('/', 1)[-1]}.json"
            if path.exists() or (only and code not in only):
                continue
            wanted = [pattern.format(county=n) for n in (name, NAME_FIXES.get(name.lower(), name), name.replace("-", " "), name.replace("'", ""))]
            position = None
            for text in dict.fromkeys(wanted):
                hits = [h for h in wm.search(text, 8) if norm(h.get("label") or "") == norm(text)]
                if hits:
                    position = hits[0]
                    position["alsoIds"] = [h["id"] for h in hits[1:]]
                    break
            if not position:
                report["no_position"].append((kind, code))
                path.write_text(json.dumps({"county": code, "kind": kind, "position": None}))
                continue
            ids = []
            for pid in [position["id"], *position.get("alsoIds", [])]:
                ids += [f["title"] for f in wm._json(WIKIDATA_API, action="query", list="search", srsearch=f"haswbstatement:P39={pid}", srlimit=50)["query"]["search"]]
            ids = list(dict.fromkeys(ids))
            entities = wm.entities(ids) if ids else {}
            path.write_text(json.dumps({"county": code, "kind": kind, "position": position, "retrieved_at": datetime.now(timezone.utc).isoformat(), "entities": entities}))
            report["positions"] += 1
            if not ids:
                report["no_holders"].append((kind, code))
    return report


import difflib
import psycopg
import yaml

from .. import candidates, jobs, pipeline, register
from ..files import LocalDirectoryStore
from ..structure.effective import substitute

MAPPINGS = MAPPINGS_ROOT / "county-executives"
STAGES = {"A": ["individual"], "B": ["holder", "membership"]}
KEYS = {"individual": ("personCode",), "holder": ("officeCode", "personCode"), "membership": ("partyCode", "personCode")}
DEFINITION = {"governor": "county-executive:governor", "deputy-governor": "county-executive:deputy-governor"}


def slug(value: str) -> str:
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", value.lower().replace("'", "").replace("’", ""))).strip("-")


def reason_code(label: str | None) -> str | None:
    if not label:
        return None
    t = label.lower()
    if "death" in t or "died" in t:
        return "died"
    if "resign" in t:
        return "resigned"
    if "impeach" in t or "remov" in t or "dismiss" in t:
        return "removed"
    if "term" in t or "expir" in t or "election" in t or "lost" in t:
        return "term_ended"
    return "other"


class Parties:
    """Party names and abbreviations normalised; exact match first, then a unique close match (>= 0.92); otherwise unlinked."""

    def __init__(self, conn: psycopg.Connection):
        self.by: dict[str, str] = {}
        for r in conn.execute("SELECT code, name, abbreviation FROM political.parties"):
            for text in (r["name"], r["abbreviation"]):
                if text:
                    self.by.setdefault(self.norm(text), r["code"])

    @staticmethod
    def norm(text: str) -> str:
        text = re.sub(r"\(.*?\)", " ", text.lower())
        text = re.sub(r"[^a-z0-9 ]", " ", text)
        return " ".join(re.sub(r"\b(party|of|kenya|the|and|for)\b", " ", text).split())

    ALIASES = {"wiper democratic movement": "ke/party/wdm", "wiper democratic movement kenya": "ke/party/wdm"}

    def find(self, label: str | None) -> tuple[str | None, str]:
        if not label:
            return None, "no party stated"
        key = self.norm(label)
        if key in self.ALIASES and not key in self.by:
            return self.ALIASES[key], "alias"
        if key in self.by:
            return self.by[key], "exact"
        close = {self.by[k] for k in difflib.get_close_matches(key, list(self.by), n=3, cutoff=0.92)}
        return (next(iter(close)), "fuzzy") if len(close) == 1 else (None, "unmatched")


def import_county_executives(conn: psycopg.Connection, store: LocalDirectoryStore, directory: str | Path, labels: dict[str, str], stage: str = "A"):
    directory = Path(directory)
    files = {p.name: json.loads(p.read_text()) for p in sorted(directory.glob("*.json")) if not p.name.endswith(".provenance.json") and p.name != "bundle.json"}
    publisher_id = register.ensure_publisher(conn, "wikidata", "Wikidata", kind="institution", website_url="https://www.wikidata.org")
    juris = conn.execute("SELECT id::text AS id FROM reference.jurisdictions WHERE code = 'ke'").fetchone()
    bundle = json.dumps({"files": files, "labels": labels}, sort_keys=True).encode()
    spec = register.DocumentSpec(publisher_id, "Wikidata: holders of the county governor and deputy governor positions of Kenya", "official_website", url="https://www.wikidata.org/w/api.php", licence="CC0 1.0 (Wikidata structured data)", citation="Wikidata, position held (P39) statements for 'Governor of X County' and 'Deputy Governor of X County', retrieved through the official API.", jurisdiction_id=juris["id"] if juris else None)
    document_id, capture_id, ref = pipeline.ingest(conn, store, bundle, "county-executives-wikidata.json", spec, url="https://www.wikidata.org/w/api.php", tool="gated-fetch", mime_type="application/json")
    job_id, _ = pipeline.enqueue_extraction(conn, ref.version_id, "wikidata-county-executives", None, capture_id)
    conn.commit()
    handlers = {"extract": pipeline.extraction_handler(conn, store)}
    while jobs.run_once(conn, handlers, worker="county-executives"):
        pass
    job = conn.execute("SELECT status, result_file_version_id::text AS fv, error FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
    if job["status"] != "succeeded":
        raise RuntimeError(f"extraction did not succeed: {job['status']} {job['error']}")
    result = pipeline.load_result(store, job["fv"])
    offices = {(r["county"], r["definition"]): r["code"] for r in conn.execute("SELECT u.code AS county, o.definition_code AS definition, o.code FROM governance.offices o JOIN geography.units u ON u.id = o.scope_geo_unit_id WHERE o.definition_code LIKE 'county-executive:%%' AND o.is_current")}
    parties = Parties(conn)
    records, unlinked = [], []
    for s in result.segments:
        r = json.loads(s.content)
        office = offices.get((r["county"], DEFINITION[r["kind"]]))
        if not office:
            unlinked.append(("office", r["county"], r["kind"]))
            continue
        pcode, how = parties.find(r["party"])
        if r["party"] and not pcode:
            unlinked.append(("party", r["name"], r["party"]))
        r.update(officeCode=office, personCode=f"ke/person/{slug(r['name'])}-{r['wikidata'].lower()}", partyCode=pcode, partyMatch=how, departureReason=reason_code(r["reason"]), current=r["to"] is None)
        records.append((s.key, r))
    runs, stats = {}, {}
    for name in STAGES[stage]:
        mapping = substitute(yaml.safe_load((MAPPINGS / f"{name}.yml").read_text()), {"jurisdiction": "ke"})
        run_id = candidates.create_run(conn, f"county-executives/ke/{name}", "v1", capture_id, str(result.id))
        subset, seen = [], set()
        for k, r in records:
            ident = tuple(r.get(f) for f in KEYS[name])
            if None in ident or ident in seen:
                continue
            seen.add(ident)
            subset.append((k, r))
        stats[name] = candidates.add_candidates(conn, run_id, mapping, subset, str(result.id), ["political_opinion"] if name == "membership" else [], [])
        candidates.finish_run(conn, run_id)
        runs[name] = run_id
    conn.commit()
    return runs, stats, unlinked, len(records)


def party_and_reason_ids(directory: Path) -> set[str]:
    ids: set[str] = set()
    for p in Path(directory).glob("*-*.json"):
        for e in json.loads(p.read_text()).get("entities", {}).values():
            for c in e.get("claims", {}).get("P102", []):
                v = (c["mainsnak"].get("datavalue") or {}).get("value")
                if v:
                    ids.add(v["id"])
            for c in e.get("claims", {}).get("P39", []):
                for prop in ("P102", "P1534"):
                    for q in c.get("qualifiers", {}).get(prop, []):
                        v = (q.get("datavalue") or {}).get("value")
                        if v:
                            ids.add(v["id"])
    return ids


def build_labels(wm: Wikimedia, directory: Path) -> dict[str, str]:
    """English labels of the party and departure-reason items the raw answers mention, written to labels.json beside them."""
    labels = wm.entity_labels(sorted(party_and_reason_ids(directory)))
    (Path(directory) / "labels.json").write_text(json.dumps(labels))
    return labels


def run_harvest(conn: psycopg.Connection, out: Path, rate: float = 0.2, only: set[str] | None = None) -> dict:
    """Harvest governor and deputy governor holders from Wikidata through the gate (resumable: existing files are kept)."""
    from .. import wikimedia
    from ..fetch import live_fetcher

    site = conn.execute("SELECT id FROM website.sites WHERE code = %s", (wikimedia.SITE_CODE,)).fetchone()
    counties = [(r["code"], r["name"]) for r in conn.execute("SELECT u.code, u.name FROM geography.units u JOIN reference.classifications l ON l.id = u.level_id WHERE l.\"order\" = 1 AND u.is_current ORDER BY 1")]
    fetcher = live_fetcher(conn, str(site["id"]), {"rate": {"requests_per_second": rate}, "limits": {"max_response_bytes": 8_000_000}}, robots_exempt_paths=wikimedia.API_PATHS)
    wm = wikimedia.Wikimedia(fetcher.get)
    report = harvest(wm, counties, out, only)
    build_labels(wm, out)
    return report
