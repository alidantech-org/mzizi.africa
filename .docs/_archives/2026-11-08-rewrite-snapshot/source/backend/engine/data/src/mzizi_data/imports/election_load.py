"""Stages candidates, seats, results and turnout for the 2013, 2017 and 2022 general elections, the 2017 fresh presidential election and the 2005 and 2010 referendums.

Reading is done by `election_results` (IEBC books) and the Wikipedia tables saved by `election_wiki`. This module resolves places, parties and
people, then stages groups in promotion order: classifications and elections, parties, people, seats, candidates, results, electorates (valid and
rejected votes per seat), referendum questions, options and results.

People are matched, never merged on a name alone (DEC-ENTITY-MATCHING): see `PersonIndex`. A party the register does not hold is created inactive from the book.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from pathlib import Path

from bs4 import BeautifulSoup
from rapidfuzz import fuzz

from .. import statload
from ..geo_link import GeoResolver, norm
from ..statload import Group, ref
from . import election_results as ER
from . import iebc_register as REG

RAW = Path(__file__).resolve().parents[7] / ".data/raw"
LICENCE_IEBC = "Unassessed (published on the IEBC website; reuse terms not yet checked)"
LICENCE_WIKI = "CC BY-SA 4.0 (Wikipedia text, read through the MediaWiki API with page and revision recorded)"
IEBC = ("ke-iebc", "Independent Electoral and Boundaries Commission", "https://www.iebc.or.ke")
WIKI = ("wikimedia", "Wikimedia Foundation (Wikipedia)", "https://en.wikipedia.org")
LEVEL = {"national": ("elections/result-level/national", "national", 3), "county": ("elections/result-level/county", "county", 2), "constituency": ("elections/result-level/constituency", "constituency", 1), "ward": ("elections/result-level/ward", "ward", 0)}
KIND_LABEL = {"president": "President", "governor": "Governor", "senator": "Senator", "woman_rep": "County Woman Representative", "mp": "Member of the National Assembly"}
ELECTIONS = {
    "2013": ("ke/election/2013-03-04/general", "2013 General Election", "2013-03-04", "elections/election-type/general"),
    "2017": ("ke/election/2017-08-08/general", "2017 General Election", "2017-08-08", "elections/election-type/general"),
    "2017r": ("ke/election/2017-10-26/presidential-fresh", "2017 Fresh Presidential Election", "2017-10-26", "elections/election-type/fresh-presidential"),
    "2022": ("ke/election/2022-08-09/general", "2022 General Election", "2022-08-09", "elections/election-type/general"),
    "2010": ("ke/election/2010-08-04/referendum", "2010 Constitutional Referendum", "2010-08-04", "elections/election-type/referendum"),
    "2005": ("ke/election/2005-11-21/referendum", "2005 Constitutional Referendum", "2005-11-21", "elections/election-type/referendum"),
}
NEW_TYPES = {"elections/election-type/fresh-presidential": "fresh presidential election", "elections/election-type/referendum": "referendum"}


CONST_ALIASES = {27: "ke/garissa/dujis", 58: "ke/meru/cental-imenti", 61: "ke/tharaka/nithi", 65: "ke/embu/gachoka", 66: "ke/embu/siakago", 98: "ke/nyeri/mukurweni", 191: "ke/bomet/buret"}


def slug(text: str) -> str:
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", text.lower().replace("'", "").replace("’", ""))).strip("-")


def tokens(name: str) -> list[str]:
    return [t for t in re.sub(r"[^a-z0-9 ]", " ", name.lower()).split() if t]


def name_score(a: str, b: str) -> float:
    ta, tb = tokens(a), tokens(b)
    if len(ta) < 2 or len(tb) < 2:
        return 100.0 * (ta == tb and bool(ta))
    return fuzz.token_set_ratio(" ".join(sorted(ta)), " ".join(sorted(tb)))


# --------------------------------------------------------------------------------------------------------------- wikipedia tables

def wiki_tables(path: Path) -> list[list[list[str]]]:
    html = json.loads(path.read_text())["parse"]["text"]
    soup = BeautifulSoup(html, "lxml")
    out = []
    for t in soup.select("table.wikitable"):
        rows = []
        for tr in t.select("tr"):
            cells = [re.sub(r"\[[^\]]*\]", "", c.get_text(" ", strip=True)).strip() for c in tr.find_all(["td", "th"])]
            if cells:
                rows.append(cells)
        out.append(rows)
    return out


def find_table(tables, *needles):
    for t in tables:
        head = " ".join(" ".join(r) for r in t[:3]).lower()
        if all(n.lower() in head for n in needles):
            return t
    return None


def wiki_file(stem: str) -> Path:
    return next(p for p in sorted((RAW / "wiki-elections").glob(f"*{stem}*.json")) if not p.name.endswith(".provenance.json"))


# --------------------------------------------------------------------------------------------------------------- parties

class PartyIndex:
    def __init__(self, conn):
        rows = conn.execute("SELECT code, name, abbreviation FROM political.parties").fetchall()
        self.rows = [(r["code"], r["name"], r["abbreviation"] or "") for r in rows]
        self.by_abbr = {a.lower(): c for c, _n, a in self.rows if a}
        self.by_name = {self.key(n): c for c, n, _a in self.rows}
        self.created: dict[str, dict] = {}

    @staticmethod
    def key(name: str) -> str:
        t = re.sub(r"\b(the|party|of|for|and|kenya|k)\b", " ", name.lower().replace("&", " and "))
        return re.sub(r"[^a-z0-9]", "", t)

    def resolve(self, name: str | None, abbr: str | None = None) -> tuple[str | None, str]:
        """(party code, how). A party the register lacks is created (inactive) once, named as the book names it."""
        name = re.sub(r"\s+", " ", (name or "").replace(" - ", "-").replace("- ", "-")).strip()
        if abbr and abbr.upper() == "IND" or re.search(r"independent", name, re.I) and not re.search(r"party", name, re.I):
            return self.by_abbr.get("ind", "ke/party/ind"), "independent"
        if abbr and abbr.lower() in self.by_abbr:
            return self.by_abbr[abbr.lower()], "abbreviation"
        for cand in (name.lower(), name.lower().replace("_", "-"), name.lower().replace(" ", "-")):
            if cand in self.by_abbr:
                return self.by_abbr[cand], "abbreviation as name"
        k = self.key(name)
        if k and k in self.by_name:
            return self.by_name[k], "name"
        best, score = None, 0.0
        for code, n, a in self.rows:
            s = fuzz.ratio(k, self.key(n)) if k else 0
            if s > score:
                best, score = code, s
        if best and score >= 90:
            return best, f"fuzzy {score:.0f}"
        if not name:
            return None, "unnamed"
        for code, info in self.created.items():
            if fuzz.ratio(k, self.key(info["name"])) >= 93:
                return code, "created earlier"
        code = f"ke/party/{slug(name)}"[:200]
        if code in {c for c, _n, _a in self.rows}:
            return code, "existing code"
        self.created[code] = {"name": name[:300], "abbr": abbr[:40] if abbr else None}
        return code, "created"


# --------------------------------------------------------------------------------------------------------------- people

class PersonIndex:
    """Existing people (by the seat they hold) and people created in this run. Link rules: name score at least 90 on the same seat kind and place, or at least 95 in the same county with the same party; never a name alone."""

    def __init__(self, conn, units_by_slug: dict[str, str], county_of: dict[str, str]):
        self.county_of = county_of
        self.codes = {r["code"] for r in conn.execute("SELECT code FROM person.individuals")}
        self.people: list[dict] = []  # {code, name, kind, unit, county, party, existing}
        rows = conn.execute(
            """SELECT i.code AS person, i.display_name, o.code AS office, p.code AS party
                 FROM governance.holders h JOIN person.individuals i ON i.id = h.person_id JOIN governance.offices o ON o.id = h.office_id
                 LEFT JOIN political.memberships m ON m.person_id = i.id LEFT JOIN political.parties p ON p.id = m.party_id"""
        ).fetchall()
        for r in rows:
            m = re.match(r"ke/national-assembly/([^/]+)$", r["office"])
            s = re.match(r"ke/senate/([^/]+)$", r["office"])
            kind, unit = (("mp", units_by_slug.get(f"c:{m.group(1)}")) if m else ("senator", units_by_slug.get(f"k:{s.group(1)}")) if s else (None, None))
            self.people.append({"code": r["person"], "name": r["display_name"], "kind": kind, "unit": unit, "county": county_of.get(unit or ""), "party": r["party"], "existing": True})
        self.flags: list[dict] = []
        self.new_codes: set[str] = set()

    def match(self, name: str, kind: str, unit: str | None, party: str | None) -> tuple[str, bool]:
        """(person code, is_new)."""
        county = self.county_of.get(unit or "", unit)
        best, best_score = None, 0.0
        near = []
        mine = set(tokens(name))
        for p in self.people:
            if not mine & set(tokens(p["name"])):
                continue
            s = name_score(name, p["name"])
            if s < 90:
                continue
            same_seat = p["kind"] == kind and p["unit"] == unit and unit is not None
            same_county_party = s >= 95 and p["county"] and p["county"] == county and party and p["party"] == party
            same_president = kind == "president" and p["kind"] == "president" and s >= 95
            if same_seat or same_county_party or same_president:
                if s > best_score:
                    best, best_score = p, s
            else:
                near.append((p, s))
        if best:
            return best["code"], False
        code = f"ke/person/{slug(name)}"
        if code in self.codes:
            code = f"ke/person/{slug(name)}-{slug((unit or kind).removeprefix('ke/'))}-{kind.replace('_', '-')}"[:190]
        n = 2
        base = code
        while code in self.codes:
            code, n = f"{base}-{n}", n + 1
        self.codes.add(code)
        self.new_codes.add(code)
        rec = {"code": code, "name": name, "kind": kind, "unit": unit, "county": county, "party": party, "existing": False}
        self.people.append(rec)
        for p, s in near:
            self.flags.append({"new": code, "other": p["code"], "score": s, "reason": f"name agrees ({s:.0f}) but seat or place differs ({kind} {unit} against {p['kind']} {p['unit']})"})
        return code, True


# --------------------------------------------------------------------------------------------------------------- context

@dataclass
class Context:
    conn: object
    resolver: GeoResolver
    unit_of_county: dict[int, str]
    unit_of_const: dict[int, str]
    unit_names: dict[str, str]
    offices: set[str]
    parties: PartyIndex
    people: PersonIndex
    jur: dict
    notes: list[str] = field(default_factory=list)
    unlinked: list[str] = field(default_factory=list)


def build_context(conn, jurisdiction: str = "ke") -> Context:
    resolver = GeoResolver(conn, jurisdiction)
    cty = REG.parse(REG.read_pages(next((RAW / "iebc-voters").glob("c00fd7ea15c8*.pdf")).read_bytes()), "county")
    con = REG.parse(REG.read_pages(next((RAW / "iebc-voters").glob("08900*.pdf")).read_bytes()), "constituency")
    uc, uk = {}, {}
    for r, unit in REG.link(cty, resolver, {})[0]:
        uc[int(r.county_code)] = unit
    for r, unit in REG.link(con, resolver, {})[0]:
        uk[int(r.const_code)] = unit
    # constituencies the geography tree spells differently (IEBC code -> unit); Buret sits under Bomet in the tree although the IEBC lists Bureti in Kericho
    for code, unit in CONST_ALIASES.items():
        if code not in uk and conn.execute("SELECT 1 FROM geography.units WHERE code = %s AND is_current", (unit,)).fetchone():
            uk[code] = unit
    names = {r["code"]: r["name"] for r in conn.execute("SELECT code, name FROM geography.units WHERE is_current")}
    by_slug, county_of = {}, {}
    for code in uk.values():
        by_slug[f"c:{slug(names[code])}"] = code
        parent = "/".join(code.split("/")[:-1])
        county_of[code] = parent
    for code in uc.values():
        by_slug[f"k:{slug(names[code])}"] = code
        county_of[code] = code
    offices = {r["code"] for r in conn.execute("SELECT code FROM governance.offices")}
    return Context(conn, resolver, uc, uk, names, offices, PartyIndex(conn), PersonIndex(conn, by_slug, county_of), ref("reference.jurisdictions", code=jurisdiction))


# --------------------------------------------------------------------------------------------------------------- row builders

class Rows:
    """Rows of one source, deduplicated by natural key, grouped for staging in promotion order."""

    def __init__(self, ctx: Context):
        self.ctx = ctx
        self.persons: dict[str, dict] = {}
        self.seats: dict[tuple, dict] = {}
        self.candidates: dict[tuple, dict] = {}
        self.results: list[dict] = []
        self.electorates: list[dict] = []
        self.holders: list[dict] = []
        self.seat_votes: dict[tuple, list] = {}

    def seat(self, key: str, kind: str, unit: str | None, county_no: int | None, ek: str, page: int | None = None, seg: str = "") -> tuple[str, dict]:
        ec, ename, edate, _t = ELECTIONS[ek]
        scode = f"{ec}/{kind.replace('_', '-')}/{(unit or 'ke').removeprefix('ke/') if unit else 'ke'}"
        if kind == "president":
            scode = f"{ec}/president"
        if (ek, scode) not in self.seats:
            office = None
            if kind == "president" and "ke/presidency/president" in self.ctx.offices:
                office = "ke/presidency/president"
            elif kind == "governor" and county_no and f"ke/county/{county_no:03d}/governor" in self.ctx.offices:
                office = f"ke/county/{county_no:03d}/governor"
            elif kind == "senator" and unit:
                c = f"ke/senate/{slug(self.ctx.unit_names.get(unit, ''))}"
                office = c if c in self.ctx.offices else None
            elif kind == "mp" and unit:
                c = f"ke/national-assembly/{slug(self.ctx.unit_names.get(unit, ''))}"
                office = c if c in self.ctx.offices else None
            row = {"_seg": f"seat-{ek}-{scode}"[:170], "electionId": ref("electoral.elections", code=ec), "code": scode, "positions": 1}
            if unit:
                row["geoUnitId"] = ref("geography.units", code=unit)
            elif kind == "president":
                row["geoUnitId"] = ref("geography.units", code="ke")
            if office:
                row["officeId"] = ref("governance.offices", code=office)
            self.seats[(ek, scode)] = row
        return scode, self.seats[(ek, scode)]

    def person(self, name: str, kind: str, unit: str | None, party_code: str | None) -> str:
        code, new = self.ctx.people.match(name, kind, unit, party_code)
        if new:
            parts = name.split()
            self.persons[code] = {"_seg": f"person-{code}"[:170], "code": code, "displayName": name[:300], "givenName": " ".join(parts[:-1])[:300] or None, "familyName": parts[-1][:300], "lifeStatus": "unknown"}
        return code

    def candidate(self, ek: str, scode: str, kind: str, unit: str | None, name: str, party_name: str | None, abbr: str | None, votes: int | None, level: str, geo_unit: str | None, extra_seg: str = "") -> int | None:
        pcode, how = self.ctx.parties.resolve(party_name, abbr)
        person = self.person(name, kind, unit if kind not in ("president",) else None, pcode)
        key = (ek, scode, person)
        indep = pcode == "ke/party/ind" or how == "independent"
        if key not in self.candidates:
            row = {"_seg": f"cand-{ek}-{scode}-{person}"[:170], "seatId": ref("electoral.seats", electionId=ref("electoral.elections", code=ELECTIONS[ek][0]), code=scode), "personId": ref("person.individuals", code=person), "nominationStatus": "cleared", "isIndependent": bool(indep)}
            if pcode:
                row["partyId"] = ref("political.parties", code=pcode)
            self.candidates[key] = row
        if votes is not None:
            self.results.append({"_seg": f"res-{ek}-{scode}-{person}-{level}-{geo_unit or 'ke'}"[:170], "ek": ek, "scode": scode, "person": person, "votes": votes, "level": level, "geo": geo_unit})
        return votes


def finalise_results(rows: Rows, winners: dict[tuple, int], annulled: set[str] | None = None) -> list[dict]:
    """Result rows with is_winner and rank (highest valid votes in the seat and level; one winner per seat at the seat's own level)."""
    by: dict[tuple, list[dict]] = {}
    for r in rows.results:
        by.setdefault((r["ek"], r["scode"], r["level"], r["geo"]), []).append(r)
    out = []
    for (ek, scode, level, geo), rs in by.items():
        rs.sort(key=lambda r: -r["votes"])
        for rank, r in enumerate(rs, 1):
            win = rank == 1 and rs[0]["votes"] > (rs[1]["votes"] if len(rs) > 1 else -1)
            if annulled and scode in annulled:
                win = False
            row = {
                "_seg": r["_seg"],
                "candidateId": ref("electoral.candidates", seatId=ref("electoral.seats", electionId=ref("electoral.elections", code=ELECTIONS[ek][0]), code=scode), personId=ref("person.individuals", code=r["person"])),
                "seatId": ref("electoral.seats", electionId=ref("electoral.elections", code=ELECTIONS[ek][0]), code=scode),
                "resultLevelId": ref("reference.classifications", jurisdictionId=rows.ctx.jur, code=LEVEL[level][0]),
                "votes": r["votes"], "isWinner": bool(win), "rank": rank,
            }
            if geo:
                row["geoUnitId"] = ref("geography.units", code=geo)
            out.append(row)
    return out


# --------------------------------------------------------------------------------------------------------------- source readers

def wiki_president_parties(path: Path) -> dict[str, tuple[str, str]]:
    """Wikipedia's presidential table: candidate name -> (party or coalition as listed, votes). Source of the party text for presidential candidates."""
    t = find_table(wiki_tables(path), "Candidate", "Running mate")
    out = {}
    for r in t[1:]:
        if len(r) >= 5 and re.fullmatch(r"[\d,]+", r[-2].replace(" ", "")) and r[0] not in ("Total", "Valid votes"):
            out[r[-5] if len(r) >= 6 else r[0]] = (r[-3], r[-2])
    return out


def party_for(name: str, table: dict[str, tuple[str, str]]) -> str | None:
    best = max(table.items(), key=lambda kv: name_score(name, kv[0]), default=None)
    return best[1][0] if best and name_score(name, best[0]) >= 80 else None


def num(cell: str) -> int | None:
    c = cell.replace(",", "").strip()
    if c in ("-", "–", ""):
        return 0
    return int(c) if c.isdigit() else None


def county_unit(ctx: Context, code: int) -> str | None:
    return ctx.unit_of_county.get(code)


def president_county_rows(ctx: Context, rows: Rows, ek: str, source_rows: list[dict], names: list[str], parties: dict, label: str) -> dict:
    """Presidential county rows: cells = registered, 8 candidates, valid, rejected. Rows that do not add up are held back and counted."""
    held, done = [], 0
    scode, _ = rows.seat("", "president", None, None, ek)
    for r in source_rows:
        cells = [num(c) for c in r["cells"]]
        if len(cells) < 11 or any(c is None for c in cells):
            held.append(f"{r['county']}: figures not readable")
            continue
        reg, cands, valid, rej = cells[0], cells[1:9], cells[9], cells[10]
        if sum(cands) != valid:
            held.append(f"{r['county']}: candidates add to {sum(cands):,}, valid votes {valid:,}")
            continue
        unit = ctx.unit_of_county.get(r["no"]) if r.get("no") else ctx.resolver.county(r["county"].title().replace(" Nithi", "-Nithi"))
        if not unit and r.get("index"):
            unit = ctx.unit_of_county.get(r["index"])
        if not unit:
            held.append(f"{r['county']}: no county unit")
            continue
        for nm, v in zip(names, cands):
            rows.candidate(ek, scode, "president", None, nm, parties.get(nm), None, v, "county", unit)
        rows.electorates.append({"_seg": f"elec-{ek}-pres-{unit}", "ek": ek, "scode": scode, "geo": unit, "level": "county", "registered": reg, "valid": valid, "rejected": rej, "cast": valid + rej, "label": label})
        done += 1
    return {"done": done, "held": held}


def load_2017_report(ctx: Context, rows: Rows, pdf: str, wiki17: Path) -> dict:
    L = ER.read_text(pdf)
    report: dict = {"checks": [], "held": []}
    table = wiki_president_parties(wiki17)
    names, parties = ER.PRES17, {n: party_for(n, table) for n in ER.PRES17}
    aug = ER.parse_2017_pres_aug(ER.section(L, "5.1 RESULTS OF THE 8TH", "5.2 RESULTS OF THE 26TH"))
    src = [{"no": r["no"], "county": r["county"], "cells": r["cells"]} for r in aug if r["no"] <= 47]
    rep = president_county_rows(ctx, rows, "2017", src, names, parties, "IEBC 2017 General Election Report, presidential results by county (8 August)")
    report["president_aug"] = rep
    fresh = ER.parse_2017_pres_fresh(ER.section(L, "5.2 RESULTS OF THE 26TH", "5.3 MEMBER"))
    src = []
    for i, r in enumerate([f for f in fresh if f["county"] not in ("NATIONAL", "DIASPORA")], 1):
        src.append({"index": i, "county": r["county"], "cells": r["cells"]})
    # the fresh election table lists counties in code order; a row is used only when its name agrees with the county at that position
    ok = []
    for r in src:
        unit = ctx.unit_of_county.get(r["index"])
        if unit and ctx.resolver.county(r["county"].title().replace("Tharaka - Nithi", "Tharaka-Nithi")) in (unit, None):
            ok.append(r)
        else:
            report["held"].append(f"fresh presidential {r['county']}: position {r['index']} does not agree with the county list")
    rep = president_county_rows(ctx, rows, "2017r", ok, names, parties, "IEBC 2017 General Election Report, fresh presidential election results by county (26 October)")
    report["president_fresh"] = rep
    # member of the National Assembly
    con = REG.parse(REG.read_pages(next((RAW / "iebc-voters").glob("08900*.pdf")).read_bytes()), "constituency")
    cn = {int(r.const_code): r.constituency for r in con.rows}
    mp = ER.parse_2017_mp(ER.section(L, "5.3 MEMBER OF NATIONAL", "5.4 COUNTY WOMAN"))
    for kind, h, nx in (("woman_rep", "5.4 COUNTY WOMAN", "5.5 SENATE"), ("senator", "5.5 SENATE", "5.6 GOVERNOR"), ("governor", "5.6 GOVERNOR", "5.7 MEMBER")):
        recs = ER.parse_2017_county_contest(ER.section(L, h, nx), kind)
        add_contest(ctx, rows, "2017", kind, recs, report)
    add_contest(ctx, rows, "2017", "mp", mp, report)
    return report


def add_contest(ctx: Context, rows: Rows, ek: str, kind: str, recs: list, report: dict, source_title: str = "") -> None:
    """Candidate and result rows for a seat kind; a seat's valid votes are the candidates' sum and are recorded beside the published total when there is one."""
    seats: dict[str, list] = {}
    for r in recs:
        unit = ctx.unit_of_const.get(int(r.constituency_code)) if kind == "mp" else ctx.unit_of_county.get(int(r.county_code))
        if not unit:
            ctx.unlinked.append(f"{ek} {kind} {r.county_code}/{r.constituency_code or ''}: no geography unit")
            continue
        seats.setdefault(unit, []).append(r)
    level = "constituency" if kind == "mp" else "county"
    for unit, rs in seats.items():
        county_no = int(rs[0].county_code)
        scode, _ = rows.seat("", kind, unit, county_no if kind == "governor" else None, ek)
        for r in rs:
            rows.candidate(ek, scode, kind, unit, r.name, r.party_name, r.party_abbr, r.votes, level, unit)
        total = sum(r.votes for r in rs)
        rows.electorates.append({"_seg": f"elec-{ek}-{kind}-{unit}", "ek": ek, "scode": scode, "geo": unit, "level": level, "valid": total, "label": source_title or f"results book, {KIND_LABEL[kind]}"})
    report.setdefault("seats", {})[f"{ek}/{kind}"] = len(seats)
    report.setdefault("candidates", {})[f"{ek}/{kind}"] = sum(len(v) for v in seats.values())


def load_2013_book(ctx: Context, rows: Rows, pdf: str, wiki13: Path) -> dict:
    L = ER.read_text(pdf)
    report: dict = {"checks_failed": [], "checks_passed": 0}
    table = wiki_president_parties(wiki13)
    names, parties = ER.PRES13, {n: party_for(n, table) for n in ER.PRES13}
    d = ER.parse_2013_president(L[4073:5070])
    scode, _ = rows.seat("", "president", None, None, "2013")
    held = []
    county_sum = {}
    for c in d["constituencies"]:
        v = ER.nums(c["cells"])
        unit = ctx.unit_of_const.get(int(c["code"]))
        if not unit or sum(v[:8]) != v[8] or v[8] + v[9] != v[10]:
            held.append(f"constituency {c['code']} {c['name']}: {'no unit' if not unit else 'figures do not add'}")
            continue
        for nm, x in zip(names, v[:8]):
            rows.candidate("2013", scode, "president", None, nm, parties.get(nm), None, x, "constituency", unit)
        rows.electorates.append({"_seg": f"elec-2013-pres-{unit}", "ek": "2013", "scode": scode, "geo": unit, "level": "constituency", "registered": v[11], "valid": v[8], "rejected": v[9], "cast": v[10], "label": "IEBC 2013 election data, presidential results by constituency"})
        county_sum[c["county_code"]] = county_sum.get(c["county_code"], 0) + v[8]
    for c in d["counties"]:
        v = ER.nums(c["cells"])
        unit = ctx.unit_of_county.get(int(c["county_code"]))
        if not unit or sum(v[:8]) != v[8] or v[8] + v[9] != v[10]:
            held.append(f"county {c['county_code']} {c['county']}: {'no unit' if not unit else 'figures do not add'}")
            continue
        for nm, x in zip(names, v[:8]):
            rows.candidate("2013", scode, "president", None, nm, parties.get(nm), None, x, "county", unit)
        rows.electorates.append({"_seg": f"elec-2013-pres-{unit}", "ek": "2013", "scode": scode, "geo": unit, "level": "county", "registered": v[11], "valid": v[8], "rejected": v[9], "cast": v[10], "label": "IEBC 2013 election data, presidential results by county"})
        if county_sum.get(c["county_code"]) not in (None, v[8]):
            held.append(f"county {c['county']}: constituencies add to {county_sum[c['county_code']]:,}, county total {v[8]:,} (both kept, flagged)")
    report["president_held"] = held
    # contests
    con = REG.parse(REG.read_pages(next((RAW / "iebc-voters").glob("08900*.pdf")).read_bytes()), "constituency")
    cn = {int(r.const_code): r.constituency for r in con.rows}
    mp, problems, totals = ER.parse_2013_mp_words(ER.read_words(pdf, 89, 194), 89, cn)
    passed, failed = ER.check_totals(mp, totals, "constituency")
    report["mp"] = {"candidates": len(mp), "problems": problems, "passed": len(passed), "failed": failed}
    add_contest(ctx, rows, "2013", "mp", mp, report)
    for kind, a, b in (("woman_rep", 11412, 12229), ("senator", 12229, 13022), ("governor", 13022, 13719)):
        recs, totals = ER.parse_2013(L[a:b], kind)
        passed, failed = ER.check_totals(recs, totals, "county")
        report[kind] = {"candidates": len(recs), "passed": len(passed), "failed": failed}
        add_contest(ctx, rows, "2013", kind, recs, report)
    return report


def load_2022(ctx: Context, rows: Rows, wiki22: Path) -> dict:
    tables = wiki_tables(wiki22)
    report: dict = {"held": []}
    pres = find_table(tables, "Candidate", "Running mate")
    parties = {}
    names = []
    for r in pres[1:]:
        if len(r) >= 5 and re.fullmatch(r"[\d,]+", r[-2]) and r[-5] not in ("Total",):
            names.append(r[-5])
            parties[r[-5]] = r[-3]
    county = find_table(tables, "Registered voters", "Invalid", "Valid votes")
    head = county[0]
    cols = {h: i for i, h in enumerate(head)}
    cand_cols = [(nm, cols[k]) for k in head if k not in ("Code", "County", "Registered voters", "Total votes", "Invalid/ blank", "Valid votes") for nm in [next((n for n in names if k.lower() in n.lower()), None)] if nm]
    scode, _ = rows.seat("", "president", None, None, "2022")
    done = 0
    for r in county[1:]:
        if not r[0].isdigit() or int(r[0]) > 47:
            continue
        unit = ctx.unit_of_county.get(int(r[0]))
        vals = {k: num(r[i]) for k, i in cols.items() if i < len(r)}
        cands = [(nm, num(r[i])) for nm, i in cand_cols]
        valid = vals.get("Valid votes")
        if not unit or valid is None or any(v is None for _n, v in cands) or abs(sum(v for _n, v in cands) - valid) > max(50, valid * 0.03):
            report["held"].append(f"county {r[0]} {r[1]}: figures missing or do not add")
            continue
        if sum(v for _n, v in cands) != valid:
            report.setdefault("warnings", []).append(f"county {r[0]} {r[1]}: candidates add to {sum(v for _n, v in cands):,}, table valid votes {valid:,} (source differs, kept as unverified)")
        for nm, v in cands:
            rows.candidate("2022", scode, "president", None, nm, parties.get(nm), None, v, "county", unit)
        rej = vals.get("Invalid/ blank")
        rows.electorates.append({"_seg": f"elec-2022-pres-{unit}", "ek": "2022", "scode": scode, "geo": unit, "level": "county", "registered": vals.get("Registered voters"), "valid": valid, "rejected": rej, "cast": vals.get("Total votes"), "label": "Wikipedia (from IEBC), 2022 presidential results by county"})
        done += 1
    report["president_counties"] = done
    gov = find_table(tables, "Governor", "Results")
    won = 0
    if gov:
        for gi, r in enumerate([x for x in gov[1:] if len(x) >= 4], 1):
            cname, winner, party_abbr, results = r[0], r[1], r[2], r[3]
            unit = ctx.unit_of_county.get(gi)
            if not unit:
                report["held"].append(f"governor {cname}: no county unit")
                continue
            county_no = gi
            scode, _ = rows.seat("", "governor", unit, county_no, "2022")
            party_name = None if party_abbr.lower() == "independent" else party_abbr
            pc = rows.candidate("2022", scode, "governor", unit, winner, party_name, party_abbr if party_abbr.lower() != "independent" else "IND", None, "county", unit)
            m = re.search(r";\s*([^;%]+?)\s+[\d.]+%\s*\(([^)]*)\)", results)
            if m:
                rows.candidate("2022", scode, "governor", unit, m.group(1).strip(), m.group(2), None, None, "county", unit)
            office = f"ke/county/{county_no:03d}/governor" if county_no else None
            if office in ctx.offices:
                pcode = next(k[2] for k in rows.candidates if k[0] == "2022" and k[1] == scode)  # the winner is added first
                rows.holders.append({"_seg": f"holder-governor-{unit}", "officeId": ref("governance.offices", code=office), "personId": ref("person.individuals", code=pcode), "status": "substantive", "validFrom": "2022-08-09", "validFromPrecision": "month"})
            won += 1
    report["governors"] = won
    return report


def load_referendums(ctx: Context, rows: Rows, wiki10: Path, wiki05: Path) -> dict:
    """National results of the 2010 and 2005 constitutional referendums (Wikipedia tables). Provinces are not geography units of the present tree and are not loaded."""
    report: dict = {}
    for ek, path in (("2010", wiki10), ("2005", wiki05)):
        tables = wiki_tables(path)
        t = find_table(tables, "Choice", "Votes")
        yes = no = None
        for r in t:
            if r[0].lower() in ("yes", "for"):
                yes = num(r[1])
            if r[0].lower() in ("no", "against"):
                no = num(r[1])
        info = {"yes": yes, "no": no}
        if ek == "2010":
            for r in t:
                if r[0].startswith("Invalid"):
                    info["invalid"] = num(r[1])
                if r[0].startswith("Registered"):
                    info["registered"] = num(r[1])
        rows.referendums = getattr(rows, "referendums", {})
        rows.referendums[ek] = info
        report[ek] = info
    return report


# --------------------------------------------------------------------------------------------------------------- staging

def _source(conn, store, path: Path, title: str, publisher: tuple, licence: str, mime: str, citation_prefix: str):
    meta = json.loads(Path(str(path) + ".provenance.json").read_text())
    pub = statload.publisher(conn, publisher[0], publisher[1], website_url=publisher[2])
    return statload.preserve(conn, store, path.read_bytes(), path.name.split("-", 1)[1].replace("%20", "_"), pub, title, meta["url"], licence, f"{citation_prefix} Retrieved {meta['retrieved_at'][:10]}.", "gated-fetch", mime, kind="dataset", jurisdiction="ke")


def _groups(ctx: Context, rows: Rows, eks: list[str], staged_parties: set[str], with_levels: bool) -> list[Group]:
    jur = ctx.jur
    groups: list[Group] = []
    cls = []
    if with_levels:
        cls += [{"jurisdictionId": jur, "scheme": "elections/result-level", "code": LEVEL["national"][0], "label": "national", "order": LEVEL["national"][2]}]
        cls += [{"jurisdictionId": jur, "scheme": "elections/election-type", "code": c, "label": label, "order": 5} for c, label in NEW_TYPES.items()]
        groups.append(Group("classification", "reference.classifications", ["jurisdictionId", "scheme", "code"], cls))
    existing = {r["code"] for r in ctx.conn.execute("SELECT code FROM electoral.elections")}
    elections = [
        {"_seg": f"election-{ek}", "jurisdictionId": jur, "code": c, "name": n, "typeId": ref("reference.classifications", jurisdictionId=jur, code=t), "heldDate": d, "status": "completed", "administeringInstitutionId": ref("governance.institutions", code="ke/electoral-commission", jurisdictionId=jur)}
        for ek in eks for c, n, d, t in [ELECTIONS[ek]] if c not in existing
    ]
    if elections:
        groups.append(Group("election", "electoral.elections", ["code"], elections))
    newp = [{"_seg": f"party-{c}"[:170], "code": c, "name": i["name"], "abbreviation": i["abbr"], "jurisdictionId": jur, "status": "inactive"} for c, i in ctx.parties.created.items() if c not in staged_parties]
    staged_parties.update(c for c, _ in ctx.parties.created.items())
    if newp:
        groups.append(Group("party", "political.parties", ["code"], newp))
    if rows.persons:
        groups.append(Group("person", "person.individuals", ["code"], list(rows.persons.values())))
    if rows.seats:
        groups.append(Group("seat", "electoral.seats", ["electionId", "code"], list(rows.seats.values())))
    if rows.candidates:
        groups.append(Group("candidate", "electoral.candidates", ["seatId", "personId"], list(rows.candidates.values())))
    res = finalise_results(rows, {}, annulled={sc for (ek, sc) in rows.seats if ek == "2017" and sc.endswith("/president")})
    if res:
        groups.append(Group("result", "electoral.results", ["candidateId", "resultLevelId", "geoUnitId"], res))
    el = []
    for e in rows.electorates:
        ec = ELECTIONS[e["ek"]][0]
        seat = ref("electoral.seats", electionId=ref("electoral.elections", code=ec), code=e["scode"])
        row = {"_seg": e["_seg"], "electionId": ref("electoral.elections", code=ec), "seatId": seat, "geoUnitId": ref("geography.units", code=e["geo"]), "resultLevelId": ref("reference.classifications", jurisdictionId=jur, code=LEVEL[e["level"]][0]), "registerVersion": e["label"], "validVotes": e.get("valid"), "resultStatus": "set_aside" if e["ek"] == "2017" and e["scode"].endswith("/president") else "declared"}
        for src, dst in (("registered", "registeredVoters"), ("rejected", "rejectedVotes"), ("cast", "votesCast")):
            if e.get(src) is not None:
                row[dst] = e[src]
        el.append(row)
    if el:
        groups.append(Group("electorate", "electoral.electorates", ["electionId", "seatId", "geoUnitId", "resultLevelId", "registerVersion"], el))
    if rows.holders:
        groups.append(Group("holder", "governance.holders", ["officeId", "personId"], rows.holders))
    return groups


def _referendum_groups(ctx: Context, rows: Rows) -> list[Group]:
    jur, qs, opts, res, el = ctx.jur, [], [], [], []
    level = ref("reference.classifications", jurisdictionId=jur, code=LEVEL["national"][0])
    for ek, info in getattr(rows, "referendums", {}).items():
        ec = ELECTIONS[ek][0]
        election = ref("electoral.elections", code=ec)
        q = ref("electoral.referendum_questions", electionId=election, code="constitution")
        qs.append({"_seg": f"question-{ek}", "electionId": election, "code": "constitution", "text": "Do you approve the proposed new Constitution of Kenya? (question summarised from the source, not the verbatim ballot wording)", "position": 1})
        for code, label in (("yes", "Yes (approve)"), ("no", "No (reject)")):
            opts.append({"_seg": f"option-{ek}-{code}", "questionId": q, "code": code, "label": label, "position": 1 if code == "yes" else 2})
            res.append({"_seg": f"refres-{ek}-{code}", "optionId": ref("electoral.referendum_options", questionId=q, code=code), "resultLevelId": level, "geoUnitId": ref("geography.units", code="ke"), "votes": info[code], "resultStatus": "declared", "evidenceForm": "Wikipedia table (IEBC / ECK figures), national total"})
        valid = (info["yes"] or 0) + (info["no"] or 0)
        row = {"_seg": f"elec-{ek}-ref", "electionId": election, "geoUnitId": ref("geography.units", code="ke"), "resultLevelId": level, "registerVersion": f"{ELECTIONS[ek][1]} (national result)", "validVotes": valid, "resultStatus": "declared"}
        if info.get("invalid") is not None:
            row["rejectedVotes"] = info["invalid"]
            row["votesCast"] = valid + info["invalid"]
        if info.get("registered"):
            row["registeredVoters"] = info["registered"]
        el.append(row)
    return [g for g in (Group("question", "electoral.referendum_questions", ["electionId", "code"], qs), Group("option", "electoral.referendum_options", ["questionId", "code"], opts), Group("refresult", "electoral.referendum_results", ["optionId", "resultLevelId", "geoUnitId"], res), Group("referendum-electorate", "electoral.electorates", ["electionId", "geoUnitId", "resultLevelId", "registerVersion"], el)) if g.rows]


def stage_all(conn, store, which: list[str], report_path: str | None = None) -> dict:
    ctx = build_context(conn)
    out: dict = {"sources": {}}
    staged_parties: set[str] = set()
    iebc_dir = RAW / "iebc-results"
    for src in which:
        rows = Rows(ctx)
        if src == "2013":
            pdf = next(iebc_dir.glob("73c4*.pdf"))
            rep = load_2013_book(ctx, rows, str(pdf), wiki_file("2013_Kenyan_general"))
            eks, source = ["2013"], _source(conn, store, pdf, "4th March 2013 General Election Data (IEBC)", IEBC, LICENCE_IEBC, "application/pdf", "IEBC, 4th March 2013 General Election Data.")
        elif src == "2017":
            pdf = next(iebc_dir.glob("6469*.pdf"))
            rep = load_2017_report(ctx, rows, str(pdf), wiki_file("2017_Kenyan_general"))
            eks, source = ["2017", "2017r"], _source(conn, store, pdf, "2017 General Election Report (IEBC)", IEBC, LICENCE_IEBC, "application/pdf", "IEBC, 2017 General Election Report.")
        elif src == "2022":
            path = wiki_file("2022_Kenyan_general")
            rep = load_2022(ctx, rows, path)
            eks, source = ["2022"], _source(conn, store, path, "2022 Kenyan general election (Wikipedia)", WIKI, LICENCE_WIKI, "application/json", "Wikipedia, 2022 Kenyan general election, MediaWiki API.")
        elif src == "referendums":
            p10, p05 = wiki_file("2010_Kenyan_constitutional"), wiki_file("2005_Kenyan_constitutional")
            rep = load_referendums(ctx, rows, p10, p05)
            eks, source = ["2010", "2005"], _source(conn, store, p10, "2010 Kenyan constitutional referendum (Wikipedia)", WIKI, LICENCE_WIKI, "application/json", "Wikipedia, 2010 Kenyan constitutional referendum, MediaWiki API.")
        else:
            raise SystemExit(f"unknown source {src}")
        groups = _groups(ctx, rows, eks, staged_parties, True)
        if src == "referendums":
            groups = [g for g in groups if g.name in ("classification", "election")] + _referendum_groups(ctx, rows)
        diag = [{"level": "info", "code": "source", "message": f"{src}: " + json.dumps({k: v for k, v in rep.items() if k in ('seats', 'candidates', 'president_counties', 'governors')})[:500]}]
        for k, v in rep.items():
            if isinstance(v, dict) and v.get("failed"):
                diag += [{"level": "warning", "code": "check_failed", "message": f"{k}: {m}"[:300]} for m in v["failed"][:40]]
            if isinstance(v, dict) and v.get("warnings"):
                diag += [{"level": "warning", "code": "source_differs", "message": m[:300]} for m in v["warnings"][:60]]
            if isinstance(v, dict) and v.get("held"):
                diag += [{"level": "warning", "code": "held_back", "message": f"{k}: {m}"[:300]} for m in v["held"][:40]]
        diag += [{"level": "warning", "code": "unlinked", "message": m[:300]} for m in ctx.unlinked[:40]]
        staged = statload.stage(conn, store, source, "iebc-election-results", "1", f"electoral/ke/results-{src}", groups, diag)
        out["sources"][src] = {"report": rep, "runs": staged.runs, "stats": {k: {"created": v.created, "unchanged": v.unchanged, "invalid": v.invalid, "quarantined": v.quarantined} for k, v in staged.stats.items()}}
        out.setdefault("flags", []).extend(ctx.people.flags)
        ctx.people.flags = []
    out["new_people"] = len(ctx.people.new_codes)
    out["created_parties"] = len(ctx.parties.created)
    out["unlinked"] = ctx.unlinked
    if report_path:
        Path(report_path).parent.mkdir(parents=True, exist_ok=True)
        Path(report_path).write_text(json.dumps(out, indent=1, default=str))
    return out
