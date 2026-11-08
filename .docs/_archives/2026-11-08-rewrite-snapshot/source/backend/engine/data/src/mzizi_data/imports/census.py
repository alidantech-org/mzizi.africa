"""2019 Kenya Population and Housing Census, Volume I (KNBS): national, county and sub-county counts.

The PDF text is read with pdftotext (layout). Volume I tables used:

    2.2 population by sex and county            male, female, intersex, total
    2.3 population in households, households and average household size by county
    2.4 population, land area and density by county
    2.5 / 2.6 / 2.7  the same three tables by sub-county

Arithmetic is checked before anything is staged: sex counts add to the total, counties add to the national total (47,564,296),
sub-counties add to their county, land areas add to the national area within the rounding the source shows. A county or
sub-county whose row fails a check is reported and not staged. Sub-counties are not units in the geography tree (the
tree holds counties, constituencies and wards); a sub-county is linked to a constituency only when its name equals the
name of exactly one constituency of the same county, and that link is written in the release label and carried with
medium confidence. Every other sub-county stays unlinked and is reported. Wards and constituency populations proper are
not in Volume I or II: the gap is recorded by the caller.
"""
from __future__ import annotations

import re
import subprocess
from dataclasses import dataclass, field

from .. import statload
from ..geo_link import GeoResolver, norm
from ..statload import Group, ref, stable_id

NUM = r"(?:\d[\d,]*(?:\.\d+)?|\.\.)"
LEAD = re.compile(r"^\s*([A-Za-z][^….\d]*?(?:\. [^….\d]*?)*?)\**(?<=\S)[….]{2,}\s*(.*)$")
NUMS = re.compile(r"^\s*((?:" + NUM + r"\s*)+)$")
TABLE = re.compile(r"Table 2\. ?(\d): ([^\n]*)")
NATIONAL_TOTAL = 47_564_296
COUNTY_ALIAS = {"nairobicity": "nairobi", "tharakanithi": "tharaka"}  # KNBS spelling to the spelling of the promoted county unit

PUBLISHER = ("ke-knbs", "Kenya National Bureau of Statistics", "https://www.knbs.or.ke")
LICENCE = "Unassessed (KNBS publishes the report on its website; reuse terms not yet checked; source acknowledgement requested by the report)"
DATASET = "knbs/census-2019/vol-1"
PERIOD = "day/2019-08-24"
VINTAGE = "knbs/census-2019/vol-1-2019-11"
CATEGORY_POP = ("population", "Population")
INDICATORS = {
    "census.population": ("Population (census count)", "persons", "Persons enumerated, by sex where a sex dimension is attached; includes the special population."),
    "census.population-in-households": ("Population in conventional households", "persons", "Population living in conventional households; excludes the special population (travellers, outdoor sleepers, hotels and lodges, institutions)."),
    "census.households": ("Households (conventional)", "households", "Number of conventional households."),
    "census.household-size": ("Average household size", "persons per household", "Population in conventional households divided by conventional households, as published."),
    "geography.official_land_area_km2": ("Land area as published by KNBS", "km2", "Land area (square kilometres) as published in the census report; kept apart from the area computed from boundary shapes."),
}
SEX_MEMBERS = [("male", "Male"), ("female", "Female"), ("intersex", "Intersex")]


def read_pages(pdf: bytes) -> list[str]:
    done = subprocess.run(["pdftotext", "-layout", "-", "-"], input=pdf, capture_output=True)
    if done.returncode != 0:
        raise RuntimeError(f"pdftotext failed: {done.stderr.decode()[:200]}")
    return done.stdout.decode("utf-8", "replace").split("\f")


def parse_rows(text: str) -> list[tuple[str, list[str]]]:
    """(name, number tokens) per row of a dot-leader table; a name on one line and its numbers on the next are joined."""
    out: list[tuple[str, list[str]]] = []
    pending = None
    for line in text.splitlines():
        if not line.strip():
            continue
        m = LEAD.match(line)
        if m:
            rest = m.group(2).strip()
            if rest and NUMS.match(rest):
                out.append((m.group(1).strip(), rest.split()))
                pending = None
            else:
                pending = m.group(1).strip() if not rest else None
            continue
        n = NUMS.match(line)
        if n and pending:
            out.append((pending, n.group(1).split()))
        pending = None
    return out


def number(token: str) -> float | None:
    return None if token == ".." else float(token.replace(",", ""))


def tables(pages: list[str]) -> dict[str, list[tuple[int, str, list[str]]]]:
    """table id -> [(pdf page, name, tokens)], following 'Cont'd' pages by the last table title seen."""
    found: dict[str, list[tuple[int, str, list[str]]]] = {}
    current = None
    for i, page in enumerate(pages):
        m = TABLE.search(page)
        if m and "......" not in m.group(0):
            current = m.group(1)
        rows = parse_rows(page)
        if current in {"2", "3", "4", "5", "6", "7"} and rows:
            found.setdefault(current, []).extend((i + 1, name, tokens) for name, tokens in rows)
    return found


