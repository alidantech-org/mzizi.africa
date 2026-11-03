"""National office holders: past and present members of the National Assembly and Senate, the executive and the judiciary.

Sources are the MediaWiki wikitext of Wikipedia list pages (fetched through the gate, official API only) and a curated seed.
Stages (each promoted before the next because later ones reference earlier ones by code):
  A offices that no pattern or seed office covers, B individuals, C holders and party memberships.

Linking rules (DEC-ENTITY-MATCHING, DEC-COMPLETION-FIRST):
* A holder is linked to the seeded, geography-scoped seat (constituency, county woman representative, county senator) by place
  name within its county; a place that does not resolve leaves the holder on a generic seat office that the importer creates,
  and the miss is reported. Nothing is guessed.
* A name alone never reuses a person. An existing person is reused only when the seat's place or the party corroborates, or when
  the Wikipedia article is the person of a national seat the existing person also holds; otherwise a new person is created and
  the later `dedup person` run flags the pair.
* A party is linked by exact normalised name or abbreviation, else left unlinked (and counted).
"""
from __future__ import annotations

import difflib
import json
import re
from dataclasses import dataclass, field
from pathlib import Path

import psycopg
import yaml

from .. import candidates, jobs, pipeline, register
from ..files import LocalDirectoryStore
from ..geo_link import GeoResolver, norm as geo_norm
from ..structure.effective import substitute
from .budget_table import MAPPINGS as _BUDGET_MAPPINGS
from .members import slug

MAPPINGS = _BUDGET_MAPPINGS.parent / "office_holders"
STAGES = {"A": ["office", "party"], "B": ["individual"], "C": ["holder", "membership"]}
KEYS = {"party": ("partyCode",), "office": ("officeCode",), "individual": ("personCode",), "holder": ("officeCode", "personCode", "termNumber"), "membership": ("partyCode", "personCode", "isCurrent")}
PAGES = {
    "List of members of the National Assembly of Kenya, 2013–2017": "mps-2013",
    "List of members of the National Assembly of Kenya, 2017–2022": "mps-2017",
    "Senate (Kenya)": "senate",
    "Cabinet of Kenya": "cabinet",
    "Attorney General of Kenya": "list-ag",
    "Supreme Court of Kenya": "supreme-court",
    "Chief Justice of Kenya": "list-cj",
    "Deputy President of Kenya": "list-dp",
    "Speaker of the National Assembly of Kenya": "speakers-na",
}
TERM = {"2013-2017": 11, "2017-2022": 12, "2022-2027": 13}
PARTY_ALIASES = {"fordkenya": "ford-k", "fordk": "ford-k", "wdmk": "wdm", "wiperdemocraticmovement": "wdm", "wiperdemocraticmovementkenya": "wdm", "wiper": "wdm", "orangedemocraticmovement": "odm", "jubileeparty": "jp", "jubilee": "jp",
                 "unitedrepublicanparty": "urp", "unitedrepublicanpartykenya": "urp", "thenationalalliance": "tna", "thenationalalliancekenya": "tna", "uniteddemocraticalliance": "uda", "uniteddemocraticalliancekenya": "uda",
                 "amaninationalcongress": "anc", "kanu": "kanu", "kenyaafricannationalunion": "kanu", "independent": "ind", "ind": "ind", "uniteddemocraticmovement": "udm", "chamachamashinani": "ccm", "democraticactionpartykenya": "dap-k"}
SEAT_ROLE = {"constituency": ("Member of the National Assembly", "elected"), "woman": ("Woman Representative", "elected"), "nominated": ("Nominated Member of the National Assembly", "nominated")}


def pkey(text: str | None) -> str:
    return re.sub(r"[^a-z]", "", (text or "").lower().replace("(kenya)", "").replace("party", ""))


