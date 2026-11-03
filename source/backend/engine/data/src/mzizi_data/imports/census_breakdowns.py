"""2019 census Volume IV breakdowns at national and county level: religious affiliation (Table 2.30) and ICT use (Tables 2.32, 2.33).

These are group counts only (counts of people in a category per county), never individual records, and they keep the source's
category names. Ethnicity and nationality (Table 2.31) is published nationally in a layout whose numbered groups plus the
'so stated' row do not add to the published Kenyan total (a difference of 11,596), so it is reported and not staged.
Arithmetic is checked before staging: religion categories add to the county total and counties add to the national row; ICT counts of
counties add to the national row within 0.1 percent (the published sex columns leave out the small intersex count).
"""
from __future__ import annotations

import re
from pathlib import Path

from .. import statload
from ..geo_link import GeoResolver, norm
from ..statload import Group, ref, stable_id
from .census import COUNTY_ALIAS, PERIOD, read_pages

DATASET = "knbs/census-2019/vol-4"
VINTAGE = "knbs/census-2019/vol-4-2019-11"
NUMS = r"(\d[\d,]*(?:\.\d)?)"
ORDER = "mombasa kwale kilifi tanariver lamu taitataveta garissa wajir mandera marsabit isiolo meru tharaka embu kitui machakos makueni nyandarua nyeri kirinyaga muranga kiambu turkana westpokot samburu transnzoia uasingishu elgeyomarakwet nandi baringo laikipia nakuru narok kajiado kericho bomet kakamega vihiga bungoma busia siaya kisumu homabay migori kisii nyamira nairobi".split()
RELIGIONS = [("catholic", "Catholic"), ("protestant", "Protestant"), ("evangelical", "Evangelical Churches"), ("african-instituted", "African Instituted Churches"), ("orthodox", "Orthodox"), ("other-christian", "Other Christian"), ("islam", "Islam"), ("hindu", "Hindu"), ("traditionists", "Traditionists"), ("other-religion", "Other Religion"), ("no-religion", "No Religion / Atheists"), ("dont-know", "Don't Know"), ("not-stated", "Not Stated")]
ICT = {"2.32": ("census.ict.mobile-owners", "Population aged 3 and above owning a mobile phone", 3), "2.33": ("census.ict.internet-users", "Population aged 3 and above using the internet", 3)}
COMPUTER = ("census.ict.computer-users", "Population aged 3 and above using a desktop, laptop or tablet computer")


def _rows(page_text: str, ncols: int, indent: int | None = None) -> list[tuple[str, list[float]]]:
    out = []
    for line in page_text.splitlines():
        m = re.match(r"^( *)([A-Z][A-Za-z'’\-/ \*]+?)\s{2,}((?:" + NUMS + r"\s*){" + str(ncols) + r"})\s*$", line)
        if m and (indent is None or len(m.group(1)) == indent):
            out.append((m.group(2).strip(" *"), [float(x.replace(",", "")) for x in re.findall(NUMS, m.group(3))]))
    return out


def parse(pages: list[str]) -> dict:
    """{'religion': [...], 'mobile': [...], 'internet': [...], 'computer': [...]} each a list of (page, name, numbers)."""
    out: dict[str, list] = {"religion": [], "mobile": [], "internet": [], "computer": []}
    current = None
    for i, p in enumerate(pages):
        titles = re.findall(r"Table 2\.(\d+): ", p[:600])
        if titles and "......" not in p[:600]:
            current = {"30": "religion", "32": "mobile", "33": "internet"}.get(titles[0])
        if current == "religion":
            out["religion"] += [(i + 1, n, v) for n, v in _rows(p, 14)]
        elif current == "mobile":
            out["mobile"] += [(i + 1, n, v) for n, v in _rows(p, 9)]
        elif current == "internet":
            rows = _rows(p, 15)
            out["internet"] += [(i + 1, n, v[:3] + v[3:9]) for n, v in rows]
            out["computer"] += [(i + 1, n, v[:3] + v[9:15]) for n, v in rows]
    return out


