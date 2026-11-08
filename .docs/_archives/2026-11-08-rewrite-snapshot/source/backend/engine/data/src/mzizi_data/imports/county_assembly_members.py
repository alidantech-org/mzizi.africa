"""County assembly members (MCAs, 3rd Assembly 2022-2027) from the assembly sites' own member pages.

Pages come from `mca_harvest` (gated, robots-respecting, raw files with provenance). Stages, each promoted before the next because
later ones reference earlier ones by code:  A offices (only where the ward post does not exist) and individuals,  B holders and
party memberships.

Linking is by score and never guessed:
  * an elected member is linked to the ward post (`ke/ward/<county>/<constituency>/<ward>/mca`) only when exactly one ward of the county
    matches the published ward name (exact normalised name, or a close match with a clear margin); two members claiming one ward keep the
    best match and the other stays unlinked;
  * an unlinked member still gets a person and an office of their own (`.../assembly/mca-unplaced/<slug>`), reported;
  * nominated members get a post of their own (`.../assembly/mca-nominated/<slug>`) unless the page names a marginalised group;
  * the speaker of the assembly (not an elected member) is linked to the county's speaker post;
  * a party is linked only when a known party abbreviation or name appears with the member; otherwise no membership is staged.
A person code carries the county (`ke/person/<name>-mca-<county>`): a name alone never identifies a person (DEC-ENTITY-MATCHING); duplicates
against other records are flagged afterwards by `dedup person`.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from difflib import SequenceMatcher
from pathlib import Path

import psycopg
import yaml

from ..seedroot import MAPPINGS_ROOT
from .. import candidates, jobs, pipeline, register
from ..extractors import county_assembly_members as extractor  # noqa: F401  (registers the extractor)
from ..files import LocalDirectoryStore
from ..structure.effective import substitute

MAPPINGS = MAPPINGS_ROOT / "county-assembly"
STAGES = {"A": ["office", "individual"], "B": ["holder", "membership"]}
KEYS = {"office": ("officeCode",), "individual": ("personCode",), "holder": ("officeCode", "personCode"), "membership": ("partyCode", "personCode")}
OLD_TERM = re.compile(r"1st|first|2nd|second|prev|previous|2013|2017|past|former|archive", re.I)
MEMBER_URL = re.compile(r"member|mca|elected|nominat|ward|leadership|house|current", re.I)
NOT_MEMBERS = re.compile(r"clerk|secretar|board|committee|news|blog|20\d\d/\d\d", re.I)
MARGINALISED = re.compile(r"youth|disab|pwd|marginali[sz]ed|minorit|special interest", re.I)
SPEAKER = re.compile(r"(?<!deputy )(?<!deputy-)\bspeaker of the (?:county )?(?:assembly|house)\b|^speaker$|^the speaker$|^county assembly speaker$", re.I)
SKIP_WORDS = {"ward", "mca", "county", "the", "and", "of", "nominated", "hon"}


def slug(value: str) -> str:
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", value.lower().replace("'", "").replace("’", ""))).strip("-")


def tokens(value: str) -> frozenset:
    value = value.lower().replace("'", "").replace("\u2019", "")
    return frozenset(t for t in re.split(r"[^a-z0-9]+", value) if t and t not in SKIP_WORDS)


def compact(value: str) -> str:
    return "".join(sorted(tokens(value)) and [t for t in re.split(r"[^a-z0-9]+", value.lower().replace("'", "")) if t and t not in SKIP_WORDS])


def norm(value: str) -> str:
    value = re.sub(r"\b(ward|mca|county|the|and)\b", " ", value.lower())
    return re.sub(r"[^a-z0-9]", "", value.replace("'", "").replace("’", ""))


@dataclass
class Geo:
    """Wards and ward posts per county, plus the county's numbered assembly post codes."""
    wards: dict[str, dict[str, str]] = field(default_factory=dict)  # county slug -> normalised ward name -> ward post code
    numbers: dict[str, str] = field(default_factory=dict)  # county slug -> '047'
    counties: dict[str, str] = field(default_factory=dict)  # county slug -> county name
    parties: dict[str, str] = field(default_factory=dict)  # upper abbreviation / name -> party code
    ward_names: dict[str, str] = field(default_factory=dict)  # ward post code -> ward name

    @classmethod
    def load(cls, conn: psycopg.Connection) -> "Geo":
        g = cls()
        for r in conn.execute("SELECT substring(o.code from 11 for 3) AS n, u.code, u.name FROM governance.offices o JOIN geography.units u ON u.id = o.scope_geo_unit_id WHERE o.code ~ '^ke/county/[0-9]+/governor$'").fetchall():
            slug_ = r["code"].split("/")[1]
            g.numbers[slug_], g.counties[slug_] = r["n"], r["name"]
        posts = {r["code"] for r in conn.execute("SELECT code FROM governance.offices WHERE code LIKE 'ke/ward/%/mca'").fetchall()}
        for r in conn.execute("SELECT u.code, u.name FROM geography.units u JOIN reference.classifications l ON l.id = u.level_id WHERE u.is_current AND l.\"order\" = 3").fetchall():
            post = "ke/ward/" + r["code"][3:] + "/mca"
            if post in posts:
                county = r["code"].split("/")[1]
                g.wards.setdefault(county, {})[post] = post
                g.ward_names[post] = r["name"]
        for r in conn.execute("SELECT code, name, abbreviation FROM political.parties").fetchall():
            for key in (r["abbreviation"], r["name"]):
                if key:
                    g.parties[re.sub(r"[^A-Z0-9]", "", key.upper())] = r["code"]
        return g

    def match_ward(self, county: str, texts: list[str]) -> tuple[str | None, float, str | None]:
        """Best ward post for the candidate strings: (post code, score, raw text). A close match needs a clear margin over the runner-up."""
        pool = self.wards.get(county, {})
        scored: dict[str, tuple[float, str]] = {}
        for raw in texts:
            toks = tokens(raw)
            if not toks or len("".join(toks)) < 3:
                continue
            for name, post in pool.items():
                dbt = tokens(self.ward_names[post])
                if toks == dbt or compact(raw) == compact(self.ward_names[post]):
                    ratio = 1.0
                elif (toks <= dbt or dbt <= toks) and max(len(t) for t in (toks if len(toks) < len(dbt) else dbt)) >= 4:
                    ratio = 0.92
                else:
                    ratio = SequenceMatcher(None, " ".join(sorted(toks)), " ".join(sorted(dbt))).ratio()
                if ratio > scored.get(post, (0, ""))[0]:
                    scored[post] = (ratio, raw)
        ranked = sorted(scored.items(), key=lambda kv: -kv[1][0])
        if not ranked:
            return None, 0.0, None
        (post, (ratio, raw)) = ranked[0]
        runner = ranked[1][1][0] if len(ranked) > 1 else 0.0
        if ratio >= 0.999 and runner < 0.999 or (0.86 <= ratio and ratio - runner >= 0.05):
            return post, ratio, raw
        return None, ratio, raw

    def party(self, texts: list[str]) -> str | None:
        for text in texts:
            for token in re.findall(r"[A-Za-z][A-Za-z.\-]{1,30}", text):
                code = self.parties.get(re.sub(r"[^A-Z0-9]", "", token.upper()))
                if code and len(token) >= 2:
                    return code
        return None