@dataclass
class Context:
    """Everything resolved once from the database."""
    geo: GeoResolver
    offices: dict[str, dict]            # code -> {id, name, singleton}
    seat_by_unit: dict[tuple[str, str], str]  # (definition, unit code) -> office code
    procedure: dict[str, str | None]    # office code -> procedure id when the office has exactly one
    people: dict[str, dict]             # code -> {name, hints, parties, wiki?}
    parties: dict[str, str]             # key -> party code
    party_codes: set[str]
    unit_names: dict[str, str]
    holder_codes: set[str]              # people who already hold a current holder row
    new_parties: dict = field(default_factory=dict)
    person_names: list = field(default_factory=list)
    inst_names: list = field(default_factory=list)
    inst_by_name: dict = field(default_factory=dict)
    held_by_person: dict = field(default_factory=dict)
    held: set = field(default_factory=set)  # (office code, person code) already in holders
    report: dict = field(default_factory=lambda: {"unmatched_places": [], "unmatched_parties": {}, "new_people": 0, "reused_people": 0, "reuse_reasons": {}, "flagged": [], "links": []})

    @classmethod
    def load(cls, conn: psycopg.Connection, jurisdiction: str = "ke") -> "Context":
        geo = GeoResolver(conn, jurisdiction)
        offices = {r["code"]: {"id": str(r["id"]), "name": r["name"], "singleton": r["is_singleton"]} for r in conn.execute("SELECT id, code, name, is_singleton FROM governance.offices")}
        seat_by_unit = {(r["definition_code"], r["unit"]): r["code"] for r in conn.execute("SELECT o.code, o.definition_code, u.code AS unit FROM governance.offices o JOIN geography.units u ON u.id = o.scope_geo_unit_id WHERE o.definition_code IN ('constituency-mp:constituency-mp','county-national-seats:woman-representative','county-national-seats:county-senator')")}
        procedure: dict[str, str | None] = {}
        for r in conn.execute("SELECT o.code, count(*) AS n, min(p.id::text) AS pid FROM governance.procedures p JOIN governance.offices o ON o.id = p.office_id GROUP BY o.code"):
            procedure[r["code"]] = r["pid"] if r["n"] == 1 else None
        people: dict[str, dict] = {}
        for r in conn.execute("SELECT code, display_name FROM person.individuals"):
            people[r["code"]] = {"name": r["display_name"], "hints": set(), "parties": set()}
        holder_codes: set[str] = set()
        held: set = set()
        for r in conn.execute("SELECT p.code, o.name, o.description, h.is_current FROM governance.holders h JOIN person.individuals p ON p.id = h.person_id JOIN governance.offices o ON o.id = h.office_id"):
            entry = people[r["code"]]
            place = re.sub(r"\s*(constituency|county)\s*$", "", (r["name"] or "").split(",")[-1].strip(), flags=re.I)
            entry["hints"].add(geo_norm(place))
            county = re.search(r"County: ([^.]*)\.", r["description"] or "")
            if county:
                entry["hints"].add(geo_norm(county.group(1)))
            if r["is_current"]:
                holder_codes.add(r["code"])
        parties: dict[str, str] = {}
        codes = set()
        for r in conn.execute("SELECT code, name FROM political.parties"):
            codes.add(r["code"])
            parties.setdefault(pkey(r["name"]), r["code"])
            parties.setdefault(pkey(r["code"].rsplit("/", 1)[-1]), r["code"])
        for r in conn.execute("SELECT p.code AS person, y.code AS party FROM political.memberships m JOIN person.individuals p ON p.id = m.person_id JOIN political.parties y ON y.id = m.party_id"):
            people[r["person"]]["parties"].add(r["party"])
        unit_names = {r["code"]: r["name"] for r in conn.execute("SELECT code, name FROM geography.units")}
        for r in conn.execute("SELECT p.code AS person, o.code AS office, u.name AS place FROM governance.holders h JOIN person.individuals p ON p.id = h.person_id JOIN governance.offices o ON o.id = h.office_id LEFT JOIN geography.units u ON u.id = o.scope_geo_unit_id"):
            held.add((r["office"], r["person"]))
            if r["place"]:
                people[r["person"]]["hints"].add(geo_norm(r["place"]))
        ctx = cls(geo, offices, seat_by_unit, procedure, people, parties, codes, unit_names, holder_codes)
        ctx.held = held
        for office, person in held:
            ctx.held_by_person.setdefault(person, set()).add(office)
        for r in conn.execute("SELECT code, name FROM governance.institutions"):
            ctx.inst_by_name.setdefault(r["name"], r["code"])
        ctx.inst_names = list(ctx.inst_by_name)
        ctx.person_names = [v["name"] for v in people.values()]
        return ctx

    def party(self, rec: dict) -> str | None:
        for text in (rec.get("partyTarget"), rec.get("party")):
            key = pkey(text)
            if not key:
                continue
            alias = PARTY_ALIASES.get(key)
            if alias and f"ke/party/{alias}" in self.party_codes:
                return f"ke/party/{alias}"
            if key in self.parties:
                return self.parties[key]
        text, target = (rec.get("party") or "").strip(), rec.get("partyTarget")
        words = len(text.split())
        if text and text.lower() != "party" and (target or words >= 3) and len(text) <= 60:
            name = re.sub(r"\s*\([^)]*\)", "", target).strip() if target else text
            code = f"ke/party/{slug(text if not target or words >= 3 else text)}"
            if code not in self.party_codes:
                self.party_codes.add(code)
                self.parties[pkey(text)] = code
                self.parties.setdefault(pkey(name), code)
                self.new_parties[code] = {"partyCode": code, "partyName": name, "partyAbbreviation": text if words < 3 else None}
            return code
        if rec.get("party"):
            self.report["unmatched_parties"][rec["party"]] = self.report["unmatched_parties"].get(rec["party"], 0) + 1
        return None


