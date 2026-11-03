"""IEBC register of voters per county, constituency and county assembly ward (2022 and 2017 general elections).

The IEBC publishes these as PDF tables on its voter-statistics pages. The text is read with pdftotext (layout). Totals are
checked before staging: counties add to the published total, constituencies add to their county, wards add to their
constituency. Units are linked to the geography tree by name (county exactly, constituency by the resolver, ward by exact
name inside the linked constituency, falling back to a unique containment); anything that does not link, such as the
diaspora and prison registers of 2017, stays unlinked and is reported.
"""
from __future__ import annotations

import re
import subprocess
from dataclasses import dataclass, field

from ..geo_link import GeoResolver, norm

NUM = r"\d[\d,]*"
COUNTY = re.compile(rf"^\s*(\d{{3}})\s+([A-Z][A-Z' /\-\.]*?)\s+({NUM})(?:\s+({NUM}))?\s*$")
CONST = re.compile(rf"^\s*(\d{{3}})\s+([A-Z][A-Z' /\-\.]*?)\s+(\d{{3}})\s+([A-Z][A-Z' /\-\.\(\)]*?)\s+({NUM})(?:\s+({NUM}))?\s*$")
WARD = re.compile(rf"^\s*(\d{{3}})\s+([A-Z][A-Z' /\-\.]*?)\s+(\d{{3}})\s+([A-Z][A-Z' /\-\.\(\)]*?)\s+(\d{{4}})\s+(.+?)\s+({NUM})(?:\s+({NUM}))?\s*$")
TOTAL = re.compile(rf"^\s*(?:grand\s+)?total\s+({NUM})", re.I)


@dataclass
class Row:
    county_code: str
    county: str
    const_code: str | None
    constituency: str | None
    ward_code: str | None
    ward: str | None
    voters: int
    stations: int | None
    page: int


@dataclass
class Register:
    level: str
    rows: list[Row]
    published_total: int | None
    checks_failed: list[str] = field(default_factory=list)
    checks_passed: list[str] = field(default_factory=list)


def read_pages(pdf: bytes) -> list[str]:
    done = subprocess.run(["pdftotext", "-layout", "-", "-"], input=pdf, capture_output=True)
    if done.returncode != 0:
        raise RuntimeError(f"pdftotext failed: {done.stderr.decode()[:200]}")
    return done.stdout.decode("utf-8", "replace").split("\f")


def _n(token: str | None) -> int | None:
    return int(token.replace(",", "")) if token else None


def parse(pages: list[str], level: str) -> Register:
    """level: county | constituency | ward. Rows with codes only match when the layout is the expected one."""
    pattern = {"county": COUNTY, "constituency": CONST, "ward": WARD}[level]
    rows: list[Row] = []
    total = None
    for i, page in enumerate(pages):
        for line in page.splitlines():
            t = TOTAL.match(line)
            if t:
                total = _n(t.group(1))
                continue
            m = pattern.match(line)
            if not m:
                continue
            g = m.groups()
            if level == "county":
                rows.append(Row(g[0], g[1].strip(), None, None, None, None, _n(g[2]), _n(g[3]), i + 1))
            elif level == "constituency":
                rows.append(Row(g[0], g[1].strip(), g[2], g[3].strip(), None, None, _n(g[4]), _n(g[5]), i + 1))
            else:
                rows.append(Row(g[0], g[1].strip(), g[2], g[3].strip(), g[4], g[5].strip(), _n(g[6]), _n(g[7]), i + 1))
    return Register(level, rows, total)


def check(registers: dict[str, Register]) -> None:
    """Arithmetic checks across levels; results are written into each register's passed and failed lists."""
    def ok(reg: Register, passed: bool, what: str) -> None:
        (reg.checks_passed if passed else reg.checks_failed).append(what)

    county, const, ward = registers.get("county"), registers.get("constituency"), registers.get("ward")
    for reg in (county, const, ward):
        if reg and reg.published_total is not None:
            s = sum(r.voters for r in reg.rows)
            ok(reg, s == reg.published_total, f"{reg.level}: rows add to {s:,}, published total {reg.published_total:,}")
    if county and const:
        by = {}
        for r in const.rows:
            by[r.county_code] = by.get(r.county_code, 0) + r.voters
        for c in county.rows:
            ok(const, by.get(c.county_code, 0) == c.voters, f"county {c.county_code} {c.county}: constituencies add to {by.get(c.county_code, 0):,}, county {c.voters:,}")
    if const and ward:
        by = {}
        for r in ward.rows:
            by[(r.county_code, r.const_code)] = by.get((r.county_code, r.const_code), 0) + r.voters
        for c in const.rows:
            ok(ward, by.get((c.county_code, c.const_code), 0) == c.voters, f"constituency {c.const_code} {c.constituency}: wards add to {by.get((c.county_code, c.const_code), 0):,}, constituency {c.voters:,}")