def ward_candidates(record: dict) -> list[str]:
    texts = [record.get("inline") or ""] + record.get("context", [])[:3]
    found = []
    for text in texts:
        for m in re.finditer(r"([A-Za-z][A-Za-z'’/\-]*(?:\s+[A-Za-z][A-Za-z'’/\-]*){0,3})\s+ward\b", text, re.I):
            found.append(re.sub(r"^(?:and\s+)?(?:mca\s+)?", "", m.group(1).strip(), flags=re.I))
        for m in re.finditer(r"ward\s*[:\-]\s*([A-Za-z'’/\- ]{3,40})", text, re.I):
            found.append(m.group(1).strip())
        for m in re.finditer(r"\brep[;:]\s*([A-Za-z'\u2019/\- ]{3,40})", text, re.I):
            found.append(m.group(1).strip())
        for m in re.finditer(r"\bmca[,.]?\s+([A-Za-z'’/\- ]{3,40})", text, re.I):
            found.append(m.group(1).strip())
        if len(text.split()) <= 4:
            found.append(text.strip(" .,;"))
    return [f for f in found if f.strip()]


def classify(record: dict, county: str, geo: Geo, url: str) -> dict:
    texts = [record.get("inline") or ""] + record.get("context", [])[:3]
    blob = " | ".join(texts)
    nominated = bool(re.search(r"nomi?nat|special[- ]elect|special seat|\bfemale\b", blob, re.I)) or bool(re.search(r"nominat|special", url.lower()))
    post, score, raw = (None, 0.0, None) if nominated else geo.match_ward(county, ward_candidates(record))
    if not post and not nominated and re.search(r"\bpwd\b|disabilit|youth|women|gender|marginali", blob, re.I):
        nominated = True  # a seat described by the group it represents has no ward
    speaker = bool(SPEAKER.search(" ".join(t.strip(" .,;") for t in texts[:2]))) and not post
    return {"nominated": nominated, "wardPost": post, "wardScore": round(score, 3), "wardText": raw, "speaker": speaker, "marginalised": nominated and bool(MARGINALISED.search(blob)), "partyCode": geo.party(texts), "roleText": blob[:160]}