class People:
    """Person codes for a run: reuse needs corroboration, never a name alone."""

    def __init__(self, ctx: Context):
        self.ctx = ctx
        self.by_wiki: dict[str, str] = {}
        self.taken: dict[str, str | None] = {}

    def code(self, rec: dict, area: str | None, party_code: str | None, office_code: str | None = None) -> str:
        wiki = rec.get("wiki")
        if wiki and wiki in self.by_wiki:
            return self.by_wiki[wiki]
        base = f"ke/person/{slug(rec['displayName'])}"
        chosen = base
        existing = self.ctx.people.get(base)
        if existing is None:  # Parliament publishes surname first: compare name tokens in any order, then corroborate
            want = name_tokens(rec["displayName"])
            for code, other in self.ctx.people.items():
                have = name_tokens(other["name"])
                if len(have & want) >= 2 and (have <= want or want <= have) and (area and geo_norm(area) in other["hints"]):
                    base, existing = code, other
                    break
        reason = None
        if existing is not None:
            hints, parties = existing["hints"], existing["parties"]
            inst = rec.get("institution")
            if office_code and (office_code, base) in self.ctx.held:
                reason = "already holds this seat"
            elif inst and any(o.startswith(inst + "/") for o in self.ctx.held_by_person.get(base, ())):
                reason = "already holds an office in the same institution"
            elif area and geo_norm(area) in hints:
                reason = "same seat place"
            elif party_code and party_code in parties:
                reason = "same party"
            elif wiki and rec.get("seat") in NATIONAL_SEATS and base in self.ctx.holder_codes and len(rec["displayName"].split()) >= 3:
                reason = "same full name as a current national office holder, article-linked"
            if reason:
                self.ctx.report["reused_people"] += 1
                self.ctx.report["reuse_reasons"][reason] = self.ctx.report["reuse_reasons"].get(reason, 0) + 1
            else:
                chosen = f"{base}-wp-{slug(rec.get('seat') or 'x')}"
                self.ctx.report["flagged"].append({"name": rec["displayName"], "existing": base, "new": chosen, "seat": rec.get("seat"), "area": area})
        elif base in self.taken and self.taken[base] != wiki:
            chosen = f"{base}-{slug(wiki or str(len(self.taken)))}"
        if chosen not in self.ctx.people and chosen not in self.taken.values() and chosen == base:
            self.ctx.report["new_people"] += 1
        self.taken[chosen] = wiki
        self.taken.setdefault(base, wiki)
        if wiki:
            self.by_wiki[wiki] = chosen
        return chosen


def name_tokens(name: str) -> set[str]:
    return {t for t in re.sub(r"[^a-z ]", " ", name.lower()).split() if len(t) > 1 and t not in {"hon", "dr", "prof", "eng", "rt", "mr", "mrs", "ms"}}


NATIONAL_SEATS = {"gazette-appointee", "constituency", "woman", "nominated", "county-senator", "nominated-senator-women", "nominated-senator-youth", "nominated-senator-pwd", "cabinet-secretary", "president", "deputy-president", "attorney-general", "speaker-na"}


def to_date(year: str | None) -> str | None:
    return f"{year}-01-01" if year else None


RENAMED = {"mbeerenorth": "Siakago", "mbeeresouth": "Gachoka", "chukaigambangombe": "Nithi", "garissatownship": "Dujis", "homabaytown": "Homa Bay", "dagorettinorth": "Dagoretti", "dagorettisouth": "Dagoretti", "mwingicentral": "Mwingi East", "mbita": "Suba North", "suba": "Suba South"}  # same seats under the names the seed carries


def find_county(ctx: Context, name: str | None) -> str | None:
    """A county by name, else by containment when exactly one county's name contains or is contained (Tharaka-Nithi, Nairobi City)."""
    unit = ctx.geo.county(name)
    if unit or not name:
        return unit
    key = geo_norm(name)
    hits = {code for k, code in ctx.geo.counties.items() if k and (k in key or key in k)}
    return hits.pop() if len(hits) == 1 else None


def find_constituency(ctx: Context, county: str | None, area: str | None) -> tuple[str | None, float]:
    """(unit code, score): exact in county 1.0, unique name 0.9, documented rename 0.85, near spelling 0.8, none 0."""
    if not area:
        return None, 0.0
    unit = ctx.geo.constituency(county, area) if county else None
    if unit:
        return unit, 1.0
    unit = ctx.geo.constituency_any_county(area)
    if unit:
        return unit, 0.9
    alias = RENAMED.get(geo_norm(area))
    if alias:
        unit = ctx.geo.constituency_any_county(alias)
        if unit:
            return unit, 0.85
    pool = {geo_norm(ctx.unit_names[c]): c for (lvl, _p), names in ctx.geo.children.items() if lvl == 2 for c in names.values()}
    near = difflib.get_close_matches(geo_norm(area), list(pool), 2, 0.88)
    if len(near) == 1 or (len(near) == 2 and difflib.SequenceMatcher(None, geo_norm(area), near[0]).ratio() - difflib.SequenceMatcher(None, geo_norm(area), near[1]).ratio() > 0.05):
        return pool[near[0]], 0.8
    return None, 0.0


