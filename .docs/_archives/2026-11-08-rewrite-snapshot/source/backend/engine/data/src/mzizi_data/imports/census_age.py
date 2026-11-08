"""2019 census Volume III: population by five-year age group and sex, per county (Table 2.3).

Group counts only. Intersex is excluded by the source from sub-national age tables, so male + female differs slightly from the
county totals of Volume I; the checks therefore compare male and female separately with Volume I's male and female counts.
Checks before staging: the age groups of a county add to its male, female and total rows, and the male and female totals equal the
Volume I figures already loaded.
"""
from __future__ import annotations

import re
from pathlib import Path

from .. import statload
from ..geo_link import GeoResolver, norm
from ..statload import Group, ref, stable_id
from .census import COUNTY_ALIAS, PERIOD, read_pages
from .census_breakdowns import ORDER

DATASET = "knbs/census-2019/vol-3"
VINTAGE = "knbs/census-2019/vol-3-2019-11"
ROW = re.compile(r"(?:(?<=\s)|^)(\d{1,3}\s?-\s?\d{1,3}|\d{2,3}\+|Total|Not Stated)\s+(\d[\d,]*|-)\s+(\d[\d,]*|-)\s+(\d[\d,]*|-)(?=\s|$)")


def _n(x: str) -> int:
    return 0 if x == "-" else int(x.replace(",", ""))


def parse(pages: list[str]) -> dict[str, dict]:
    """{county key: {'name', 'page', 'groups': {label: (male, female, total)}, 'total': (m, f, t)}} for the county rows only."""
    out, order = {}, list(ORDER)
    for i, page in enumerate(pages):
        if "Table 2.3: Distribution of Population by Age, Sex" not in page[:400]:
            continue
        lines = [l for l in page.splitlines() if l.strip()]
        name = lines[2].strip() if len(lines) > 2 else ""
        key = norm(COUNTY_ALIAS.get(norm(name), name))
        if not order or key != order[0]:
            continue
        order.pop(0)
        groups, total = {}, None
        for l in page.splitlines():
            for m in ROW.finditer(l):
                label = re.sub(r"\s", "", m.group(1))
                vals = (_n(m.group(2)), _n(m.group(3)), _n(m.group(4)))
                if label == "Total":
                    total = vals
                else:
                    groups[label] = vals
        out[key] = {"name": name, "page": i + 1, "groups": groups, "total": total}
    return out


def checks(units: dict, vol1: dict[str, tuple[float, float]]) -> tuple[list[str], list[str], dict]:
    ok, bad, keep = [], [], {}
    for key, u in units.items():
        five = {k: v for k, v in u["groups"].items() if re.fullmatch(r"\d+-\d+|\d+\+|NotStated", k) and not re.fullmatch(r"(?:[0-9]{1,2}-[0-9]{1,2})", k) or re.fullmatch(r"(\d{1,2})-(\d{1,2})", k) and int(k.split("-")[1]) - int(k.split("-")[0]) == 4}
        five = {k: v for k, v in five.items() if not (re.fullmatch(r"\d+-\d+", k) and int(k.split("-")[1]) - int(k.split("-")[0]) != 4)}
        t = u["total"]
        if not t:
            bad.append(f"{u['name']}: no total row")
            continue
        sm, sf = sum(v[0] for v in five.values()), sum(v[1] for v in five.values())
        good = abs(sm - t[0]) <= 0 and abs(sf - t[1]) <= 0
        (ok if good else bad).append(f"{u['name']}: age groups add to {sm:,}/{sf:,} (male/female), totals {t[0]:,}/{t[1]:,}")
        v1 = vol1.get(key)
        g2 = bool(v1) and v1[0] == t[0] and v1[1] == t[1]
        (ok if g2 else bad).append(f"{u['name']}: male/female {t[0]:,}/{t[1]:,} against Volume I {v1}")
        if good and g2:
            keep[key] = {**u, "five": five}
    return ok, bad, keep