def checks(tables: dict, resolver: GeoResolver) -> tuple[list[str], list[str], dict]:
    failed, passed = [], []
    counties = {norm(COUNTY_ALIAS.get(norm(n), n)): n for n in resolver.counties}
    keep: dict[str, list] = {}
    for kind, rows in tables.items():
        nat = next((r for r in rows if norm(r[1]) == "kenya"), None)
        county_rows = [r for r in rows if norm(COUNTY_ALIAS.get(norm(r[1]), r[1])) in counties and r is not nat]
        seen, uniq = set(), []
        order = list(ORDER)
        for r in rows:
            key = norm(COUNTY_ALIAS.get(norm(r[1]), r[1]))
            if kind == "religion":
                if key in counties and key not in seen and r is not nat:
                    seen.add(key)
                    uniq.append(r)
            elif order and key == order[0] and (nat is not None):
                order.pop(0)
                uniq.append(r)
        if nat is None or len(uniq) != 47:
            failed.append(f"{kind}: expected the national row and 47 counties, found {'no' if nat is None else 'a'} national row and {len(uniq)} counties")
            continue
        ok = True
        cols = len(nat[2])
        for c in range(cols if kind == "religion" else 1):
            s, n = sum(r[2][c] for r in uniq), nat[2][c]
            tol = 0 if kind == "religion" else 0.001 * n
            good = abs(s - n) <= tol
            ok &= good
            (passed if good else failed).append(f"{kind}: counties add to {s:,.0f} in column {c}, national {n:,.0f}")
        if kind == "religion":
            for r in uniq + [nat]:
                good = abs(sum(r[2][1:]) - r[2][0]) == 0
                ok &= good
                (passed if good else failed).append(f"religion {r[1]}: categories add to {sum(r[2][1:]):,.0f}, total {r[2][0]:,.0f}")
        else:
            for r in uniq:
                good = abs(r[2][1] + r[2][2] - r[2][0]) <= 0.001 * r[2][0] + 5
                (passed if good else failed).append(f"{kind} {r[1]}: male + female = {r[2][1] + r[2][2]:,.0f}, total {r[2][0]:,.0f}")
                ok &= good
        keep[kind] = ([nat] + uniq) if ok else []
    return failed, passed, keep