@dataclass
class Unit:
    name: str
    level: str  # national | county | sub-county
    county: str | None
    page: int
    table: str
    male: float | None = None
    female: float | None = None
    intersex: float | None = None
    total: float | None = None
    pop_in_households: float | None = None
    households: float | None = None
    household_size: float | None = None
    land_area: float | None = None
    problems: list[str] = field(default_factory=list)


@dataclass
class Census:
    units: list[Unit]
    checks: list[str]  # every arithmetic check that failed, in words
    passed: list[str]


def _structure(rows: list[tuple[int, str, list[str]]], county_order: list[str]) -> list[tuple[str, str | None, int, str, list[str]]]:
    """Level and county of each row of the sub-county table. Counties appear in the order of Table 2.2, so a row is a county row when
    its name is the next county in that order; every other row belongs to the current county (a sub-county may share its county's name)."""
    out, county, upcoming = [], None, list(county_order)
    for page, name, tokens in rows:
        if not out:
            out.append(("national", None, page, name, tokens))
        elif upcoming and norm(name) == norm(upcoming[0]):
            county = upcoming.pop(0)
            out.append(("county", county, page, name, tokens))
        else:
            out.append(("sub-county", county, page, name, tokens))
    return out


def _align(rows: list[tuple[int, str, list[str]]], structure: list, notes: list[str]) -> list[tuple[int, str, list[str]]]:
    """Rows of a companion table in the order of the sex table. A row the sex table lacks (Table 2.7 lists 'Mau Forest' with
    no people under Kericho) is left out and noted; a row it has but the companion lacks stays missing and fails the length check."""
    out, i = [], 0
    for page, name, tokens in rows:
        if i < len(structure) and norm(name) == norm(structure[i][3]):
            out.append((page, name, tokens))
            i += 1
        else:
            notes.append(f"row '{name}' (p.{page}) has no counterpart in the sex table and was left out")
    return out


def parse(pages: list[str]) -> Census:
    t = tables(pages)
    for need in ("2", "3", "4", "5", "6", "7"):
        if need not in t:
            raise ValueError(f"Table 2.{need} was not found in the PDF text")
    units: dict[tuple[str, str, str | None, str], Unit] = {}
    checks: list[str] = []
    passed_notes: list[str] = []

    def unit(level: str, county: str | None, name: str, page: int, table: str) -> Unit:
        key = (table, level, county, name)
        if key not in units:
            units[key] = Unit(name, level, county, page, table)
        return units[key]

    # sex tables: county (2) and sub-county (5)
    for sex_table, hh_table, area_table, multi in (("2", "3", "4", False), ("5", "6", "7", True)):
        structure = _structure(t[sex_table], [name for _p, name, _t in t["2"][1:]]) if multi else [("national" if i == 0 else "county", None if i == 0 else name, page, name, tok) for i, (page, name, tok) in enumerate(t[sex_table])]
        hh = _align(t[hh_table], structure, passed_notes)
        area = _align(t[area_table], structure, passed_notes)
        if not (len(structure) == len(hh) == len(area)):
            checks.append(f"Tables 2.{sex_table}/2.{hh_table}/2.{area_table} have different row counts ({len(structure)}, {len(hh)}, {len(area)}); not staged")
            continue
        for (level, county, page, name, tok), (hpage, hname, htok), (apage, aname, atok) in zip(structure, hh, area):
            if not (norm(name) == norm(hname) == norm(aname)):
                checks.append(f"row names differ across tables 2.{sex_table}/2.{hh_table}/2.{area_table}: {name} / {hname} / {aname}")
                continue
            u = unit(level, county, name, page, sex_table)
            u.male, u.female, u.intersex, u.total = (number(x) for x in tok[:4])
            u.pop_in_households, u.households, u.household_size = (number(x) for x in htok[:3])
            u.land_area = number(atok[1])
            if number(atok[0]) != u.total:
                u.problems.append(f"Table 2.{area_table} population {atok[0]} differs from Table 2.{sex_table} total {tok[3]}")
    all_units = list(units.values())
    passed: list[str] = list(passed_notes)

    def check(ok: bool, what: str, bad: Unit | None = None) -> None:
        if ok:
            passed.append(what)
        else:
            checks.append(what)
            if bad:
                bad.problems.append(what)

    nat = next((u for u in all_units if u.level == "national"), None)
    if nat is None:
        raise ValueError("national row not found")
    check(nat.total == NATIONAL_TOTAL, f"national total {nat.total} equals the published {NATIONAL_TOTAL}", nat)
    for u in all_units:
        if u.total is not None:
            s = (u.male or 0) + (u.female or 0) + (u.intersex or 0)
            check(s == u.total, f"{u.level} {u.name}: male + female + intersex = {s:.0f}, total {u.total:.0f}", u)
    counties = [u for u in all_units if u.level == "county" and u.table == "2"]
    counties5 = [u for u in all_units if u.level == "county" and u.table == "5"]
    for attr in ("male", "female", "intersex", "total", "pop_in_households", "households"):
        s, n = sum(getattr(c, attr) or 0 for c in counties), getattr(nat, attr) or 0
        check(abs(s - n) < 0.5, f"sum of counties {attr} = {s:,.0f}, national {n:,.0f}")
    s = sum(c.land_area or 0 for c in counties)
    check(abs(s - nat.land_area) <= 1.0, f"sum of county land areas = {s:,.1f} km2, national {nat.land_area:,.1f} km2")
    by_county: dict[str, list[Unit]] = {}
    for u in all_units:
        if u.level == "sub-county":
            by_county.setdefault(u.county or "", []).append(u)
    for c in counties5:
        if True:
            kids = by_county.get(c.name, [])
            for attr in ("male", "female", "total", "pop_in_households", "households"):
                s, n = sum(getattr(k, attr) or 0 for k in kids), getattr(c, attr) or 0
                # intersex is shown as '..' for small counts in sub-counties, so only male, female and total are held to equality
                ok = abs(s - n) < 0.5
                check(ok, f"county {c.name}: sum of sub-county {attr} = {s:,.0f}, county {n:,.0f}")
                if not ok:
                    for k in kids:
                        k.problems.append(f"sub-counties of {c.name} do not add to the county {attr} ({s:,.0f} against {n:,.0f})")
            twin = next((x for x in counties if norm(x.name) == norm(c.name)), None)
            if twin:
                check((twin.total, twin.male, twin.female) == (c.total, c.male, c.female), f"county {c.name}: Table 2.5 row equals Table 2.2 row")
    return Census(all_units, checks, passed)