def import_volume_3(conn, store, pdf_path, jurisdiction: str = "ke") -> dict:
    import json

    path = Path(pdf_path)
    meta = json.loads(Path(str(path) + ".provenance.json").read_text())
    data = path.read_bytes()
    units = parse(read_pages(data))
    vol1 = {}
    for r in conn.execute(
        """SELECT u.code, d.code AS member, o.numeric_value FROM statistical.observations o JOIN statistical.indicators i ON i.id = o.indicator_id AND i.code = 'census.population'
             JOIN geography.units u ON u.id = o.geo_unit_id JOIN reference.classifications l ON l.id = u.level_id AND l."order" = 1
             JOIN statistical.observation_dimensions od ON od.observation_id = o.id JOIN statistical.dimension_members d ON d.id = od.member_id WHERE o.is_current"""
    ).fetchall():
        vol1.setdefault(r["code"], {})[r["member"]] = float(r["numeric_value"])
    resolver = GeoResolver(conn, jurisdiction)
    v1 = {k: (vol1.get(resolver.counties.get(k), {}).get("male"), vol1.get(resolver.counties.get(k), {}).get("female")) for k in units}
    v1 = {k: (int(a), int(b)) if a is not None and b is not None else None for k, (a, b) in v1.items()}
    ok, bad, keep = checks(units, v1)
    labels = ["0-4", "5-9", "10-14", "15-19", "20-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60-64", "65-69", "70-74", "75-79", "80-84", "85-89", "90-94", "95-99", "100+", "NotStated"]
    seen = {k for u in keep.values() for k in u["five"]}
    members = [l for l in labels if l in seen] + sorted(seen - set(labels))
    ad, sd = ref("statistical.dimensions", code="age-group"), ref("statistical.dimensions", code="sex")
    obs, links = [], []
    for key, u in keep.items():
        code = resolver.counties.get(key)
        if not code:
            continue
        for label, (m, f, _t) in u["five"].items():
            for sex, v in (("male", m), ("female", f)):
                oid = stable_id(DATASET, "census.population-by-age", code, PERIOD, VINTAGE, label, sex)
                obs.append({"_seg": f"t2.3-p{u['page']}-{key}-{label}-{sex}", "id": oid, "tableId": ref("statistical.datasets", code=DATASET), "indicatorId": ref("statistical.indicators", code="census.population-by-age"), "periodId": ref("statistical.periods", code=PERIOD), "geoUnitId": ref("geography.units", code=code), "vintageId": ref("statistical.vintages", code=VINTAGE), "numericValue": f"{v:.4f}", "confidenceLevel": "high", "estimateKind": "census", "measureType": "count", "releaseLabel": f"KNBS 2019 Census Vol. III, Table 2.3, p.{u['page']}"})
                links.append({"_seg": f"{oid}-age", "observationId": oid, "dimensionId": ad, "memberId": ref("statistical.dimension_members", dimensionId=ad, code=label.lower())})
                links.append({"_seg": f"{oid}-sex", "observationId": oid, "dimensionId": sd, "memberId": ref("statistical.dimension_members", dimensionId=sd, code=sex)})
    J = ref("reference.jurisdictions", code=jurisdiction)
    groups = [
        Group("indicator", "statistical.indicators", ["code"], [{"code": "census.population-by-age", "name": "Population by age group and sex", "unitOfMeasure": "persons", "definition": "Persons by five-year age group and sex (male, female); intersex is not distributed at county level by the source.", "categoryId": ref("statistical.categories", code="population")}]),
        Group("vintage", "statistical.vintages", ["code"], [{"code": VINTAGE, "label": "KNBS 2019 Census Vol. III, November 2019", "releasedOn": "2019-11-01"}]),
        Group("dimension", "statistical.dimensions", ["code"], [{"code": "age-group", "name": "Age group", "description": "Five-year age groups of the 2019 census, with an open top group and a not-stated group."}]),
        Group("dimension_member", "statistical.dimension_members", ["dimensionId", "code"], [{"dimensionId": ad, "code": l.lower(), "label": l, "sortOrder": i} for i, l in enumerate(members)]),
        Group("dataset", "statistical.datasets", ["code"], [{"code": DATASET, "title": "2019 Kenya Population and Housing Census, Volume III: Population by Age and Sex", "collector": "Kenya National Bureau of Statistics", "methodology": "Five-year age groups by sex per county from census Volume III Table 2.3.", "jurisdictionId": J}]),
        Group("observation", "statistical.observations", ["id"], obs),
        Group("observation_dimension", "statistical.observation_dimensions", ["observationId", "dimensionId"], links),
    ]
    pub = statload.publisher(conn, "ke-knbs", "Kenya National Bureau of Statistics", website_url="https://www.knbs.or.ke")
    source = statload.preserve(conn, store, data, path.name.split("-", 1)[1], pub, "2019 Kenya Population and Housing Census, Volume III: Distribution of Population by Age and Sex", meta["url"], "Unassessed (KNBS publishes the report on its website; reuse terms not yet checked)", "Kenya National Bureau of Statistics, 2019 Kenya Population and Housing Census, Volume III, November 2019.", "gated-fetch", "application/pdf", kind="census_report", jurisdiction=jurisdiction)
    staged = statload.stage(conn, store, source, "knbs-census-vol3-tables", "1", f"census/{jurisdiction}/2019-vol-3", groups, [{"level": "info", "code": "checks_passed", "message": f"{len(ok)} checks passed"}] + [{"level": "warning", "code": "check_failed", "message": m[:300]} for m in bad])
    return {"counties_parsed": len(units), "counties_staged": len(keep), "checks_passed": len(ok), "checks_failed": bad, "observations": len(obs), "runs": staged.runs}