def build(keep: dict, resolver: GeoResolver, jurisdiction: str = "ke") -> tuple[list[Group], dict]:
    J = ref("reference.jurisdictions", code=jurisdiction)
    obs, links = [], []
    unlinked = []

    def add(seg, unit_code, indicator, value, dims, label, measure="count"):
        oid = stable_id(DATASET, indicator, unit_code, PERIOD, VINTAGE, *[f"{d}={m}" for d, m in dims])
        obs.append({"_seg": seg, "id": oid, "tableId": ref("statistical.datasets", code=DATASET), "indicatorId": ref("statistical.indicators", code=indicator), "periodId": ref("statistical.periods", code=PERIOD), "geoUnitId": ref("geography.units", code=unit_code), "vintageId": ref("statistical.vintages", code=VINTAGE), "numericValue": f"{value:.4f}", "confidenceLevel": "high", "estimateKind": "census", "measureType": measure, "releaseLabel": label[:200]})
        for dim, member in dims:
            d = ref("statistical.dimensions", code=dim)
            links.append({"_seg": f"{seg}-{dim}-{member}", "observationId": oid, "dimensionId": d, "memberId": ref("statistical.dimension_members", dimensionId=d, code=member)})

    for kind, rows in keep.items():
        for page, name, v in rows:
            key = norm(COUNTY_ALIAS.get(norm(name), name))
            code = jurisdiction if key == "kenya" else resolver.counties.get(key)
            if not code:
                unlinked.append(f"{kind}: {name}")
                continue
            label = f"KNBS 2019 Census Vol. IV, {'Table 2.30' if kind == 'religion' else 'Table 2.32' if kind == 'mobile' else 'Table 2.33'}, p.{page}"
            seg = f"{kind}-p{page}-{norm(name)}"
            if kind == "religion":
                add(seg + "-total", code, "census.population-in-households", v[0], [], label)
                for (member, _l), x in zip(RELIGIONS, v[1:]):
                    add(f"{seg}-{member}", code, "census.population-by-religion", x, [("religion", member)], label)
            else:
                ind = ICT["2.32"][0] if kind == "mobile" else ICT["2.33"][0] if kind == "internet" else COMPUTER[0]
                add(seg + "-pop3", code, "census.population-3-and-above", v[0], [], label)
                add(seg + "-total", code, ind, v[3] if kind != "mobile" else v[3], [], label)
                add(seg + "-male", code, ind, v[5], [("sex", "male")], label)
                add(seg + "-female", code, ind, v[7], [("sex", "female")], label)
    inds = [("census.population-by-religion", "Population by religious affiliation", "persons", "Persons in conventional households by religious affiliation (group counts; categories as published by KNBS in 2019)."), ("census.population-3-and-above", "Population aged 3 and above", "persons", "Base population of the ICT tables."), (ICT["2.32"][0], ICT["2.32"][1], "persons", ICT["2.32"][1] + "; group counts."), (ICT["2.33"][0], ICT["2.33"][1], "persons", ICT["2.33"][1] + "; group counts."), (COMPUTER[0], COMPUTER[1], "persons", COMPUTER[1] + "; group counts.")]
    groups = [
        Group("indicator", "statistical.indicators", ["code"], [{"code": c, "name": n, "unitOfMeasure": u, "definition": d, "categoryId": ref("statistical.categories", code="population")} for c, n, u, d in inds]),
        Group("vintage", "statistical.vintages", ["code"], [{"code": VINTAGE, "label": "KNBS 2019 Census Vol. IV, November 2019", "releasedOn": "2019-11-01"}]),
        Group("dimension", "statistical.dimensions", ["code"], [{"code": "religion", "name": "Religious affiliation", "description": "Religious affiliation categories of the 2019 census; group counts only. Categories changed between censuses and are not always comparable."}]),
        Group("dimension_member", "statistical.dimension_members", ["dimensionId", "code"], [{"dimensionId": ref("statistical.dimensions", code="religion"), "code": c, "label": l, "sortOrder": i} for i, (c, l) in enumerate(RELIGIONS)]),
        Group("dataset", "statistical.datasets", ["code"], [{"code": DATASET, "title": "2019 Kenya Population and Housing Census, Volume IV: Socio-Economic Characteristics (religion and ICT, county level)", "collector": "Kenya National Bureau of Statistics", "methodology": "Group counts by county from census Volume IV; published only as group counts.", "jurisdictionId": J}]),
        Group("observation", "statistical.observations", ["id"], obs),
        Group("observation_dimension", "statistical.observation_dimensions", ["observationId", "dimensionId"], links),
    ]
    return groups, {"observations": len(obs), "unlinked": unlinked}


def import_volume_4(conn, store, pdf_path, jurisdiction: str = "ke") -> dict:
    import json

    path = Path(pdf_path)
    meta = json.loads(Path(str(path) + ".provenance.json").read_text())
    data = path.read_bytes()
    tables = parse(read_pages(data))
    resolver = GeoResolver(conn, jurisdiction)
    failed, passed, keep = checks(tables, resolver)
    groups, rep = build(keep, resolver, jurisdiction)
    pub = statload.publisher(conn, "ke-knbs", "Kenya National Bureau of Statistics", website_url="https://www.knbs.or.ke")
    source = statload.preserve(conn, store, data, path.name.split("-", 1)[1], pub, "2019 Kenya Population and Housing Census, Volume IV: Distribution of Population by Socio-Economic Characteristics", meta["url"], "Unassessed (KNBS publishes the report on its website; reuse terms not yet checked)", "Kenya National Bureau of Statistics, 2019 Kenya Population and Housing Census, Volume IV, November 2019.", "gated-fetch", "application/pdf", kind="census_report", jurisdiction=jurisdiction)
    diag = [{"level": "info", "code": "checks_passed", "message": f"{len(passed)} arithmetic checks passed"}] + [{"level": "warning", "code": "check_failed", "message": m[:300]} for m in failed]
    staged = statload.stage(conn, store, source, "knbs-census-vol4-tables", "1", f"census/{jurisdiction}/2019-vol-4", groups, diag)
    rep.update({"checks_passed": len(passed), "checks_failed": failed, "runs": staged.runs, "ethnicity": "Table 2.31 not staged: numbered groups plus 'Kenyan so stated' add to 47,055,780 against 47,067,376 Kenyans (11,596 apart)"})
    return rep