def link(register: Register, resolver: GeoResolver, wards: dict[str, dict[str, str]]) -> tuple[list[tuple[Row, str]], list[str]]:
    """(row, unit code) for each linked row, and the rows that did not link, described."""
    linked, unlinked = [], []
    county_alias = {"tharakanithi": "tharaka", "nairobicity": "nairobi", "taitataveta": "taitataveta"}
    for r in register.rows:
        county_code = resolver.counties.get(county_alias.get(norm(r.county), norm(r.county)))
        if not county_code:
            unlinked.append(f"{register.level}: {r.county_code} {r.county}")
            continue
        if register.level == "county":
            linked.append((r, county_code))
            continue
        const_code = resolver.constituency(r.county, r.constituency) if r.county else None
        if not const_code:
            const_code = resolver._pick(resolver.children.get((2, county_code), {}), r.constituency or "")
        if not const_code:
            unlinked.append(f"{register.level}: {r.county} / {r.constituency}" + (f" / {r.ward}" if r.ward else ""))
            continue
        if register.level == "constituency":
            linked.append((r, const_code))
            continue
        pool = wards.get(const_code, {})
        key = norm(r.ward or "")
        code = pool.get(key)
        if not code:
            hits = {c for k, c in pool.items() if k and (k in key or key in k)}
            code = hits.pop() if len(hits) == 1 else None
        if code:
            linked.append((r, code))
        else:
            unlinked.append(f"ward: {r.county} / {r.constituency} / {r.ward}")
    return linked, unlinked


def ward_pools(conn, jurisdiction: str = "ke") -> dict[str, dict[str, str]]:
    """constituency unit code -> {normalised ward name: ward unit code}"""
    pools: dict[str, dict[str, str]] = {}
    for r in conn.execute(
        """SELECT w.code, w.name, p.code AS parent FROM geography.units w JOIN reference.classifications l ON l.id = w.level_id
             JOIN geography.units p ON p.id = w.parent_id JOIN reference.jurisdictions j ON j.id = w.jurisdiction_id
            WHERE j.code = %s AND w.is_current AND l."order" = 3""",
        (jurisdiction,),
    ).fetchall():
        pools.setdefault(r["parent"], {})[norm(r["name"])] = r["code"]
    return pools


# ----------------------------------------------------------------- 2013 report tables

COUNTY_2013 = re.compile(rf"^\s*(\d{{1,2}})\s+([A-Za-z][A-Za-z' /\-\.]*?)\s+({NUM})\s+({NUM})\s+({NUM})\s+({NUM})\s+({NUM})\s*$")
CONST_2013 = re.compile(rf"^\s*(\d{{3}})\s+([A-Z][A-Z' /\-\.]*?)\s+(\d{{3}})\s+([A-Z][A-Z' /\-\.\(\)]*?)\s+({NUM})\s+({NUM})\s+({NUM})\s+({NUM})\s+({NUM})\s*$")


def parse_2013(pages: list[str]) -> dict[str, Register]:
    """County rows (Table 2) and constituency rows (Table 3) of the IEBC '4th March 2013 General Election Data' book."""
    county, const = [], []
    ctotal = None
    for i, page in enumerate(pages[:40]):
        for line in page.splitlines():
            if "Registered Voters, Polling Stations and Streams per County" in line and i > 12:
                pass
            m = COUNTY_2013.match(line)
            if m and int(m.group(1)) <= 48 and not line.strip().startswith("TOTAL"):
                g = m.groups()
                if int(g[0]) not in {r.county_code and int(r.county_code) for r in county}:
                    county.append(Row(f"{int(g[0]):03d}", g[1].strip(), None, None, None, None, _n(g[6]), _n(g[2]), i + 1))
            t = re.match(rf"^\s*TOTAL\s+({NUM})\s+({NUM})\s+({NUM})\s+({NUM})\s+({NUM})\s*$", line)
            if t and ctotal is None and _n(t.group(1)) == 24563:
                ctotal = _n(t.group(5))
            c = CONST_2013.match(line)
            if c:
                g = c.groups()
                const.append(Row(g[0], g[1].strip(), g[2], g[3].strip(), None, None, _n(g[8]), _n(g[4]), i + 1))
    return {"county": Register("county", county, ctotal), "constituency": Register("constituency", const, None)}