def resolve_seat(ctx: Context, rec: dict) -> tuple[str, dict | None]:
    """(office code, new office dict or None). Seated offices come from the seeded structure; a miss creates a generic seat."""
    seat, area, period = rec.get("seat"), rec.get("area"), rec.get("period")
    if period == "leadership":
        code, new = leadership_office(ctx, rec["institution"], rec["title"])
        if not code:
            ctx.report.setdefault("leadership_skipped", []).append({"person": rec["displayName"], "title": rec["title"]})
            return "", None
        ctx.report.setdefault("leadership_links", []).append({"person": rec["displayName"], "title": rec["title"], "office": code, "created": bool(new)})
        return code, new
    if period == "gazette":
        inst, score = match_institution(ctx, rec.get("institutionText", ""))
        rec["displayName"], exact = correct_name(ctx, rec["displayName"], ctx.report)
        if not exact:
            ctx.report.setdefault("low_confidence_people", []).append(rec["displayName"])
        if not inst:
            ctx.report.setdefault("gazette_unmatched", []).append({"institution": rec.get("institutionText"), "person": rec["displayName"], "role": rec["role"], "notice": rec.get("noticeNumber")})
            return "", None
        suffix = ROLE_SUFFIX.get(rec["role"].lower(), slug(rec["role"]))
        code = next((c for c in (f"{inst}/{suffix}", f"{inst}/board-member" if suffix == "member" else "", f"{inst}/commissioner" if suffix == "member" else "") if c and c in ctx.offices), None)
        ctx.report.setdefault("gazette_links", []).append({"institution": rec.get("institutionText"), "to": inst, "score": score, "role": rec["role"], "person": rec["displayName"]})
        if code:
            return code, None
        code = f"{inst}/{suffix}"
        return code, {"officeCode": code, "officeName": rec["role"].rstrip("s") if suffix == "member" else rec["role"], "officeDescription": f"Created from a Gazette appointment notice (Gazette Notice No. {rec.get('noticeNumber')}).", "institutionCode": inst, "singleton": suffix in ("chairperson", "chief-executive")}
    if rec.get("officeCode"):
        code = rec["officeCode"]
        if code in ctx.offices:
            return code, None
        if rec.get("officeName"):
            return code, {"officeCode": code, "officeName": rec["officeName"], "officeDescription": "Parliamentary party leadership office created from the curated seed.", "institutionCode": rec["institutionCode"], "singleton": False}
        ctx.report["unmatched_places"].append({"office": code})
        return code, None
    if seat == "constituency":
        unit, score = find_constituency(ctx, rec.get("county"), area)
        code = ctx.seat_by_unit.get(("constituency-mp:constituency-mp", unit)) if unit else None
        if code and score < 1.0:
            ctx.report["links"].append({"area": area, "to": code, "score": score, "period": period})
        label, inst, kind = f"Member of the National Assembly, {area}", "ke/national-assembly", "elected"
    elif seat == "woman":
        unit = find_county(ctx, area)
        code = ctx.seat_by_unit.get(("county-national-seats:woman-representative", unit)) if unit else None
        label, inst, kind = f"Woman Representative, {area} County", "ke/national-assembly", "elected"
    elif seat == "county-senator":
        unit = find_county(ctx, area)
        code = ctx.seat_by_unit.get(("county-national-seats:county-senator", unit)) if unit else None
        label, inst, kind = f"Senator, {area} County", "ke/senate", "elected"
    elif seat == "nominated":
        return "ke/national/nominated-mp", None
    elif seat.startswith("nominated-senator"):
        return f"ke/national/{seat}", None
    elif seat == "speaker-na":
        return "ke/national-assembly/speaker", None
    else:
        raise KeyError(seat)
    if code:
        return code, None
    ctx.report["unmatched_places"].append({"seat": seat, "area": area, "period": period})
    generic = f"ke/{'senate' if inst.endswith('senate') else 'national-assembly'}/seat/{slug(area or 'unknown')}-{seat}"
    return generic, {"officeCode": generic, "officeName": label, "officeDescription": f"Seat kind: {kind}. Created because the place name did not resolve to a seeded seat.", "institutionCode": inst, "singleton": False}


