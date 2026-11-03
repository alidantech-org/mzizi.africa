"""County assembly members from the IEBC gazette (elected: Gazette Notice 9956, 24 Aug 2022; nominated: Gazette Notice 10712, 9 Sep 2022).

The gazette is the official declaration for all 47 counties, so it is the base list; the assembly sites (`county_assembly_members`) corroborate
members, add speakers and later changes. Linking is by score and never guessed: an elected member is linked to the ward post only when the
ward name matches one ward of the county (the constituency narrows the pool first); an unmatched ward keeps the person and a post of its own
(`.../assembly/mca-unplaced/<slug>`) and is reported. A ward post that already has a current holder (from an assembly site) is left alone and the
winner is reported as corroborated (same name tokens) or different. Nominated members hold the county's shared seat post (marginalised groups or
gender top-up); the gazette's ID mask, gender and nature of special interest are not kept. Party is linked by abbreviation or name, otherwise left out.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from difflib import SequenceMatcher
from pathlib import Path

import yaml

from .. import candidates, jobs, pipeline, register
from ..extractors import iebc_gazette_mca  # noqa: F401  (registers the extractor)
from ..files import LocalDirectoryStore
from ..structure.effective import substitute
from .county_assembly_members import KEYS, MAPPINGS, STAGES, Geo, slug, tokens

DOCS = {
    "elected": ("eafe12d9e632-t5KQ6O4YGp.pdf", "Gazette Notice 9956: Declaration of persons elected as members of the county assemblies (Kenya Gazette Vol. CXXIV No. 170, 24 August 2022)"),
    "nominated": ("58567008cfa5-ynAVARDxzL.pdf", "Gazette Notice 10712: Nominated members to the county assemblies (Kenya Gazette Vol. CXXIV No. 186, 9 September 2022)"),
}


@dataclass
class Report:
    county: str
    linked: int = 0
    unplaced: list = field(default_factory=list)
    corroborated: int = 0
    different: list = field(default_factory=list)
    nominated: int = 0
    runs: dict = field(default_factory=dict)
    stats: dict = field(default_factory=dict)


def extract_all(conn, store, raw: Path, kind: str):
    filename, title = DOCS[kind]
    path = next(raw.glob(f"*{filename.split('-', 1)[1]}"))
    meta = json.loads(Path(str(path) + ".provenance.json").read_text())
    publisher_id = register.ensure_publisher(conn, "ke-iebc", "Independent Electoral and Boundaries Commission", kind="institution", website_url="https://www.iebc.or.ke")
    row = conn.execute("SELECT id::text AS id FROM reference.jurisdictions WHERE code = 'ke'").fetchone()
    spec = register.DocumentSpec(publisher_id, title, "official_website", url=meta["url"], licence="Not confirmed (official gazette notice published by the IEBC; reuse terms unassessed)", citation=f"IEBC, {title}, retrieved {meta['retrieved_at'][:10]}.", jurisdiction_id=row["id"] if row else None)
    _doc, capture_id, ref = pipeline.ingest(conn, store, path.read_bytes(), filename, spec, url=meta["url"], tool="gated-fetch", mime_type="application/pdf")
    job_id, _ = pipeline.enqueue_extraction(conn, ref.version_id, "iebc-gazette-mca", kind, capture_id)
    conn.commit()
    handlers = {"extract": pipeline.extraction_handler(conn, store)}
    while jobs.run_once(conn, handlers, worker="mca-gazette"):
        pass
    job = conn.execute("SELECT status, result_file_version_id::text AS fv, error FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
    if job["status"] != "succeeded":
        raise RuntimeError(f"extraction failed: {job['status']} {job['error']}")
    result = pipeline.load_result(store, job["fv"])
    return capture_id, str(result.id), [json.loads(s.content) for s in result.segments]


def best_party(geo: Geo, abbreviation: str, name: str) -> str | None:
    code = geo.party([abbreviation] if abbreviation and abbreviation.upper() != "IND" else [])
    if code or (abbreviation or "").upper() == "IND" or "independent" in (name or "").lower():
        return code
    key = re.sub(r"[^A-Z0-9]", "", (name or "").upper())
    if key in geo.parties:
        return geo.parties[key]
    scored = sorted(((SequenceMatcher(None, key, k).ratio(), c) for k, c in geo.parties.items() if len(k) > 6), reverse=True)
    return scored[0][1] if scored and scored[0][0] >= 0.9 and (len(scored) < 2 or scored[0][0] - scored[1][0] > 0.03 or scored[0][1] == scored[1][1]) else None


def ward_pool(geo: Geo, county: str, constituency: str) -> list[str]:
    posts = list(geo.wards.get(county, {}))
    ct = tokens(constituency)
    narrowed = [p for p in posts if (lambda c: c == ct or (c and (c <= ct or ct <= c) and max(len(t) for t in (c & ct) or {""}) >= 4))(tokens(p.split("/")[3].replace("-", " ")))]
    return narrowed or posts


def enrich_elected(rec: dict, county: str, geo: Geo, held: dict, report: Report, taken: set) -> dict | None:
    number = geo.numbers[county]
    name = geo.counties[county]
    saved = geo.wards.get(county, {})
    geo.wards[county] = {p: p for p in ward_pool(geo, county, rec["constituency"])}
    post, score, _raw = geo.match_ward(county, [rec["ward"]])
    geo.wards[county] = saved
    if not post:
        post, score, _raw = geo.match_ward(county, [rec["ward"]])
    personal = f"ke/person/{slug(rec['displayName'])}-mca-{county}"
    out = dict(rec, personCode=personal, displayName=rec["displayName"], partyCode=best_party(geo, rec["partyAbbreviation"], rec["partyName"]), institutionCode=f"ke/{county}/assembly", wardScore=round(score, 3))
    if post and post not in taken:
        if post in held:
            same = len(tokens(held[post]) & tokens(rec["displayName"])) >= 2
            if same:
                report.corroborated += 1
            else:
                report.different.append({"ward": post, "gazette": rec["displayName"], "siteHolder": held[post]})
            taken.add(post)
            return None
        taken.add(post)
        out["officeCode"], out["existingOffice"] = post, True
        report.linked += 1
    else:
        out["officeCode"], out["officeName"], out["singleton"] = f"ke/county/{number}/assembly/mca-unplaced/{slug(rec['displayName'])}", f"Member of the {name} County Assembly ({rec['ward']} ward, not matched)", False
        out["officeDescription"] = f"Elected 2022 for {rec['ward']} ({rec['constituency']}), IEBC ward code {rec['cawCode']}; the ward could not be matched to one geography unit."
        report.unplaced.append({"person": rec["displayName"], "ward": rec["ward"], "constituency": rec["constituency"], "bestScore": round(score, 3)})
    return out


def enrich_nominated(rec: dict, county: str, geo: Geo, report: Report, skip_people: set) -> dict | None:
    number = geo.numbers[county]
    personal = f"ke/person/{slug(rec['displayName'])}-mca-{county}"
    if personal in skip_people:
        return None
    seat = "mca-marginalised-groups" if rec["kind"] == "marginalised" else "mca-gender-top-up"
    report.nominated += 1
    return dict(rec, personCode=personal, officeCode=f"ke/county/{number}/assembly/{seat}", existingOffice=True, partyCode=best_party(geo, "", rec["partyName"]), institutionCode=f"ke/{county}/assembly")


def stage(conn, store, raw: Path, county: str, which: str, cache: dict, jurisdiction: str = "ke") -> Report:
    geo = Geo.load(conn)
    report = Report(county)
    number = geo.numbers[county]
    if "elected" not in cache:
        cache["elected"] = extract_all(conn, store, raw, "elected")
        cache["nominated"] = extract_all(conn, store, raw, "nominated")
    held = {r["code"]: r["display_name"] for r in conn.execute("SELECT o.code, p.display_name FROM governance.holders h JOIN governance.offices o ON o.id = h.office_id JOIN person.individuals p ON p.id = h.person_id WHERE h.is_current AND o.code LIKE %s", (f"ke/ward/{county}/%",)).fetchall()}
    skip_people = {r["code"] for r in conn.execute("SELECT p.code FROM governance.holders h JOIN governance.offices o ON o.id = h.office_id JOIN person.individuals p ON p.id = h.person_id WHERE o.code LIKE %s", (f"ke/county/{number}/assembly/mca-nominated/%",)).fetchall()}
    per: list[tuple[str, str, list]] = []
    taken: set = set()
    seen: set = set()
    for kind in ("elected", "nominated"):
        capture_id, result_id, recs = cache[kind]
        records = []
        for i, rec in enumerate(r for r in recs if r["countyCode"].zfill(3) == number):
            out = enrich_elected(rec, county, geo, held, report, taken) if kind == "elected" else enrich_nominated(rec, county, geo, report, skip_people)
            if out is None or out["personCode"] in seen and kind == "elected":
                continue
            if kind == "nominated" and (out["personCode"], out["officeCode"]) in seen:
                continue
            seen.add(out["personCode"] if kind == "elected" else (out["personCode"], out["officeCode"]))
            records.append((f"{kind}-{i}", out))
        per.append((capture_id, result_id, records))
    for name in STAGES[which]:
        mapping = substitute(yaml.safe_load((MAPPINGS / f"{name}.yml").read_text()), {"jurisdiction": jurisdiction})
        run_id = candidates.create_run(conn, f"county-assembly/{jurisdiction}/{county}/gazette/{name}", "v1", per[0][0], per[0][1])
        total = candidates.CandidateStats()
        done: set = set()
        for capture_id, result_id, records in per:
            subset = []
            for key, r in records:
                if name == "office" and r.get("existingOffice"):
                    continue
                if name == "membership" and not r.get("partyCode"):
                    continue
                ident = tuple(r.get(f) for f in KEYS[name])
                if None in ident or ident in done:
                    continue
                done.add(ident)
                subset.append((key, r))
            one = candidates.add_candidates(conn, run_id, mapping, subset, result_id, ["political_opinion"] if name == "membership" else [], [])
            for f in ("created", "unchanged", "superseding", "quarantined", "invalid"):
                setattr(total, f, getattr(total, f) + getattr(one, f))
            total.ids += one.ids
        candidates.finish_run(conn, run_id)
        report.runs[name], report.stats[name] = run_id, total
    conn.commit()
    return report


if __name__ == "__main__":
    import argparse

    from ..db import connect

    ap = argparse.ArgumentParser()
    ap.add_argument("raw_dir")
    ap.add_argument("counties", nargs="+")
    ap.add_argument("--stage", choices=["A", "B"], required=True)
    ap.add_argument("--store", default=".data/objects")
    ap.add_argument("--report", default=None)
    args = ap.parse_args()
    cache: dict = {}
    with connect() as conn:
        store = LocalDirectoryStore(conn, args.store)
        for county in args.counties:
            rep = stage(conn, store, Path(args.raw_dir), county, args.stage, cache)
            print(f"{county}: {rep.linked} linked, {len(rep.unplaced)} unplaced, {rep.corroborated} corroborated, {len(rep.different)} differ, {rep.nominated} nominated")
            for n, s in rep.stats.items():
                print(f"{n}: {s.created} new, {s.unchanged} unchanged, {s.invalid} invalid, {s.quarantined} quarantined (run {rep.runs[n]})")
            if args.report:
                p = Path(args.report)
                data = json.loads(p.read_text()) if p.exists() else {}
                data[county] = {"linked": rep.linked, "unplaced": rep.unplaced, "corroborated": rep.corroborated, "different": rep.different, "nominated": rep.nominated}
                p.write_text(json.dumps(data, indent=1))