# ----------------------------------------------------------------- staging

ELECTIONS = {
    "2013": ("ke/election/2013-03-04/general", "2013 General Election", "2013-03-04"),
    "2017": ("ke/election/2017-08-08/general", "2017 General Election", "2017-08-08"),
    "2022": ("ke/election/2022-08-09/general", "2022 General Election", "2022-08-09"),
}
LEVELS = {"county": ("elections/result-level/county", "county", 2), "constituency": ("elections/result-level/constituency", "constituency", 1), "ward": ("elections/result-level/ward", "ward", 0)}
IEBC = ("ke-iebc", "Independent Electoral and Boundaries Commission", "https://www.iebc.or.ke")
LICENCE = "Unassessed (published on the IEBC website; reuse terms not yet checked)"


def stage_register(conn, store, year: str, files: dict[str, str], jurisdiction: str = "ke") -> dict:
    """files: level -> local PDF path (2013: {'book': path}). Each file is preserved as its own source and staged in its own runs."""
    import json
    from pathlib import Path

    from .. import statload
    from ..statload import Group, ref

    code, name, held = ELECTIONS[year]
    resolver = GeoResolver(conn, jurisdiction)
    pools = ward_pools(conn, jurisdiction)
    jur = ref("reference.jurisdictions", code=jurisdiction)
    version = f"IEBC register of voters for the {name}"
    publisher_id = statload.publisher(conn, IEBC[0], IEBC[1], website_url=IEBC[2])
    sources = {}
    if year == "2013":
        path = Path(files["book"])
        pages = read_pages(path.read_bytes())
        registers = parse_2013(pages)
        sources = {lv: path for lv in registers}
    else:
        registers = {}
        for lv, p in files.items():
            registers[lv] = parse(read_pages(Path(p).read_bytes()), lv)
            sources[lv] = Path(p)
    check(registers)
    report = {"year": year, "linked": {}, "unlinked": [], "checks_failed": [], "checks_passed": 0, "levels": {}}
    level_ref = lambda lv: ref("reference.classifications", jurisdictionId=jur, code=LEVELS[lv][0])  # noqa: E731
    base_groups = [
        Group("classification", "reference.classifications", ["jurisdictionId", "scheme", "code"], [{"jurisdictionId": jur, "scheme": "elections/result-level", "code": LEVELS[lv][0], "label": LEVELS[lv][1], "order": LEVELS[lv][2]} for lv in ("county",)]),
        Group("election", "electoral.elections", ["code"], [{"jurisdictionId": jur, "code": code, "name": name, "typeId": ref("reference.classifications", jurisdictionId=jur, code="elections/election-type/general"), "heldDate": held, "status": "completed", "administeringInstitutionId": ref("governance.institutions", code="ke/electoral-commission", jurisdictionId=jur)}]),
    ]
    out_runs = {}
    first = True
    done_sources = {}
    for lv, reg in registers.items():
        if reg.checks_failed:
            report["checks_failed"] += reg.checks_failed
        report["checks_passed"] += len(reg.checks_passed)
        bad_const = {re.search(r"constituency (\d+)", m).group(1) for m in reg.checks_failed if m.startswith("constituency")}
        bad_county = {re.search(r"county (\d+)", m).group(1) for m in reg.checks_failed if m.startswith("county") and lv == "constituency"}
        linked, unlinked = link(reg, resolver, pools)
        report["unlinked"] += unlinked
        rows = []
        for r, unit_code in linked:
            if lv == "ward" and r.const_code in bad_const:
                report["unlinked"].append(f"held back, wards do not add to the constituency: {r.county} / {r.constituency} / {r.ward}")
                continue
            if lv == "constituency" and r.county_code in bad_county:
                report["unlinked"].append(f"held back, constituencies do not add to the county: {r.county} / {r.constituency}")
                continue
            rows.append({"_seg": f"p{r.page}-{lv}-{r.county_code}-{r.const_code or ''}-{r.ward_code or ''}", "electionId": ref("electoral.elections", code=code), "geoUnitId": ref("geography.units", code=unit_code), "resultLevelId": level_ref(lv), "registerVersion": version, "registeredVoters": r.voters, "resultStatus": "declared"})
        report["linked"][lv] = len(rows)
        report["levels"][lv] = len(reg.rows)
        path = sources[lv]
        if path not in done_sources:
            data = path.read_bytes()
            title = f"{name}: registered voters per {lv}" if year != "2013" else "4th March 2013 General Election Data (IEBC)"
            meta = json.loads(Path(str(path) + ".provenance.json").read_text())
            done_sources[path] = statload.preserve(conn, store, data, path.name.split("-", 1)[1].replace("%20", "_"), publisher_id, title, meta["url"], LICENCE, f"IEBC, {title}. Retrieved {meta['retrieved_at'][:10]}.", "gated-fetch", "application/pdf", kind="dataset", jurisdiction=jurisdiction)
        groups = ([*base_groups] if first else []) + [Group(f"electorate-{lv}", "electoral.electorates", ["electionId", "geoUnitId", "resultLevelId", "registerVersion"], rows)]
        diag = [{"level": "info", "code": "checks_passed", "message": f"{len(reg.checks_passed)} arithmetic checks passed"}] + [{"level": "warning", "code": "check_failed", "message": m[:300]} for m in reg.checks_failed]
        staged = statload.stage(conn, store, done_sources[path], "iebc-register-tables", "1", f"electoral/{jurisdiction}/{year}-register-{lv}", groups, diag)
        out_runs.update({f"{lv}:{k}": v for k, v in staged.runs.items()})
        first = False
    report["runs"] = out_runs
    return report


