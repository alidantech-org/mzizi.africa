"""Statistical quality: rules over loaded statistics, findings with the figures involved, and a review path.

A finding is a disagreement or an implausible figure, never a silent correction. Rules are small functions over plain figures
(so they are tested with deliberately inconsistent fixtures) plus SQL that feeds them from the database. A finding is stored once
(by fingerprint) in `engine.quality_findings`; an account holding `review.decide` can accept, resolve or dispute it. A decision is
also written as a row in `audit.decisions`, and disputing a figure adds a `disputed` verification to the observation, so the
figure stays visible with that state until someone resolves it. Source rankings are not coded: the reviewer decides which figure is
canonical and the other stays as history.
"""
from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass, field

import psycopg
from psycopg.types.json import Jsonb

AREA_TOLERANCE = 0.05
MAX_DENSITY = 50_000.0  # persons per km2; the densest census unit in Kenya is about 25,000
MAX_VOTERS_PER_HEAD = 0.75  # registered voters above this share of total population are implausible for Kenya


@dataclass
class Finding:
    rule: str
    severity: str
    target_kind: str
    message: str
    figures: dict
    target_id: str | None = None
    unit: str | None = None
    source_a: str | None = None
    source_b: str | None = None

    @property
    def fingerprint(self) -> str:
        return hashlib.sha256(json.dumps([self.rule, self.target_kind, self.target_id, self.unit, self.figures], sort_keys=True, default=str).encode()).hexdigest()


# ------------------------------------------------------------------ pure rules

def parent_equals_children(parent: str, parent_value: float, children: dict[str, float | None], rule: str, tolerance: float = 0.0) -> list[Finding]:
    """The parent's figure must equal the sum of the children that have one; children without a figure are listed as missing."""
    present = {k: v for k, v in children.items() if v is not None}
    missing = sorted(k for k, v in children.items() if v is None)
    out = []
    total = sum(present.values())
    if abs(total - parent_value) > tolerance * max(parent_value, 1):
        out.append(Finding(rule, "warning", "statistical.observations", f"{parent}: children add to {total:,.0f}, parent is {parent_value:,.0f}", {"parent": parent_value, "children_sum": total, "missing_children": missing}, unit=parent))
    elif missing:
        out.append(Finding(rule + ".missing", "info", "statistical.observations", f"{parent}: {len(missing)} of {len(children)} children have no figure", {"missing_children": missing}, unit=parent))
    return out


def cross_source(unit: str, a_name: str, a: float, b_name: str, b: float, rule: str, tolerance: float = AREA_TOLERANCE) -> list[Finding]:
    if b == 0 and a == 0:
        return []
    diff = abs(a - b) / max(abs(b), 1e-9)
    if diff > tolerance:
        return [Finding(rule, "warning" if diff < 0.25 else "error", "statistical.observations", f"{unit}: {a_name} {a:,.1f} against {b_name} {b:,.1f} ({diff:.1%} apart)", {a_name: a, b_name: b, "difference": round(diff, 4)}, unit=unit, source_a=a_name, source_b=b_name)]
    return []


def plausibility(unit: str, rule: str, value: float, upper: float, what: str) -> list[Finding]:
    return [Finding(rule, "error", "statistical.observations", f"{unit}: {what} {value:,.2f} is above the plausible bound {upper:,.2f}", {"value": value, "bound": upper}, unit=unit)] if value > upper else []


def missing_siblings(parent: str, figures: dict[str, float | None], rule: str) -> list[Finding]:
    have = [k for k, v in figures.items() if v is not None]
    gone = sorted(k for k, v in figures.items() if v is None)
    if have and gone:
        return [Finding(rule, "info", "statistical.observations", f"{parent}: {len(gone)} of {len(figures)} siblings lack the figure their siblings have", {"missing": gone}, unit=parent)]
    return []


# ------------------------------------------------------------------ database feed

