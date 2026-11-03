"""Governors, deputy governors and county leaders from Wikipedia county pages (MediaWiki API wikitext) and county government sites.

Both sources are weak compared with a register, so every record carries its source URL and a confidence (Wikipedia prose 0.6, county site
text 0.5, both agreeing 0.75) and is promoted unverified. Nothing is guessed: a page that does not say who the deputy governor is yields
nothing. Counties are matched by the file name, which comes from the geography tree.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

from . import county_sites
from .county_executives import slug

TITLE = r"(?:(?:Hon|Dr|Prof|Professor|Eng|Engr|Amb|Mr|Mrs|Ms|Sen|Rev|CPA|Justice)\.?[ ]+)*"
NAME = TITLE + r"([A-Z][A-Za-z'’\-]+(?:[ ]+[A-Z][A-Za-z'’\-]+){1,3})"
DEPUTY = [re.compile(r"[Dd]eputy [Gg]overnor(?: of [A-Z][A-Za-z' \-]+? County)?,? (?:is|was|being|currently)[ ]+(?:the )?" + NAME), re.compile(r"[Dd]eputi[sz]ed by[ ]+" + NAME), re.compile(r"[Dd]eputy [Gg]overnor[,:]?[ ]+" + NAME)]
BAD = {"The", "County", "Governor", "Deputy", "Government", "Kenya", "Cite", "Web", "Governors", "He", "She", "Assembly", "Executive"}


def clean(wikitext: str) -> str:
    t = re.sub(r"<ref[^>]*?/>", "", wikitext)
    t = re.sub(r"<ref[^>]*>.*?</ref>", "", t, flags=re.S)
    t = re.sub(r"\{\{[^{}]*\}\}", "", t)
    t = re.sub(r"\[\[(?:[^\]|]*\|)?([^\]]*)\]\]", r"\1", t)
    return re.sub(r"'''?", "", t)


def ok(name: str) -> bool:
    parts = name.split()
    return len(parts) >= 2 and not any(p in BAD for p in parts)


def wikipedia_records(directory: Path, county_codes: dict[str, str]) -> list[dict]:
    """county_codes: file stem (e.g. 'Nakuru_County') -> geography code."""
    out = []
    for stem, code in county_codes.items():
        path = Path(directory) / f"{stem}.json"
        if not path.exists():
            continue
        raw = json.loads(path.read_text())
        text = clean(raw["wikitext"])
        for rx in DEPUTY:
            m = rx.search(text)
            if m and ok(m.group(1)):
                out.append({"county": code, "kind": "deputy-governor", "name": m.group(1).strip(), "source": "wikipedia", "url": raw["url"], "confidence": 0.6, "retrievedAt": raw["retrieved_at"]})
                break
        m = re.search(r"\|\s*leader_name\s*=\s*" + NAME, text)
        if m and ok(m.group(1)):
            out.append({"county": code, "kind": "governor", "name": m.group(1).strip(), "source": "wikipedia", "url": raw["url"], "confidence": 0.6, "retrievedAt": raw["retrieved_at"]})
    return out


def site_records(directory: Path) -> list[dict]:
    out = []
    for folder in sorted(Path(directory).iterdir()) if Path(directory).exists() else []:
        if not folder.is_dir():
            continue
        for found in county_sites.leaders(folder):
            url = (folder / (found["page"] + ".url")).read_text() if (folder / (found["page"] + ".url")).exists() else f"https://{folder.name}.go.ke/"
            out.append({"countySlug": folder.name, "kind": found["kind"], "name": found["name"], "source": "county-site", "url": url, "confidence": 0.5})
    return out


import psycopg
import yaml

from .. import candidates, jobs, pipeline, register
from ..files import LocalDirectoryStore
from ..geo_link import GeoResolver
from ..structure.effective import substitute

MAPPINGS = Path(__file__).resolve().parents[3] / "mappings" / "county-leaders"
DEFINITION = {"governor": "county-executive:governor", "deputy-governor": "county-executive:deputy-governor", "county-secretary": "county-executive:county-secretary", "cec-member": "county-executive:county-executive-committee-member", "speaker": "county-assembly:speaker"}
MAX_CEC = 10
STAGES = {"A": ["individual"], "B": ["holder"]}
KEYS = {"individual": ("personCode",), "holder": ("officeCode", "personCode")}


def build_records(conn: psycopg.Connection, wiki_dir: Path, sites_dir: Path) -> tuple[list[dict], list[tuple]]:
    """Merged, resolved records plus a report of what was skipped (unresolved county, governor already known from Wikidata, conflicts)."""
    geo = GeoResolver(conn)
    names = {p.stem: p.stem.removesuffix("_County").replace("_", " ") for p in Path(wiki_dir).glob("*_County.json")}
    codes = {stem: geo.county(n) for stem, n in names.items()}
    raw = wikipedia_records(wiki_dir, {s: c for s, c in codes.items() if c})
    for r in site_records(sites_dir):
        code = geo.county(r.pop("countySlug").replace("-", " "))
        if code:
            raw.append({**r, "county": code})
    report: list[tuple] = []
    have_governor = {r["county"] for r in conn.execute("SELECT u.code AS county FROM governance.holders h JOIN governance.offices o ON o.id = h.office_id JOIN geography.units u ON u.id = o.scope_geo_unit_id WHERE o.definition_code = 'county-executive:governor' AND h.is_current")}
    merged: dict[tuple, dict] = {}
    for r in raw:
        if r["kind"] == "governor" and r["county"] in have_governor:
            continue
        key = (r["county"], r["kind"], re.sub(r"[^a-z]", "", r["name"].lower()))
        rec = merged.setdefault(key, {"county": r["county"], "kind": r["kind"], "name": r["name"], "sources": [], "confidence": 0.0})
        if r["url"] not in [s["url"] for s in rec["sources"]]:
            rec["sources"].append({"source": r["source"], "url": r["url"], "confidence": r["confidence"]})
    out, per_kind = [], {}
    for key, rec in sorted(merged.items()):
        kinds = {s["source"] for s in rec["sources"]}
        rec["confidence"] = 0.75 if len(kinds) > 1 else max(s["confidence"] for s in rec["sources"])
        group = (rec["county"], rec["kind"])
        per_kind.setdefault(group, []).append(rec)
    for (county, kind), recs in per_kind.items():
        singleton = kind in ("governor", "deputy-governor", "county-secretary", "speaker")
        recs.sort(key=lambda r: -r["confidence"])
        if singleton and len(recs) > 1:
            report.append(("conflict", county, kind, [r["name"] for r in recs]))
            recs = recs[:1]
        if kind == "cec-member":
            recs = recs[:MAX_CEC]
        out += recs
    return out, report


def import_county_leaders(conn: psycopg.Connection, store: LocalDirectoryStore, wiki_dir: Path, sites_dir: Path, stage: str = "A"):
    records, report = build_records(conn, wiki_dir, sites_dir)
    publisher_id = register.ensure_publisher(conn, "wikipedia", "Wikipedia (Wikimedia Foundation)", kind="repository", website_url="https://en.wikipedia.org")
    juris = conn.execute("SELECT id::text AS id FROM reference.jurisdictions WHERE code = 'ke'").fetchone()
    spec = register.DocumentSpec(publisher_id, "County leaders read from Wikipedia county pages and county government sites", "official_website", url="https://en.wikipedia.org/w/api.php", licence="CC BY-SA 4.0 (Wikipedia text; names are facts); county site text is not licensed for reuse here beyond naming public officeholders", citation="Wikipedia county articles (MediaWiki API) and .go.ke county government sites, retrieved through the collection gate.", jurisdiction_id=juris["id"] if juris else None)
    document_id, capture_id, ref = pipeline.ingest(conn, store, json.dumps({"records": records}, sort_keys=True).encode(), "county-leaders-web.json", spec, url="https://en.wikipedia.org/w/api.php", tool="gated-fetch", mime_type="application/json")
    job_id, _ = pipeline.enqueue_extraction(conn, ref.version_id, "county-leaders-web", None, capture_id)
    conn.commit()
    handlers = {"extract": pipeline.extraction_handler(conn, store)}
    while jobs.run_once(conn, handlers, worker="county-leaders"):
        pass
    job = conn.execute("SELECT status, result_file_version_id::text AS fv, error FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
    if job["status"] != "succeeded":
        raise RuntimeError(f"extraction did not succeed: {job['status']} {job['error']}")
    result = pipeline.load_result(store, job["fv"])
    offices = {(r["county"], r["definition"]): r["code"] for r in conn.execute("SELECT u.code AS county, o.definition_code AS definition, o.code FROM governance.offices o JOIN geography.units u ON u.id = o.scope_geo_unit_id WHERE o.definition_code LIKE 'county-%%' AND o.is_current")}
    rows = []
    for s in result.segments:
        r = json.loads(s.content)
        office = offices.get((r["county"], DEFINITION[r["kind"]]))
        if not office:
            report.append(("no-office", r["county"], r["kind"], r["name"]))
            continue
        r.update(officeCode=office, personCode=f"ke/person/{slug(r['name'])}-{r['county'].rsplit('/', 1)[-1]}", current=True)
        rows.append((s.key, r))
    runs, stats = {}, {}
    for name in STAGES[stage]:
        mapping = substitute(yaml.safe_load((MAPPINGS / f"{name}.yml").read_text()), {"jurisdiction": "ke"})
        run_id = candidates.create_run(conn, f"county-leaders/ke/{name}", "v1", capture_id, str(result.id))
        subset, seen = [], set()
        for k, r in rows:
            ident = tuple(r.get(f) for f in KEYS[name])
            if None in ident or ident in seen:
                continue
            seen.add(ident)
            subset.append((k, r))
        stats[name] = candidates.add_candidates(conn, run_id, mapping, subset, str(result.id), [], [])
        candidates.finish_run(conn, run_id)
        runs[name] = run_id
    conn.commit()
    return runs, stats, report, len(rows)