# --------------------------------------------------------------------- staging

def build_groups(census: Census, resolver: GeoResolver, county_codes: dict[str, str] | None = None, jurisdiction: str = "ke") -> tuple[list[Group], dict]:
    """Candidate groups in promotion order plus a report of what was linked, unlinked and held back."""
    report = {"counties_linked": 0, "counties_unlinked": [], "subcounties_linked": 0, "subcounties_unlinked": [], "held_back": [], "observations": 0}
    county_name = lambda name: COUNTY_ALIAS.get(norm(name), norm(name))  # noqa: E731
    n_ref = lambda code: ref("geography.units", code=code)  # noqa: E731
    obs: list[dict] = []
    links: list[dict] = []

    def add(u: Unit, unit_code: str, indicator: str, value: float | None, measure: str, confidence: str, label: str, member: str | None = None) -> None:
        if value is None:
            return
        oid = stable_id(DATASET, indicator, unit_code, PERIOD, VINTAGE, member or "")
        seg = f"t2.{u.table}-p{u.page}-{norm(u.name)}"
        obs.append(
            {
                "_seg": f"{seg}-{indicator}{('-' + member) if member else ''}",
                "id": oid,
                "tableId": ref("statistical.datasets", code=DATASET),
                "indicatorId": ref("statistical.indicators", code=indicator),
                "periodId": ref("statistical.periods", code=PERIOD),
                "geoUnitId": n_ref(unit_code),
                "vintageId": ref("statistical.vintages", code=VINTAGE),
                "numericValue": f"{value:.4f}",
                "confidenceLevel": confidence,
                "estimateKind": "census",
                "measureType": measure,
                "releaseLabel": label[:200],
            }
        )
        if member:
            dim = ref("statistical.dimensions", code="sex")
            links.append({"_seg": f"{seg}-{indicator}-{member}-dim", "observationId": oid, "dimensionId": dim, "memberId": ref("statistical.dimension_members", dimensionId=dim, code=member)})

    for u in census.units:
        if u.table == "5" and u.level != "sub-county":
            continue  # the county and national rows of the sub-county tables repeat Tables 2.2 to 2.4 and were only used for checks
        if u.problems:
            report["held_back"].append({"unit": f"{u.level} {u.name}", "reason": "; ".join(u.problems)})
            continue
        if u.level == "national":
            code, confidence, label = jurisdiction, "high", f"KNBS 2019 Census Vol. I, Table 2.{u.table}, p.{u.page}"
        elif u.level == "county":
            code = resolver.counties.get(county_name(u.name))
            confidence, label = "high", f"KNBS 2019 Census Vol. I, Table 2.{u.table}, p.{u.page}"
            if not code:
                report["counties_unlinked"].append(u.name)
                continue
            report["counties_linked"] += 1
        else:
            parent = resolver.counties.get(county_name(u.county or ""))
            pool = resolver.children.get((2, parent), {}) if parent else {}
            code = pool.get(norm(u.name))
            confidence = "medium"
            label = f"KNBS sub-county matched by name to constituency, Vol. I Table 2.{u.table}, p.{u.page}"
            if not code:
                report["subcounties_unlinked"].append(f"{u.county} / {u.name}")
                continue
            report["subcounties_linked"] += 1
        add(u, code, "census.population", u.total, "count", confidence, label)
        for member in ("male", "female", "intersex"):
            add(u, code, "census.population", getattr(u, member), "count", confidence, label, member)
        add(u, code, "census.population-in-households", u.pop_in_households, "count", confidence, label)
        add(u, code, "census.households", u.households, "count", confidence, label)
        add(u, code, "census.household-size", u.household_size, "mean", confidence, label)
        add(u, code, "geography.official_land_area_km2", u.land_area, "other", confidence, label)
    report["observations"] = len(obs)
    dataset = {"code": DATASET, "title": "2019 Kenya Population and Housing Census, Volume I: Population by County and Sub-County", "collector": PUBLISHER[1], "methodology": "Census count of 24-25 August 2019 as published by KNBS; sub-county rows linked to constituencies only by exact name within the county.", "jurisdictionId": ref("reference.jurisdictions", code=jurisdiction), "publisherInstitutionId": ref("governance.institutions", code="ke/knbs", jurisdictionId=ref("reference.jurisdictions", code=jurisdiction))}
    groups = [
        Group("category", "statistical.categories", ["code"], [{"code": CATEGORY_POP[0], "label": CATEGORY_POP[1]}]),
        Group("indicator", "statistical.indicators", ["code"], [{"code": c, "name": n, "unitOfMeasure": u, "definition": d, "categoryId": ref("statistical.categories", code="geography" if c.startswith("geography") else "population")} for c, (n, u, d) in INDICATORS.items()]),
        Group("period", "statistical.periods", ["code"], [{"code": PERIOD, "startsOn": "2019-08-24", "endsOn": "2019-08-24", "granularity": "day"}]),
        Group("vintage", "statistical.vintages", ["code"], [{"code": VINTAGE, "label": "KNBS 2019 Census Vol. I, November 2019", "releasedOn": "2019-11-01"}]),
        Group("dimension", "statistical.dimensions", ["code"], [{"code": "sex", "name": "Sex", "description": "Sex as recorded in the 2019 census (male, female, intersex)."}]),
        Group("dimension_member", "statistical.dimension_members", ["dimensionId", "code"], [{"dimensionId": ref("statistical.dimensions", code="sex"), "code": c, "label": l, "sortOrder": i} for i, (c, l) in enumerate(SEX_MEMBERS)]),
        Group("dataset", "statistical.datasets", ["code"], [dataset]),
        Group("observation", "statistical.observations", ["id"], obs, method="extracted"),
        Group("observation_dimension", "statistical.observation_dimensions", ["observationId", "dimensionId"], links, method="extracted"),
    ]
    return groups, report