# --------------------------------------------------------------- ethnicity and nationality (Table 2.31)

def parse_ethnicity(pages: list[str]) -> dict:
    """National ethnic communities of Table 2.31. The page has two columns read left column first; numbering restarts for non-Kenyan
    nationalities, which is why numbers alone cannot key the rows (they collided in the first reading and made the Kenyan total look 11,596 short)."""
    found = [p for p in pages if "Table 2.31: Distribution of Population by Ethnicity/Nationality" in p[:400] and "ETHNICITY/NATIONALITY" in p[:600]]
    if not found:
        raise ValueError("Table 2.31 page not found")
    pat = re.compile(r"(?:(?<=\s)|^)(?:(\d{1,2})\s+)?([A-Z][A-Z/\.\-' ()]*?[A-Z)])\s{2,}([\d,]{1,12})(?=\s{3,}|$)")
    seq = []
    for page in found:
        left, right = [], []
        for l in page.splitlines():
            for m in pat.finditer(l):
                (left if m.start() < 60 else right).append((m.group(1), m.group(2).strip(), m.group(3)))
        seq += left + right
    out = {"totals": {}, "kenyan": [], "kenyan_so_stated": None, "non_kenyan": []}
    section = "head"
    for num, name, raw in seq:
        val = int(raw.replace(",", ""))
        if num is None:
            if name in ("TOTAL POPULATION", "KENYANS", "NON KENYANS", "NOT STATED") and section == "head":
                out["totals"][name] = val
                if name == "NOT STATED":
                    section = "kenyan"
            elif name == "NON-KENYANS":
                section = "non"
            elif name == "KENYAN SO STATED":
                out["kenyan_so_stated"] = val
            continue
        if section == "kenyan":
            out["kenyan"].append((name, val))
        elif section == "non":
            out["non_kenyan"].append((name, val))
    return out


def ethnicity_checks(e: dict) -> tuple[list[str], list[str]]:
    ok, bad = [], []
    t = e["totals"]
    kenyan = sum(v for _n, v in e["kenyan"]) + (e["kenyan_so_stated"] or 0)
    (ok if kenyan == t["KENYANS"] else bad).append(f"Kenyan communities and 'Kenyan so stated' add to {kenyan:,}, Kenyans {t['KENYANS']:,}")
    whole = t["KENYANS"] + t["NON KENYANS"] + t["NOT STATED"]
    (ok if whole == t["TOTAL POPULATION"] else bad).append(f"Kenyans + non-Kenyans + not stated = {whole:,}, total {t['TOTAL POPULATION']:,}")
    non = sum(v for _n, v in e["non_kenyan"])
    (ok if non == t["NON KENYANS"] else bad).append(f"non-Kenyan nationalities add to {non:,}, non-Kenyans {t['NON KENYANS']:,}")
    return ok, bad