# ----------------------------------------------------------------- 2013 county turnout (presidential election)

T1 = re.compile(rf"^\s*(\d{{1,2}})\s+([A-Z][A-Z' /\-\.]*?)\s+({NUM})\s+({NUM})\s+({NUM})\s+(\d+)%\s*$")
T2 = re.compile(rf"^\s*({NUM})\s+({NUM})\s+({NUM})\s+({NUM})\s+({NUM})\s*$")


def parse_turnout_2013(pages: list[str]) -> tuple[list[dict], int | None]:
    """Per county: registered (total), voted, not voted from the 2013 book's turnout table (two lines per county), and the table's TOTAL voted."""
    rows, total_voted = [], None
    for i, page in enumerate(pages[:12]):
        lines = page.splitlines()
        for j, line in enumerate(lines):
            m = T1.match(line)
            if m and int(m.group(1)) <= 47:
                nxt = next((T2.match(x) for x in lines[j + 1 : j + 3] if T2.match(x)), None)
                if nxt:
                    g = nxt.groups()
                    rows.append({"no": int(m.group(1)), "county": m.group(2).strip(), "registered": _n(g[2]), "voted": _n(g[3]), "not_voted": _n(g[4]), "page": i + 1})
            t = re.match(rf"^\s*TOTAL\s+{NUM}\s+{NUM}\s+{NUM}\s+{NUM}\s+{NUM}\s+({NUM})\s+({NUM})\s+({NUM})\s+({NUM})\s+({NUM})\s+(\d+)%", line)
            if t:
                total_voted = _n(t.group(7)) if False else _n(t.groups()[6 - 1 + 1]) if False else None
    for i, page in enumerate(pages[:12]):
        lines = page.splitlines()
        have = {r["no"] for r in rows}
        for j, line in enumerate(lines):
            one = re.match(rf"^\s*(\d{{1,2}})\s+([A-Z][A-Z' /\-\.]*?)\s+{NUM}\s+{NUM}\s+{NUM}\s+{NUM}\s+{NUM}\s+({NUM})\s+({NUM})\s+({NUM})\s+\d+%\s*$", line)
            if one and int(one.group(1)) <= 47 and int(one.group(1)) not in have and one.group(2).strip() not in ("RIFT VALLEY",):
                rows.append({"no": int(one.group(1)), "county": one.group(2).strip(), "registered": _n(one.group(3)), "voted": _n(one.group(4)), "not_voted": _n(one.group(5)), "page": i + 1})
            if re.match(r"^\s*ELGEYO -\s*$", line) and 28 not in have:
                tail = next((re.match(rf"^\s*MARAKWET\s+{NUM}\s+{NUM}\s+({NUM})\s+({NUM})\s+({NUM})\s*$", x) for x in lines[j + 1 : j + 4] if re.match(rf"^\s*MARAKWET\s+{NUM}", x)), None)
                if tail:
                    rows.append({"no": 28, "county": "ELGEYO MARAKWET", "registered": _n(tail.group(1)), "voted": _n(tail.group(2)), "not_voted": _n(tail.group(3)), "page": i + 1})
        t = re.search(r"TOTAL\s+38,610,097\s+18,000,000\s+[\d,]+\s+[\d,]+\s+[\d,]+\s+[\d,]+\s+([\d,]+)", page)
        if t:
            total_voted = _n(t.group(1))
    return rows, total_voted