def import_volume_1(conn, store, pdf_path, jurisdiction: str = "ke") -> dict:
    """Preserves the PDF as the source, parses and checks it, and stages the checked rows. Returns the staged runs and the report."""
    import json
    from pathlib import Path

    path = Path(pdf_path)
    meta = json.loads(Path(str(path) + ".provenance.json").read_text())
    data = path.read_bytes()
    census = parse(read_pages(data))
    resolver = GeoResolver(conn, jurisdiction)
    groups, report = build_groups(census, resolver, jurisdiction=jurisdiction)
    publisher_id = statload.publisher(conn, *PUBLISHER[:2], website_url=PUBLISHER[2])
    source = statload.preserve(
        conn, store, data, path.name.split("-", 1)[1], publisher_id, "2019 Kenya Population and Housing Census, Volume I: Population by County and Sub-County", meta["url"], LICENCE,
        "Kenya National Bureau of Statistics, 2019 Kenya Population and Housing Census, Volume I, November 2019, ISBN 978-9966-102-09-6.", "gated-fetch", "application/pdf", kind="census_report", jurisdiction=jurisdiction,
    )
    diagnostics = [{"level": "info", "code": "checks_passed", "message": f"{len(census.passed)} arithmetic checks passed"}] + [{"level": "warning", "code": "check_failed", "message": m[:300]} for m in census.checks]
    staged = statload.stage(conn, store, source, "knbs-census-vol1-tables", "1", f"census/{jurisdiction}/2019-vol-1", groups, diagnostics)
    report.update({"checks_passed": len(census.passed), "checks_failed": census.checks})
    return {"staged": staged, "report": report}