def run_rules(conn: psycopg.Connection) -> list[Finding]:
    out: list[Finding] = []
    # official KNBS land area against the area computed from the boundary shape
    for r in conn.execute(
        """SELECT u.code, o.id::text AS oid, o.numeric_value AS official, c.numeric_value AS computed
             FROM statistical.observations o JOIN statistical.indicators i ON i.id = o.indicator_id AND i.code = 'geography.official_land_area_km2'
             JOIN geography.units u ON u.id = o.geo_unit_id
             JOIN statistical.observations c ON c.geo_unit_id = o.geo_unit_id AND c.is_current AND c.indicator_id = (SELECT id FROM statistical.indicators WHERE code = 'geography.area_km2')
            WHERE o.is_current"""
    ).fetchall():
        for f in cross_source(r["code"], "KNBS land area km2", float(r["official"]), "computed from boundary shape km2", float(r["computed"]), "area.official-vs-computed"):
            f.target_id = r["oid"]
            out.append(f)
    # national census count against the World Bank series for the census year (an independent compilation of UN and national estimates)
    for r in conn.execute(
        """SELECT o.id::text AS oid, o.numeric_value AS census, w.numeric_value AS wb FROM statistical.observations o JOIN statistical.indicators i ON i.id = o.indicator_id AND i.code = 'census.population'
             JOIN geography.units u ON u.id = o.geo_unit_id AND u.code = 'ke'
             JOIN statistical.observations w ON w.is_current AND w.indicator_id = (SELECT id FROM statistical.indicators WHERE code = 'SP.POP.TOTL') AND w.period_id = (SELECT id FROM statistical.periods WHERE code = 'year/2019')
            WHERE o.is_current AND NOT EXISTS (SELECT 1 FROM statistical.observation_dimensions d WHERE d.observation_id = o.id)"""
    ).fetchall():
        for f in cross_source("ke", "KNBS 2019 census count", float(r["census"]), "World Bank SP.POP.TOTL 2019", float(r["wb"]), "population.knbs-vs-worldbank", 0.02):
            f.target_id = r["oid"]
            out.append(f)
    # density bound
    for r in conn.execute("SELECT u.code, o.id::text AS oid, o.numeric_value FROM statistical.observations o JOIN statistical.indicators i ON i.id = o.indicator_id AND i.code = 'derived.population-density' JOIN geography.units u ON u.id = o.geo_unit_id WHERE o.is_current").fetchall():
        for f in plausibility(r["code"], "density.bound", float(r["numeric_value"]), MAX_DENSITY, "density"):
            f.target_id = r["oid"]
            out.append(f)
    # voters against population
    for r in conn.execute("SELECT u.code, o.id::text AS oid, o.numeric_value FROM statistical.observations o JOIN statistical.indicators i ON i.id = o.indicator_id AND i.code = 'derived.registered-voters-per-population' JOIN geography.units u ON u.id = o.geo_unit_id WHERE o.is_current").fetchall():
        for f in plausibility(r["code"], "voters.exceed-population", float(r["numeric_value"]), MAX_VOTERS_PER_HEAD, "registered voters per head of population"):
            f.target_id = r["oid"]
            out.append(f)
    # county population against the sum of constituency populations that carry a figure (sub-county names matched to constituencies)
    for r in conn.execute(
        """SELECT p.code AS county, po.numeric_value AS county_pop, po.id::text AS oid,
                  jsonb_object_agg(c.code, co.numeric_value) AS children
             FROM geography.units p JOIN statistical.observations po ON po.geo_unit_id = p.id AND po.is_current AND po.indicator_id = (SELECT id FROM statistical.indicators WHERE code = 'census.population')
                  AND NOT EXISTS (SELECT 1 FROM statistical.observation_dimensions d WHERE d.observation_id = po.id)
             JOIN geography.units c ON c.parent_id = p.id AND c.level_id IN (SELECT id FROM reference.classifications WHERE "order" = 2 AND scheme = 'geography/level')
             LEFT JOIN statistical.observations co ON co.geo_unit_id = c.id AND co.is_current AND co.indicator_id = po.indicator_id AND NOT EXISTS (SELECT 1 FROM statistical.observation_dimensions d WHERE d.observation_id = co.id)
            GROUP BY p.code, po.numeric_value, po.id"""
    ).fetchall():
        children = {k: (float(v) if v is not None else None) for k, v in r["children"].items()}
        for f in parent_equals_children(r["county"], float(r["county_pop"]), children, "population.county-vs-constituencies"):
            f.target_id = r["oid"]
            f.source_a = "KNBS 2019 county"
            f.source_b = "KNBS 2019 sub-counties matched by name"
            out.append(f)
    # register: wards against constituency against county for every election
    for r in conn.execute(
        """SELECT el.code AS election, p.code AS parent, pe.registered_voters AS parent_voters, pe.id::text AS eid, jsonb_object_agg(c.code, ce.registered_voters) AS children
             FROM electoral.electorates pe JOIN electoral.elections el ON el.id = pe.election_id AND pe.is_current
             JOIN geography.units p ON p.id = pe.geo_unit_id
             JOIN geography.units c ON c.parent_id = p.id
             JOIN electoral.electorates ce ON ce.geo_unit_id = c.id AND ce.election_id = pe.election_id AND ce.is_current
            WHERE pe.registered_voters IS NOT NULL
            GROUP BY el.code, p.code, pe.registered_voters, pe.id"""
    ).fetchall():
        children = {k: (float(v) if v is not None else None) for k, v in r["children"].items()}
        for f in parent_equals_children(f"{r['election']} {r['parent']}", float(r["parent_voters"]), children, "register.parent-vs-children"):
            f.target_id = r["eid"]
            f.target_kind = "electoral.electorates"
            out.append(f)
    return out


