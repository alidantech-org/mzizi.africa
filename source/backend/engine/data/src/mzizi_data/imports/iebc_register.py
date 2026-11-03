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
