"""Links KNBS sub-counties to constituencies with a score, as claims.

KNBS counts sub-counties; Mzizi's tree has constituencies. Names agree for many units and not for others, and no sub-county shapes
exist, so the evidence for a link is (1) the county the two share, (2) the similarity of the normalised names and (3) the
agreement between the land area KNBS published and the area computed from the constituency's boundary shape. The score is
0.6 * name similarity + 0.4 * area agreement; each constituency can be claimed by one sub-county and the best candidate must lead the
second by 0.1. A score of at least 0.75 is a medium claim, 0.6 to 0.75 a low claim, anything below is left unlinked. None of
them is written as a canonical observation: each is a claim on the constituency (field `census_2019_population_total`)
attributed to the Volume I document, to be accepted or rejected by a reviewer. Canonical rows that were linked by exact name
are checked against the same area evidence and weak ones are reported (and disputed by the caller).
"""
from __future__ import annotations

from difflib import SequenceMatcher

import psycopg

from . import reinforcement, register, statload
from .geo_link import GeoResolver, norm
from .imports import census as census_mod

FIELD = "census_2019_population_total"
NAME_WEIGHT, AREA_WEIGHT = 0.6, 0.4
MEDIUM, LOW, MARGIN = 0.75, 0.6, 0.1


def name_similarity(a: str, b: str) -> float:
    a, b = norm(a), norm(b)
    if not a or not b:
        return 0.0
    if a == b:
        return 1.0
    ratio = SequenceMatcher(None, a, b).ratio()
    if a in b or b in a:
        ratio = max(ratio, 0.85 * min(len(a), len(b)) / max(len(a), len(b)) + 0.15)
    return ratio


def area_agreement(official: float | None, computed: float | None) -> float:
    if not official or not computed:
        return 0.0
    return min(official, computed) / max(official, computed)


def score(name_a: str, name_b: str, official: float | None, computed: float | None) -> float:
    return NAME_WEIGHT * name_similarity(name_a, name_b) + AREA_WEIGHT * area_agreement(official, computed)


def assign(subs: list[dict], constituencies: list[dict]) -> list[dict]:
    """subs: [{name, area, value}], constituencies: [{code, name, area}] of one county -> [{sub, code, score, margin, grade}] best one-to-one."""
    pairs = []
    for s in subs:
        scored = sorted(((score(s["name"], c["name"], s["area"], c["area"]), c) for c in constituencies), key=lambda x: -x[0])
        if scored:
            margin = scored[0][0] - (scored[1][0] if len(scored) > 1 else 0.0)
            pairs.append((scored[0][0], margin, s, scored[0][1]))
    out, used = [], set()
    for sc, margin, s, c in sorted(pairs, key=lambda x: -x[0]):
        if c["code"] in used or margin < MARGIN or sc < LOW:
            continue
        used.add(c["code"])
        out.append({"sub": s, "code": c["code"], "score": round(sc, 4), "margin": round(margin, 4), "grade": "medium" if sc >= MEDIUM else "low"})
    return out


def run(conn: psycopg.Connection, pdf_bytes: bytes, jurisdiction: str = "ke", write: bool = True) -> dict:
    resolver = GeoResolver(conn, jurisdiction)
    parsed = census_mod.parse(census_mod.read_pages(pdf_bytes))
    areas = {r["code"]: float(r["v"]) for r in conn.execute("SELECT u.code, o.numeric_value AS v FROM statistical.observations o JOIN statistical.indicators i ON i.id = o.indicator_id AND i.code = 'geography.area_km2' JOIN geography.units u ON u.id = o.geo_unit_id WHERE o.is_current").fetchall()}
    canonical = {r["code"] for r in conn.execute("SELECT u.code FROM statistical.observations o JOIN statistical.indicators i ON i.id = o.indicator_id AND i.code = 'census.population' JOIN geography.units u ON u.id = o.geo_unit_id JOIN reference.classifications l ON l.id = u.level_id AND l.\"order\" = 2 WHERE o.is_current").fetchall()}
    by_county: dict[str, list] = {}
    for u in parsed.units:
        if u.level == "sub-county" and not u.problems:
            by_county.setdefault(census_mod.COUNTY_ALIAS.get(norm(u.county or ""), norm(u.county or "")), []).append(u)
    doc = conn.execute("SELECT d.id AS d, c.id AS c FROM source.documents d JOIN source.captures c ON c.document_id = d.id WHERE d.title LIKE '2019 Kenya Population and Housing Census, Volume I:%%' ORDER BY c.created_at DESC LIMIT 1").fetchone()
    method = register.ensure_method(conn, "inferred", "sub-county to constituency link by name similarity and area agreement", "census-links", "1")
    report = {"claims": [], "left_unlinked": [], "weak_canonical": [], "canonical_checked": 0}
    for key, subs in by_county.items():
        county_code = resolver.counties.get(key)
        if not county_code:
            continue
        pool = [{"code": code, "name": cname, "area": areas.get(code)} for cname, code in ((n, c) for n, c in resolver.children.get((2, county_code), {}).items())]
        todo = []
        for s in subs:
            exact = resolver.children.get((2, county_code), {}).get(norm(s.name))
            if exact and exact in canonical:
                report["canonical_checked"] += 1
                ag = area_agreement(s.land_area, areas.get(exact))
                if ag < 0.6:
                    report["weak_canonical"].append({"unit": exact, "sub_county": s.name, "knbs_area": s.land_area, "computed_area": round(areas.get(exact) or 0, 1), "area_agreement": round(ag, 3)})
            else:
                todo.append({"name": s.name, "area": s.land_area, "value": s.total, "page": s.page})
        free = [c for c in pool if c["code"] not in canonical]
        linked = {a["sub"]["name"]: a for a in assign(todo, free)}
        for s in todo:
            a = linked.get(s["name"])
            if not a:
                report["left_unlinked"].append(f"{key} / {s['name']}")
                continue
            report["claims"].append({"sub_county": s["name"], "unit": a["code"], "score": a["score"], "grade": a["grade"], "value": s["value"]})
            if write:
                unit_id = conn.execute("SELECT id FROM geography.units WHERE code = %s AND is_current", (a["code"],)).fetchone()["id"]
                attr = conn.execute(
                    """INSERT INTO source.attributions (document_id, capture_id, method_id, target_kind, target_id, relation, locator, confidence, target_field, attributed_by, created_at, updated_at, version)
                       VALUES (%s, %s, %s, 'geography.units', %s, 'supports', %s, %s, %s, %s, now(), now(), 1) RETURNING id""",
                    (doc["d"], doc["c"], method, unit_id, f"Vol. I Table 2.5 p.{s['page']}: sub-county {s['name']} (score {a['score']}, {a['grade']})"[:500], a["score"], FIELD, statload.AGENT_ACCOUNT),
                ).fetchone()["id"]
                reinforcement.add_claim(conn, "geography.units", unit_id, FIELD, {"value": s["value"], "subCounty": s["name"], "score": a["score"], "grade": a["grade"], "method": "name similarity and area agreement"}, attr)
    if write:
        conn.commit()
    return report