def store(conn: psycopg.Connection, findings: list[Finding]) -> dict:
    new = 0
    for f in findings:
        row = conn.execute(
            """INSERT INTO engine.quality_findings (rule, severity, target_kind, target_id, geo_unit_code, source_a, source_b, figures, message, fingerprint)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (fingerprint) DO NOTHING RETURNING id""",
            (f.rule, f.severity, f.target_kind, f.target_id, f.unit, f.source_a, f.source_b, Jsonb(f.figures), f.message[:2000], f.fingerprint),
        ).fetchone()
        new += row is not None
    conn.commit()
    return {"found": len(findings), "new": new}


def decide(conn: psycopg.Connection, finding_id: str, actor: str, decision: str, rationale: str) -> str:
    """decision: accept (the figure is fine as published), resolve (corrected or explained), dispute (the figure is contested)."""
    status = {"accept": "accepted", "resolve": "resolved", "dispute": "disputed"}[decision]
    if not rationale.strip():
        raise ValueError("a rationale is required")
    allowed = conn.execute("SELECT 1 FROM access.account_permissions WHERE account_id = %s AND permission_code = 'review.decide' LIMIT 1", (actor,)).fetchone()
    if not allowed:
        raise PermissionError("the account does not hold review.decide")
    f = conn.execute("SELECT * FROM engine.quality_findings WHERE id = %s", (finding_id,)).fetchone()
    if not f:
        raise KeyError(finding_id)
    decision_id = None
    if f["target_id"]:
        proposed = "disputed" if status == "disputed" else "unverified"
        decision_id = conn.execute(
            """INSERT INTO audit.decisions (target_kind, target_id, decision, proposed_state, rationale, reviewer_id, created_at, updated_at, version)
               VALUES (%s, %s, %s, %s, %s, %s, now(), now(), 1) RETURNING id""",
            (f["target_kind"], f["target_id"], "dispute" if status == "disputed" else "approve", proposed, f"quality finding {f['rule']}: {rationale}"[:4000], actor),
        ).fetchone()["id"]
        if status == "disputed":
            conn.execute("UPDATE source.verifications SET is_current = false, updated_at = now() WHERE target_kind = %s AND target_id = %s AND is_current", (f["target_kind"], f["target_id"]))
            conn.execute(
                """INSERT INTO source.verifications (target_kind, target_id, state, decision_id, decided_by, rationale, is_current, created_at, updated_at, version)
                   VALUES (%s, %s, 'disputed', %s, %s, %s, true, now(), now(), 1)""",
                (f["target_kind"], f["target_id"], decision_id, actor, rationale),
            )
    conn.execute("UPDATE engine.quality_findings SET status = %s, decided_by = %s, decision_rationale = %s, decided_at = now(), decision_id = %s, updated_at = now() WHERE id = %s", (status, actor, rationale, decision_id, finding_id))
    conn.commit()
    return status


def report(conn: psycopg.Connection) -> dict:
    """Findings per rule and severity, observation counts per indicator and geography level (coverage), for the status document."""
    findings = conn.execute("SELECT rule, severity, status, count(*) AS n FROM engine.quality_findings GROUP BY 1, 2, 3 ORDER BY 1, 2, 3").fetchall()
    coverage = conn.execute(
        """SELECT i.code AS indicator, l.code AS level, count(*) AS n FROM statistical.observations o JOIN statistical.indicators i ON i.id = o.indicator_id
             JOIN geography.units u ON u.id = o.geo_unit_id JOIN reference.classifications l ON l.id = u.level_id WHERE o.is_current GROUP BY 1, 2 ORDER BY 1, 2"""
    ).fetchall()
    return {"findings": findings, "coverage": coverage}