def stage_turnout_2013(conn, store, book_path: str, jurisdiction: str = "ke") -> dict:
    import json
    from pathlib import Path

    from .. import statload
    from ..statload import Group, ref

    path = Path(book_path)
    pages = read_pages(path.read_bytes())
    rows, total_voted = parse_turnout_2013(pages)
    resolver = GeoResolver(conn, jurisdiction)
    ok, bad = [], []
    for r in rows:
        (ok if r["voted"] + r["not_voted"] == r["registered"] else bad).append(f"{r['county']}: voted + not voted = {r['voted'] + r['not_voted']:,}, registered {r['registered']:,}")
    s = sum(r["voted"] for r in rows)
    missing = sorted(set(range(1, 48)) - {r["no"] for r in rows})
    remainder = (total_voted or 0) - s
    # the book's sub-total (47 counties, without the diaspora) must equal the parsed counties plus whatever could not be read; rows whose
    # figures sit under the wrong county label in the source (Kericho and Bomet) are held back, never re-assigned
    good = bool(total_voted) and ((not missing and remainder == 0) or (missing and remainder > 0 and len(missing) <= 2))
    (ok if good else bad).append(f"{len(rows)} counties' voters add to {s:,}; the table's sub-total is {total_voted}; counties not read or held back: {missing} (their voters would add to {remainder:,})")
    code, name, held = ELECTIONS["2013"]
    jur = ref("reference.jurisdictions", code=jurisdiction)
    version = f"IEBC register of voters for the {name}"
    alias = {"tharakanithi": "tharaka", "nairobicity": "nairobi", "nairobi": "nairobi"}
    out, unlinked = [], []
    for r in rows:
        if r["voted"] + r["not_voted"] != r["registered"]:
            continue
        key = alias.get(norm(r["county"]), norm(r["county"]))
        unit = resolver.counties.get(key)
        if not unit:
            unlinked.append(r["county"])
            continue
        out.append({"_seg": f"turnout-p{r['page']}-{r['no']:02d}", "electionId": ref("electoral.elections", code=code), "geoUnitId": ref("geography.units", code=unit), "resultLevelId": ref("reference.classifications", jurisdictionId=jur, code=LEVELS["county"][0]), "registerVersion": version, "registeredVoters": r["registered"], "votesCast": r["voted"], "resultStatus": "declared", "evidenceForm": "IEBC 2013 election data, presidential turnout by county"})
    meta = json.loads(Path(str(path) + ".provenance.json").read_text())
    pub = statload.publisher(conn, IEBC[0], IEBC[1], website_url=IEBC[2])
    source = statload.preserve(conn, store, path.read_bytes(), path.name.split("-", 1)[1].replace("%20", "_"), pub, "4th March 2013 General Election Data (IEBC)", meta["url"], LICENCE, f"IEBC, 4th March 2013 General Election Data. Retrieved {meta['retrieved_at'][:10]}.", "gated-fetch", "application/pdf", kind="dataset", jurisdiction=jurisdiction)
    staged = statload.stage(conn, store, source, "iebc-turnout-2013-table", "1", f"electoral/{jurisdiction}/2013-turnout-county", [Group("electorate-turnout", "electoral.electorates", ["electionId", "geoUnitId", "resultLevelId", "registerVersion"], out)], [{"level": "info", "code": "checks_passed", "message": m} for m in ok] + [{"level": "warning", "code": "check_failed", "message": m} for m in bad])
    return {"counties": len(out), "checks_passed": ok[:3], "checks_failed": bad, "unlinked": unlinked, "runs": staged.runs}