def select_pages(directory: Path) -> list[tuple[Path, str]]:
    pages = []
    for meta in sorted(directory.glob("*.provenance.json")):
        info = json.loads(meta.read_text())
        url = info["url"]
        path = re.sub(r"^https?://[^/]+", "", url)
        if path.strip("/") in ("", "index.php") or OLD_TERM.search(path) or NOT_MEMBERS.search(path):
            continue
        pages.append((Path(str(meta)[: -len(".provenance.json")]), url))
    pages.sort(key=lambda p: (not re.search(r"nominat|special", p[1], re.I), p[1]))  # seat-kind pages first: they say how the seat was filled
    return pages


@dataclass
class Result:
    county: str
    pages: int = 0
    people: int = 0
    linked: int = 0
    unlinked: int = 0
    nominated: int = 0
    speakers: int = 0
    runs: dict[str, str] = field(default_factory=dict)
    stats: dict = field(default_factory=dict)
    unmatched: list = field(default_factory=list)
    conflicts: list = field(default_factory=list)


def build(conn, store: LocalDirectoryStore, directory: Path, county: str, geo: Geo) -> tuple[Result, list[tuple[str, str, list[tuple[str, dict]]]]]:
    """Extracts every selected page and returns the enriched records per page: (capture id, extraction result id, [(key, record)])."""
    result = Result(county)
    name = geo.counties[county]
    number = geo.numbers[county]
    publisher_id = register.ensure_publisher(conn, f"ke-county-assembly-{county}", f"County Assembly of {name}", kind="institution", website_url=None)
    row = conn.execute("SELECT id::text AS id FROM reference.jurisdictions WHERE code = 'ke'").fetchone()
    handlers = {"extract": pipeline.extraction_handler(conn, store)}
    pages = select_pages(directory)
    taken: dict[str, str] = {}  # ward post -> person code
    seen_people: dict[str, dict] = {}
    per_page = []
    for data_path, url in pages:
        meta = json.loads(Path(str(data_path) + ".provenance.json").read_text())
        spec = register.DocumentSpec(publisher_id, f"{name} County Assembly member page {slug(url)[:60]}", "official_website", url=url, licence="Not confirmed (public member list on the assembly's official site; reuse terms unassessed)", citation=f"County Assembly of {name}, member list, retrieved {meta['retrieved_at'][:10]}.", jurisdiction_id=row["id"] if row else None)
        document_id, capture_id, ref = pipeline.ingest(conn, store, data_path.read_bytes(), f"{county}-{slug(url)[-40:]}.html", spec, url=url, tool="gated-fetch", mime_type="text/html")
        job_id, _ = pipeline.enqueue_extraction(conn, ref.version_id, "county-assembly-members", county, capture_id)
        conn.commit()
        while jobs.run_once(conn, handlers, worker="mca-import"):
            pass
        job = conn.execute("SELECT status, result_file_version_id::text AS fv FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
        if job["status"] != "succeeded":
            continue  # a page with no member blocks (menu, news) is simply not a member list
        extraction = pipeline.load_result(store, job["fv"])
        result.pages += 1
        records = []
        for segment in extraction.segments:
            rec = json.loads(segment.content)
            info = classify(rec, county, geo, url)
            key = norm(rec["name"])
            if key in seen_people:
                continue  # one record per person: the first page that shows them is their provenance
            if not (info["wardPost"] or info["nominated"] or info["speaker"] or re.search(r"\bmca\b", info["roleText"], re.I) or "member" in url.lower() or "mca" in url.lower()):
                continue
            personal = f"ke/person/{slug(rec['name'])}-mca-{county}"
            if any(v["personCode"] == personal for v in seen_people.values()):
                personal += f"-{slug(info['wardText'] or 'x')}"
            out = dict(rec, **info, personCode=personal, county=county, displayName=rec["name"])
            if info["speaker"]:
                out["officeCode"], out["existingOffice"] = f"ke/county/{number}/assembly/speaker", True
                result.speakers += 1
            elif info["wardPost"] and info["wardPost"] not in taken:
                taken[info["wardPost"]] = personal
                out["officeCode"], out["existingOffice"] = info["wardPost"], True
                result.linked += 1
            elif info["nominated"]:
                # Nominated seats come from the IEBC gazette (all 47 counties, seat kind and party stated): the gazette importer owns them.
                result.nominated += 1
                continue
            else:
                if info["wardPost"]:
                    result.conflicts.append({"person": rec["name"], "ward": info["wardPost"], "heldBy": taken[info["wardPost"]]})
                else:
                    result.unmatched.append({"person": rec["name"], "wardText": info["wardText"], "bestScore": info["wardScore"]})
                out["officeCode"], out["officeName"], out["singleton"] = f"ke/county/{number}/assembly/mca-unplaced/{slug(rec['name'])}", f"Member of the {name} County Assembly (ward not matched)", False
                result.unlinked += 1
            out["officeDescription"] = f"Seat as listed on the assembly site: {info['roleText'][:100]}" if not out.get("existingOffice") else None
            out["institutionCode"] = f"ke/{county}/assembly"
            seen_people[key] = out
            records.append((segment.key, out))
        per_page.append((capture_id, str(extraction.id), records))
    result.people = sum(len(r) for _, _, r in per_page)
    return result, per_page


def stage(conn, store, directory: Path, county: str, which: str, geo: Geo | None = None, jurisdiction: str = "ke") -> Result:
    geo = geo or Geo.load(conn)
    result, per_page = build(conn, store, directory, county, geo)
    if not per_page:
        return result
    for name in STAGES[which]:
        mapping = substitute(yaml.safe_load((MAPPINGS / f"{name}.yml").read_text()), {"jurisdiction": jurisdiction})
        run_id = candidates.create_run(conn, f"county-assembly/{jurisdiction}/{county}/3rd/{name}", "v1", per_page[0][0], per_page[0][1])
        total = candidates.CandidateStats()
        allowed = ["political_opinion"] if name == "membership" else []
        seen: set[tuple] = set()
        for _capture, result_id, records in per_page:
            subset = []
            for key, r in records:
                if name == "office" and r.get("existingOffice"):
                    continue
                if name == "membership" and not r.get("partyCode"):
                    continue
                ident = tuple(r.get(f) for f in KEYS[name])
                if None in ident or ident in seen:
                    continue
                seen.add(ident)
                subset.append((key, r))
            one = candidates.add_candidates(conn, run_id, mapping, subset, result_id, allowed, [])
            for f in ("created", "unchanged", "superseding", "quarantined", "invalid"):
                setattr(total, f, getattr(total, f) + getattr(one, f))
            total.ids += one.ids
        candidates.finish_run(conn, run_id)
        result.runs[name], result.stats[name] = run_id, total
    conn.commit()
    return result


def stage_clerks(conn, store, directory: Path, county: str, which: str, geo: Geo, jurisdiction: str = "ke") -> Result:
    """The clerk of the assembly from a harvested 'clerk' page (deputy clerks are ignored); holder on the county's clerk post."""
    result = Result(county)
    name, number = geo.counties[county], geo.numbers[county]
    publisher_id = register.ensure_publisher(conn, f"ke-county-assembly-{county}", f"County Assembly of {name}", kind="institution", website_url=None)
    row = conn.execute("SELECT id::text AS id FROM reference.jurisdictions WHERE code = 'ke'").fetchone()
    handlers = {"extract": pipeline.extraction_handler(conn, store)}
    per_page = []
    for meta in sorted(directory.glob("*.provenance.json")):
        info = json.loads(meta.read_text())
        url = info["url"]
        if not re.search(r"clerk", url, re.I) or re.search(r"deputy|message", url, re.I):
            continue
        data_path = Path(str(meta)[: -len(".provenance.json")])
        spec = register.DocumentSpec(publisher_id, f"{name} County Assembly clerk page {slug(url)[:60]}", "official_website", url=url, licence="Not confirmed (public page on the assembly's official site; reuse terms unassessed)", citation=f"County Assembly of {name}, clerk page, retrieved {info['retrieved_at'][:10]}.", jurisdiction_id=row["id"] if row else None)
        _doc, capture_id, ref = pipeline.ingest(conn, store, data_path.read_bytes(), f"{county}-clerk.html", spec, url=url, tool="gated-fetch", mime_type="text/html")
        job_id, _ = pipeline.enqueue_extraction(conn, ref.version_id, "county-assembly-members", f"clerk:{county}", capture_id)
        conn.commit()
        while jobs.run_once(conn, handlers, worker="mca-import"):
            pass
        job = conn.execute("SELECT status, result_file_version_id::text AS fv FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
        if job["status"] != "succeeded":
            continue
        extraction = pipeline.load_result(store, job["fv"])
        rec = json.loads(extraction.segments[0].content)
        out = dict(rec, displayName=rec["name"], personCode=f"ke/person/{slug(rec['name'])}-clerk-{county}", officeCode=f"ke/county/{number}/assembly/clerk", existingOffice=True, institutionCode=f"ke/{county}/assembly")
        per_page.append((capture_id, str(extraction.id), [("clerk", out)]))
        break
    if not per_page:
        return result
    result.people = 1
    for stage_name in STAGES[which]:
        if stage_name in ("office", "membership"):
            continue
        mapping = substitute(yaml.safe_load((MAPPINGS / f"{stage_name}.yml").read_text()), {"jurisdiction": jurisdiction})
        run_id = candidates.create_run(conn, f"county-assembly/{jurisdiction}/{county}/clerk/{stage_name}", "v1", per_page[0][0], per_page[0][1])
        one = candidates.add_candidates(conn, run_id, mapping, per_page[0][2], per_page[0][1], [], [])
        candidates.finish_run(conn, run_id)
        result.runs[stage_name], result.stats[stage_name] = run_id, one
    conn.commit()
    return result


if __name__ == "__main__":
    import argparse

    from ..db import connect

    ap = argparse.ArgumentParser()
    ap.add_argument("raw_dir")
    ap.add_argument("county")
    ap.add_argument("--stage", choices=["A", "B"], required=True)
    ap.add_argument("--clerks", action="store_true")
    ap.add_argument("--store", default=".data/objects")
    ap.add_argument("--report", default=None)
    args = ap.parse_args()
    with connect() as conn:
        _store = LocalDirectoryStore(conn, args.store)
        res = stage_clerks(conn, _store, Path(args.raw_dir) / args.county, args.county, args.stage, Geo.load(conn)) if args.clerks else stage(conn, _store, Path(args.raw_dir) / args.county, args.county, args.stage)
    print(f"{args.county}: {res.pages} pages, {res.people} people, {res.linked} linked, {res.nominated} nominated, {res.speakers} speaker, {res.unlinked} unlinked")
    for name, s in res.stats.items():
        print(f"{name}: {s.created} new, {s.unchanged} unchanged, {s.invalid} invalid, {s.quarantined} quarantined (run {res.runs[name]})")
    if args.report and not args.clerks:
        p = Path(args.report)
        data = json.loads(p.read_text()) if p.exists() else {}
        data[args.county] = {"pages": res.pages, "people": res.people, "linked": res.linked, "nominated": res.nominated, "speakers": res.speakers, "unlinked": res.unlinked, "unmatched": res.unmatched, "conflicts": res.conflicts}
        p.write_text(json.dumps(data, indent=1))