def stage_ethnicity(conn, store, pdf_path, jurisdiction: str = "ke") -> dict:
    """National group counts by ethnic community (Table 2.31). Only the Kenyan communities are staged; non-Kenyan nationalities do not
    add to their total (457,290 against 463,562) and stay out. Counts are for groups, never for individuals."""
    import json

    path = Path(pdf_path)
    meta = json.loads(Path(str(path) + ".provenance.json").read_text())
    data = path.read_bytes()
    e = parse_ethnicity(read_pages(data))
    ok, bad = ethnicity_checks(e)
    if not ok or not any("Kenyan communities" in m for m in ok):
        raise ValueError(f"Table 2.31 Kenyan total does not reconcile: {bad}")
    slug = lambda n: re.sub(r"[^a-z0-9]+", "-", n.lower()).strip("-")  # noqa: E731
    members = [(slug(n), n.title(), v) for n, v in e["kenyan"]] + [("kenyan-so-stated", "Kenyan (so stated)", e["kenyan_so_stated"]), ("non-kenyans", "Non-Kenyans", e["totals"]["NON KENYANS"]), ("not-stated", "Not stated", e["totals"]["NOT STATED"])]
    d = ref("statistical.dimensions", code="ethnicity")
    obs, links = [], []
    for i, (code, _label, v) in enumerate(members):
        oid = stable_id(DATASET, "census.population-by-ethnicity", jurisdiction, PERIOD, VINTAGE, code)
        obs.append({"_seg": f"t2.31-{code}", "id": oid, "tableId": ref("statistical.datasets", code=DATASET), "indicatorId": ref("statistical.indicators", code="census.population-by-ethnicity"), "periodId": ref("statistical.periods", code=PERIOD), "geoUnitId": ref("geography.units", code=jurisdiction), "vintageId": ref("statistical.vintages", code=VINTAGE), "numericValue": f"{v:.4f}", "confidenceLevel": "high", "estimateKind": "census", "measureType": "count", "releaseLabel": "KNBS 2019 Census Vol. IV, Table 2.31, national"})
        links.append({"_seg": f"t2.31-{code}-dim", "observationId": oid, "dimensionId": d, "memberId": ref("statistical.dimension_members", dimensionId=d, code=code)})
    groups = [
        Group("indicator", "statistical.indicators", ["code"], [{"code": "census.population-by-ethnicity", "name": "Population by ethnic community", "unitOfMeasure": "persons", "definition": "Group counts of persons by ethnic community or nationality as stated in the 2019 census; categories are those of the source and are not comparable across censuses. Never combined with other data to identify individuals.", "categoryId": ref("statistical.categories", code="population")}]),
        Group("dimension", "statistical.dimensions", ["code"], [{"code": "ethnicity", "name": "Ethnic community or nationality", "description": "Top-level communities of Table 2.31 of the 2019 census Volume IV; group counts only."}]),
        Group("dimension_member", "statistical.dimension_members", ["dimensionId", "code"], [{"dimensionId": d, "code": c, "label": l, "sortOrder": i} for i, (c, l, _v) in enumerate(members)]),
        Group("observation", "statistical.observations", ["id"], obs),
        Group("observation_dimension", "statistical.observation_dimensions", ["observationId", "dimensionId"], links),
    ]
    pub = statload.publisher(conn, "ke-knbs", "Kenya National Bureau of Statistics", website_url="https://www.knbs.or.ke")
    source = statload.preserve(conn, store, data, path.name.split("-", 1)[1], pub, "2019 Kenya Population and Housing Census, Volume IV: Distribution of Population by Socio-Economic Characteristics", meta["url"], "Unassessed (KNBS publishes the report on its website; reuse terms not yet checked)", "Kenya National Bureau of Statistics, 2019 Kenya Population and Housing Census, Volume IV, November 2019.", "gated-fetch", "application/pdf", kind="census_report", jurisdiction=jurisdiction)
    staged = statload.stage(conn, store, source, "knbs-census-vol4-ethnicity", "1", f"census/{jurisdiction}/2019-vol-4-ethnicity", groups, [{"level": "info", "code": "checks", "message": m} for m in ok] + [{"level": "warning", "code": "held_back", "message": m + " (non-Kenyan nationalities not staged)"} for m in bad])
    return {"checks_passed": ok, "held_back": bad, "runs": staged.runs, "members": len(members)}