def build(ctx: Context, records: list[dict]) -> dict[str, list[tuple[str, dict]]]:
    """Per-stage candidate records from extracted holdings (and nothing is written)."""
    people = People(ctx)
    out: dict[str, list[tuple[str, dict]]] = {"party": [], "office": [], "individual": [], "holder": [], "membership": []}
    for index, rec in enumerate(records):
        if rec.get("period") == "2022-2027" and f"ke/person/{slug(rec['displayName'])}" in ctx.holder_codes:
            continue  # the 13th Parliament lists already hold this person: the link pass attaches the seeded seat
        office_code, new_office = resolve_seat(ctx, rec)
        if rec.get("period") in ("gazette", "leadership") and not office_code:
            continue
        if new_office:
            ctx.offices.setdefault(office_code, {"id": None, "name": new_office["officeName"], "singleton": False})
            out["office"].append((f"o-{index}", new_office))
        elif office_code not in ctx.offices:
            continue
        party_code = ctx.party(rec)
        person_code = people.code(rec, rec.get("area"), party_code, office_code)
        current = rec.get("validTo") is None and rec.get("period") in ("2022-2027", "current")
        if rec.get("period") == "leadership":
            current = True  # named on the institution's own page when it was fetched
        if rec.get("period") == "gazette":
            current = bool(rec.get("effective")) and rec["effective"][:4] >= "2023"  # three-year terms: an appointment from 2023 on is taken as still running
        base = {"personCode": person_code, "displayName": rec["displayName"], "_result": rec.get("_result")}
        if person_code not in ctx.people:  # a reused person already has a row: only the holding is new
            out["individual"].append((f"i-{index}", base))
        departure = "term_ended" if rec.get("validTo") and rec.get("period") in ("2013-2017", "2017-2022") and rec["validTo"] == rec["period"][-4:] else None
        holder = dict(base, officeCode=office_code, holderStatus="substantive", termNumber=TERM.get(rec.get("period"), 1), validFromDate=rec.get("effective") or to_date(rec.get("validFrom")), validFromPrecision=("exact" if rec.get("effective") else "year") if (rec.get("effective") or rec.get("validFrom")) else None, validToDate=to_date(rec.get("validTo")), validToPrecision="year" if rec.get("validTo") else None, isCurrent=current, departureReason=departure, selectionProcedureId=ctx.procedure.get(office_code))
        out["holder"].append((f"h-{index}", holder))
        if party_code:
            out["membership"].append((f"m-{index}", dict(base, partyCode=party_code, validFromDate=rec.get("effective") or to_date(rec.get("validFrom")), validFromPrecision="exact" if rec.get("effective") else "year", validToDate=to_date(rec.get("validTo")), validToPrecision="year", isCurrent=current)))
    out["party"] = [(f"p-{i}", r) for i, r in enumerate(ctx.new_parties.values())]
    return out


def link_current(conn: psycopg.Connection, ctx: Context) -> list[dict]:
    """The 13th Parliament holders created from the Parliament list sit on list-coded offices; attach each to the seeded
    seat for its place (constituency, county woman representative, county senator) so the seeded structure fills up."""
    rows = conn.execute(
        """SELECT p.code AS person, o.code AS office, o.name, o.description, o.is_singleton, i.code AS inst
             FROM governance.holders h JOIN governance.offices o ON o.id = h.office_id JOIN governance.institutions i ON i.id = o.institution_id
             JOIN person.individuals p ON p.id = h.person_id
            WHERE i.code IN ('ke/national-assembly', 'ke/senate') AND h.is_current AND o.definition_code IS NULL"""
    ).fetchall()
    out = []
    for r in rows:
        county = re.search(r"County: ([^.]*)\.", r["description"] or "")
        county = county.group(1).strip() if county else None
        place = (r["name"] or "").split(",", 1)[-1].strip()
        target, why, score = None, None, 1.0
        if r["inst"] == "ke/senate":
            if r["name"].startswith("Senator,"):
                unit = find_county(ctx, place)
                target = ctx.seat_by_unit.get(("county-national-seats:county-senator", unit)) if unit else None
                why = "county senator by county name"
        elif r["is_singleton"]:
            unit, score = find_constituency(ctx, county, place)
            target = ctx.seat_by_unit.get(("constituency-mp:constituency-mp", unit)) if unit else None
            why = {1.0: "constituency by name within county", 0.9: "constituency by unique name", 0.85: "documented rename", 0.8: "near spelling"}.get(score)
        elif r["name"].startswith("Member of the National Assembly,") and find_county(ctx, place):
            unit = find_county(ctx, place)
            target = ctx.seat_by_unit.get(("county-national-seats:woman-representative", unit))
            why = "woman representative by county name"
        if r["person"] == "ke/person/vacant":
            ctx.report.setdefault("vacant_placeholders", []).append(r["office"])
            continue
        if not target or r["person"] in {x["personCode"] for x in out if x["officeCode"] == target}:
            ctx.report["unmatched_places"].append({"link": r["office"], "person": r["person"]})
            continue
        ctx.report["links"].append({"person": r["person"], "from": r["office"], "to": target, "why": why, "score": score})
        out.append({"personCode": r["person"], "officeCode": target, "holderStatus": "substantive", "termNumber": 13, "validFromDate": "2022-01-01", "validFromPrecision": "year", "validToDate": None, "validToPrecision": "year", "isCurrent": True, "departureReason": None, "selectionProcedureId": ctx.procedure.get(target), "displayName": None})
    return out


