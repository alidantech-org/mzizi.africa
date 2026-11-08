"""The Kenya Poverty Report 2021 (KNBS), Table 4.4: overall poverty estimates for individuals by county.

Survey-based estimates (not a count of people): headcount rate (%), poverty gap (%), severity (%), population ('000) and the number of
poor ('000). Checks before staging: the distribution of the poor adds to 100 within 1 point, the counties' numbers of poor add to the
national figure within 0.5 percent, and each county's poor divided by its population agrees with its headcount rate within one point.
"""
from __future__ import annotations

import re
from pathlib import Path

from .. import statload
from ..geo_link import GeoResolver, norm
from ..statload import Group, ref, stable_id
from .census import COUNTY_ALIAS, read_pages

DATASET = "knbs/poverty-report-2021"
VINTAGE = "knbs/poverty-report-2021-table-4-4"
PERIOD = "year/2021"
ROW = re.compile(r"^\s*([A-Z][A-Za-z'’\-/ ]+?)\s{2,}(\d[\d,]*\.?\d*)\s+(\d[\d,]*\.?\d*)\s+(\d[\d,]*\.?\d*)\s+(\d[\d,]*\.?\d*)\s+(\d[\d,]*)\s+(\d[\d,]*)\s*$")
INDICATORS = [("poverty.headcount-rate", "Poverty headcount rate", "percent", "rate", 0), ("poverty.gap", "Poverty gap", "percent", "rate", 2), ("poverty.severity", "Poverty severity", "percent", "rate", 3), ("poverty.number-of-poor", "Number of people living in poverty", "persons", "count", 5)]


def parse(pages: list[str]) -> tuple[int, list[tuple[str, list[float]]]]:
    for i, p in enumerate(pages):
        if "Table 4. 4: Overall poverty estimates (individuals) by area of residence and county" in p and "Headcount" in p:
            rows = []
            for line in p.splitlines():
                m = ROW.match(line)
                if m:
                    rows.append((m.group(1).strip(), [float(x.replace(",", "")) for x in m.groups()[1:]]))
            if rows:
                return i + 1, rows
    raise ValueError("Table 4.4 not found")


def checks(rows, resolver: GeoResolver):
    ok, bad = [], []
    nat = next((v for n, v in rows if n == "National"), None)
    counties = [(n, v) for n, v in rows if norm(COUNTY_ALIAS.get(norm(n), n)) in resolver.counties or norm(n) == "nairobicity"]
    if nat is None or len(counties) != 47:
        return [], [f"expected the national row and 47 counties, found {len(counties)} counties"], []
    dist = sum(v[1] for _n, v in counties)
    (ok if abs(dist - 100) <= 1 else bad).append(f"distribution of the poor adds to {dist:.1f}")
    poor = sum(v[5] for _n, v in counties)
    (ok if abs(poor - nat[5]) <= 0.005 * nat[5] else bad).append(f"counties' poor add to {poor:,.0f} thousand, national {nat[5]:,.0f}")
    for n, v in counties:
        implied = 100 * v[5] / v[4]
        (ok if abs(implied - v[0]) <= 1.0 else bad).append(f"{n}: poor/population = {implied:.1f} against headcount {v[0]}")
    return ok, bad, [("National", nat)] + counties


def import_report(conn, store, pdf_path, jurisdiction: str = "ke") -> dict:
    import json

    path = Path(pdf_path)
    meta = json.loads(Path(str(path) + ".provenance.json").read_text())
    data = path.read_bytes()
    page, rows = parse(read_pages(data))
    resolver = GeoResolver(conn, jurisdiction)
    ok, bad, keep = checks(rows, resolver)
    if bad or not keep:
        raise ValueError(f"Table 4.4 does not reconcile: {bad[:5]}")
    obs = []
    for name, v in keep:
        code = jurisdiction if name == "National" else resolver.counties[norm(COUNTY_ALIAS.get(norm(name), name))] if norm(COUNTY_ALIAS.get(norm(name), name)) in resolver.counties else resolver.counties["nairobi"]
        for ind, _n, _u, measure, idx in INDICATORS:
            value = v[idx] * (1000 if ind.endswith("number-of-poor") else 1)
            oid = stable_id(DATASET, ind, code, PERIOD, VINTAGE)
            obs.append({"_seg": f"t4.4-p{page}-{norm(name)}-{ind}", "id": oid, "tableId": ref("statistical.datasets", code=DATASET), "indicatorId": ref("statistical.indicators", code=ind), "periodId": ref("statistical.periods", code=PERIOD), "geoUnitId": ref("geography.units", code=code), "vintageId": ref("statistical.vintages", code=VINTAGE), "numericValue": f"{value:.4f}", "confidenceLevel": "estimate", "estimateKind": "survey", "measureType": measure, "releaseLabel": f"KNBS Kenya Poverty Report 2021, Table 4.4, p.{page}"})
    J = ref("reference.jurisdictions", code=jurisdiction)
    groups = [
        Group("category", "statistical.categories", ["code"], [{"code": "poverty", "label": "Poverty and living standards"}]),
        Group("indicator", "statistical.indicators", ["code"], [{"code": c, "name": n, "unitOfMeasure": u, "definition": f"{n}, overall poverty, individuals, 2021 estimates (KNBS Kenya Poverty Report 2021, Table 4.4). Survey-based estimates, not census counts.", "categoryId": ref("statistical.categories", code="poverty")} for c, n, u, _m, _i in INDICATORS]),
        Group("period", "statistical.periods", ["code"], [{"code": PERIOD, "startsOn": "2021-01-01", "endsOn": "2021-12-31", "granularity": "year"}]),
        Group("vintage", "statistical.vintages", ["code"], [{"code": VINTAGE, "label": "KNBS Kenya Poverty Report 2021, Table 4.4"}]),
        Group("dataset", "statistical.datasets", ["code"], [{"code": DATASET, "title": "The Kenya Poverty Report 2021 (KNBS): overall poverty by county", "collector": "Kenya National Bureau of Statistics", "methodology": "Survey-based poverty estimates for individuals; headcount, gap, severity and number of poor by county.", "jurisdictionId": J}]),
        Group("observation", "statistical.observations", ["id"], obs),
    ]
    pub = statload.publisher(conn, "ke-knbs", "Kenya National Bureau of Statistics", website_url="https://www.knbs.or.ke")
    source = statload.preserve(conn, store, data, path.name.split("-", 1)[1], pub, "The Kenya Poverty Report 2021", meta["url"], "Unassessed (KNBS publishes the report on its website; reuse terms not yet checked)", "Kenya National Bureau of Statistics, The Kenya Poverty Report 2021.", "gated-fetch", "application/pdf", kind="survey", jurisdiction=jurisdiction)
    staged = statload.stage(conn, store, source, "knbs-poverty-report-table-4-4", "1", f"survey/{jurisdiction}/poverty-2021", groups, [{"level": "info", "code": "checks_passed", "message": f"{len(ok)} checks passed"}])
    return {"checks_passed": len(ok), "observations": len(obs), "runs": staged.runs}