ROLE_SUFFIX = {"chairperson": "chairperson", "vice chairperson": "vice-chairperson", "chief executive": "chief-executive", "chief executive officer": "chief-executive", "member": "member", "members": "member", "commissioner": "commissioner", "commissioners": "commissioner", "director general": "chief-executive", "managing director": "chief-executive", "secretary": "secretary", "registrar": "registrar", "director": "director"}


def gazette_results(conn: psycopg.Connection, store: LocalDirectoryStore, handlers: dict):
    """Appointment notices in every Gazette issue already in the registry: extraction jobs on the preserved files."""
    rows = conn.execute(
        """SELECT DISTINCT ON (c.file_version_id) c.id::text AS capture, c.file_version_id::text AS fv
             FROM source.captures c JOIN source.documents d ON d.id = c.document_id JOIN reference.classifications k ON k.id = d.kind_id
            WHERE k.code LIKE '%gazette' AND c.file_version_id IS NOT NULL ORDER BY c.file_version_id, c.retrieved_at DESC"""
    ).fetchall()
    for row in rows:
        job_id, _ = pipeline.enqueue_extraction(conn, row["fv"], "gazette-appointments", "reocr", row["capture"])
        conn.commit()
        while jobs.run_once(conn, handlers, worker="office-holders-import"):
            pass
        job = conn.execute("SELECT status, result_file_version_id::text AS fv FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
        if job["status"] != "succeeded" or not job["fv"]:
            continue
        result = pipeline.load_result(store, job["fv"])
        recs = [json.loads(s.content) for s in result.segments]
        if recs:
            yield row["capture"], str(result.id), recs


def leadership_office(ctx: Context, inst: str, title: str) -> tuple[str | None, dict | None]:
    """The seeded office for a title on an institution's own page: exact suffix under the institution (or the state department the title names), else a created office."""
    from rapidfuzz import fuzz, process

    t = title.lower()
    own = {c[len(inst) + 1:]: c for c in ctx.offices if c.startswith(inst + "/") and "/" not in c[len(inst) + 1:]}
    if "deputy" in t and "secretary" in t:
        return None, None
    if re.match(r"^(director|registrar)\b(?![- ]general)", t) or re.search(r"director[- ]general,", t) or t.startswith(("secretary admin", "secretary to the")):
        return None, None  # heads of departments and units are not seeded offices: skipped, not invented
    if "principal secretary" in t:
        sub = [n for n, c in ctx.inst_by_name.items() if c.startswith(inst + "/")]
        best = process.extractOne(re.sub(r"(?i)principal secretary|state department( for| of)?|ministry of", " ", title), sub, scorer=fuzz.token_set_ratio, score_cutoff=70) if sub else None
        target = ctx.inst_by_name[best[0]] if best else inst
        code = f"{target}/principal-secretary"
        if code in ctx.offices:
            return code, None
        return code, {"officeCode": code, "officeName": "Principal Secretary", "officeDescription": "Created from the institution's own leadership page.", "institutionCode": target, "singleton": True}
    if "cabinet secretary" in t:
        suffix = "cabinet-secretary"
    elif re.search(r"\bvice\b", t):
        suffix = "vice-chairperson"
    elif re.search(r"chair", t):
        suffix = "chairperson"
    elif re.search(r"commissioner|board member", t):
        suffix = "commissioner" if "commissioner" in own else "member" if "member" in own else "board-member" if "board-member" in own else "member"
    elif re.search(r"secretary|ceo|chief executive|director[- ]general|managing director", t):
        suffix = next((x for x in ("secretary", "chief-executive") if x in own), "chief-executive")
    else:
        suffix = slug(re.split(r"[-,:(]", title)[0])
    code = f"{inst}/{suffix}"
    if code in ctx.offices:
        return code, None
    return code, {"officeCode": code, "officeName": re.split(r"\s[-\u2013]|,|:", title)[0].strip().title()[:120], "officeDescription": "Created from the institution's own leadership page.", "institutionCode": inst, "singleton": suffix in ("chairperson", "chief-executive", "cabinet-secretary", "secretary")}


def leadership_results(conn: psycopg.Connection, store: LocalDirectoryStore, handlers: dict, directory: Path):
    """Pages fetched by `fetch-leadership`: each is ingested as an official-website document, extracted, and yielded."""
    for meta_path in sorted(directory.glob("*/*.provenance.json")):
        meta = json.loads(meta_path.read_text())
        data_path = Path(str(meta_path)[: -len(".provenance.json")])
        publisher = register.ensure_publisher(conn, "web-" + slug(meta["host"]), meta["host"], kind="institution", website_url="https://" + meta["host"])
        row = conn.execute("SELECT id::text AS id FROM reference.jurisdictions WHERE code = 'ke'").fetchone()
        spec = register.DocumentSpec(publisher, f"Leadership page: {meta['requested']}", "official_website", url=meta["url"], licence="Not confirmed (public page of a Kenyan public body; reuse terms unassessed)", citation=f"{meta['host']}, retrieved {meta['retrieved_at'][:10]}.", jurisdiction_id=row["id"] if row else None)
        _doc, capture_id, ref = pipeline.ingest(conn, store, data_path.read_bytes(), "leadership.html", spec, url=meta["url"], tool="gated-fetch", mime_type="text/html")
        job_id, _ = pipeline.enqueue_extraction(conn, ref.version_id, "leadership-page", meta["institution"], capture_id)
        conn.commit()
        while jobs.run_once(conn, handlers, worker="office-holders-import"):
            pass
        job = conn.execute("SELECT status, result_file_version_id::text AS fv FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
        if job["status"] != "succeeded" or not job["fv"]:
            continue
        result = pipeline.load_result(store, job["fv"])
        recs = [dict(json.loads(s.content), period="leadership", sourceUrl=meta["url"]) for s in result.segments]
        if recs:
            yield capture_id, str(result.id), recs


def correct_name(ctx: Context, name: str, report: dict) -> tuple[str, bool]:
    """Fix OCR noise against known names, only when exactly one known name scores 92 or more; (name, matched-or-clean)."""
    from rapidfuzz import fuzz, process

    if not ctx.person_names:
        return name, False
    hits = process.extract(name, ctx.person_names, scorer=fuzz.token_sort_ratio, score_cutoff=92, limit=3)
    if len(hits) == 1 or (len(hits) > 1 and hits[0][1] - hits[1][1] >= 4):
        if hits[0][0] != name:
            report.setdefault("name_corrections", []).append({"ocr": name, "known": hits[0][0], "score": hits[0][1]})
        return hits[0][0], True
    return name, False


def match_institution(ctx: Context, text: str) -> tuple[str | None, float]:
    """Institution code by fuzzy name (token set ratio), accepted from 85, else none."""
    from rapidfuzz import fuzz, process

    clean = re.sub(r"\b(th[ec]|board|of|directors|council)\b", " ", text or "", flags=re.I)
    if not ctx.inst_names:
        return None, 0.0
    best = process.extractOne(clean, ctx.inst_names, scorer=fuzz.token_set_ratio, score_cutoff=85)
    return (ctx.inst_by_name[best[0]], best[1] / 100) if best else (None, 0.0)


@dataclass
class HoldersImport:
    pages: int
    holdings: int
    runs: dict[str, str]
    stats: dict[str, candidates.CandidateStats]
    report: dict


def import_office_holders(conn: psycopg.Connection, store: LocalDirectoryStore, directory: str | Path, stage: str = "A", jurisdiction: str = "ke", with_links: bool = True, plan_path: str | Path | None = None) -> HoldersImport:
    publisher_id = register.ensure_publisher(conn, "wikipedia", "Wikipedia (Wikimedia Foundation)", kind="repository", website_url="https://en.wikipedia.org")
    row = conn.execute("SELECT id::text AS id FROM reference.jurisdictions WHERE code = %s", (jurisdiction,)).fetchone()
    ctx = Context.load(conn, jurisdiction)
    handlers = {"extract": pipeline.extraction_handler(conn, store)}
    pages: list[tuple[str, str, list[dict]]] = []
    for title, profile in PAGES.items():
        data_path = Path(directory) / f"{title.replace('/', '_')}.json"
        meta_path = Path(str(data_path) + ".provenance.json")
        if not data_path.exists():
            continue
        meta = json.loads(meta_path.read_text())
        url = "https://en.wikipedia.org/wiki/" + title.replace(" ", "_")
        spec = register.DocumentSpec(publisher_id, f"Wikipedia: {title}", "dataset", url=url, licence="CC BY-SA 4.0 (Wikipedia text, read through the MediaWiki API)", citation=f"Wikipedia contributors, \"{title}\", retrieved {meta['retrieved_at'][:10]} (revision recorded in the extraction).", jurisdiction_id=row["id"] if row else None)
        document_id, capture_id, ref = pipeline.ingest(conn, store, data_path.read_bytes(), f"wikipedia-{profile}.json", spec, url=meta["url"], tool="mediawiki-api", mime_type="application/json")
        job_id, _ = pipeline.enqueue_extraction(conn, ref.version_id, "wikipedia-office-holders", profile, capture_id)
        conn.commit()
        while jobs.run_once(conn, handlers, worker="office-holders-import"):
            pass
        job = conn.execute("SELECT status, result_file_version_id::text AS fv, error FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
        if job["status"] != "succeeded":
            raise RuntimeError(f"extraction of {title} did not succeed: {job['status']} {job['error']}")
        result = pipeline.load_result(store, job["fv"])
        pages.append((capture_id, str(result.id), [json.loads(s.content) for s in result.segments]))
    curated = Path(__file__).resolve().parents[4] / "database" / "fixtures" / "seed" / "ke-office-holders-curated.json"
    if curated.exists():
        cpub = register.ensure_publisher(conn, "mzizi-curated-research", "Mzizi curated research (manual preparation)", kind="institution")
        cspec = register.DocumentSpec(cpub, "Curated national office holders (ke-office-holders-curated.json)", "curated_seed", url=None, licence="Project-authored research seed", citation="Custom-prepared from manual research; unverified until confirmed by Kenya Gazette notices.", jurisdiction_id=row["id"] if row else None)
        _doc, capture_id, ref = pipeline.ingest(conn, store, curated.read_bytes(), "ke-office-holders-curated.json", cspec, url=None, tool="manual-upload", mime_type="application/json")
        job_id, _ = pipeline.enqueue_extraction(conn, ref.version_id, "wikipedia-office-holders", "curated", capture_id)
        conn.commit()
        while jobs.run_once(conn, handlers, worker="office-holders-import"):
            pass
        job = conn.execute("SELECT status, result_file_version_id::text AS fv, error FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
        if job["status"] != "succeeded":
            raise RuntimeError(f"curated extraction did not succeed: {job['status']} {job['error']}")
        result = pipeline.load_result(store, job["fv"])
        pages.append((capture_id, str(result.id), [json.loads(s.content) for s in result.segments]))
    for capture_id, result_id, recs in gazette_results(conn, store, handlers):
        pages.append((capture_id, result_id, recs))
    lead_dir = Path(directory).parent / "leadership"
    if lead_dir.exists():
        for capture_id, result_id, recs in leadership_results(conn, store, handlers, lead_dir):
            pages.append((capture_id, result_id, recs))
    for _c, result_id, recs in pages:
        for r in recs:
            r["_result"] = result_id
    # Person reuse depends on who already exists, which changes as stages promote: decide once, in stage A, and keep the plan.
    flat = [r for _c, _r, recs in pages for r in recs]
    plan = Path(plan_path) if plan_path else None
    if plan and stage != "A" and plan.exists():
        saved = json.loads(plan.read_text())
        built, ctx.report = saved["built"], saved["report"]
    else:
        built = build(ctx, flat)
        if with_links:
            built["holder"] += [(f"l-{i}", r) for i, r in enumerate(link_current(conn, ctx))]
        if plan:
            plan.parent.mkdir(parents=True, exist_ok=True)
            plan.write_text(json.dumps({"built": built, "report": ctx.report}, default=str))
    runs, stats = {}, {}
    anchor = pages[0] if pages else (None, None, [])
    for name in STAGES[stage]:
        mapping = substitute(yaml.safe_load((MAPPINGS / f"{name}.yml").read_text()), {"jurisdiction": jurisdiction})
        run_id = candidates.create_run(conn, f"office-holders/{jurisdiction}/{name}", "v1", anchor[0], anchor[1])
        seen: set[tuple] = set()
        subset = []
        for key, record in built[name]:
            ident = tuple(record.get(f) for f in KEYS[name])
            if None in ident or ident in seen:
                continue
            seen.add(ident)
            subset.append((key, record))
        allowed = ["political_opinion"] if name == "membership" else []
        total = candidates.CandidateStats()
        by_result: dict[str, list] = {}
        for key, record in subset:
            by_result.setdefault(record.get("_result") or anchor[1], []).append((key, record))
        for result_id, group in by_result.items():
            one = candidates.add_candidates(conn, run_id, mapping, group, result_id, allowed, [])
            for f in ("created", "unchanged", "superseding", "quarantined", "invalid"):
                setattr(total, f, getattr(total, f) + getattr(one, f))
            total.ids += one.ids
        stats[name] = total
        candidates.finish_run(conn, run_id)
        runs[name] = run_id
    conn.commit()
    return HoldersImport(len(pages), len(flat), runs, stats, ctx.report)
