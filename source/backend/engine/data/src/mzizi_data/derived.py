"""Derived indicators: values computed from other values, with their inputs and formula kept.

A derived observation is never typed in. Each formula in the registry names its inputs, its version and its unit; the value is
recomputed from the current input observations and staged like any other candidate (so a change is a new version, the old value
stays as history). Every derived observation points at its input observations in `observation_derivations`, with the formula
and version in `computation`. A missing or zero denominator produces no value, only a count in the report.

`stale()` lists current derived observations whose inputs are no longer current; running the formula again replaces them.
"""
from __future__ import annotations

import json
from dataclasses import dataclass
from decimal import Decimal

import psycopg

from . import statload
from .files import LocalDirectoryStore
from .statload import Group, ref

PUBLISHER = ("mzizi-derived", "Mzizi derived computations")
DATASET = "mzizi/derived-indicators"
CATEGORY = ("derived", "Derived indicators")
PERIOD_CENSUS = "day/2019-08-24"


@dataclass(frozen=True)
class Formula:
    id: str
    version: str
    indicator: str
    name: str
    unit: str
    measure: str
    definition: str
    inputs: tuple[str, ...]

    @property
    def vintage(self) -> str:
        return f"derived/{self.id}@{self.version}"

    @property
    def computation(self) -> str:
        return f"{self.id} v{self.version}"


FORMULAS: dict[str, Formula] = {
    f.id: f
    for f in (
        Formula("density", "1", "derived.population-density", "Population density", "persons per km2", "ratio", "2019 census population divided by the area in square kilometres computed from the unit's boundary shape.", ("census.population", "geography.area_km2")),
        Formula("voters-per-population", "1", "derived.registered-voters-per-population", "Registered voters per head of 2019 population", "ratio", "ratio", "Voters on the 2022 register divided by the 2019 census population of the same unit (different reference years; adults are not separated).", ("electoral.electorates.registered_voters", "census.population")),
        Formula("ngcdf-per-person", "1", "derived.ngcdf-allocation-per-person", "NG-CDF allocation per person", "KES per person", "ratio", "Approved NG-CDF allocation of the 2019/20 financial year divided by the 2019 census population of the constituency.", ("finance.budgets.approved_amount", "census.population")),
        Formula("ngcdf-per-km2", "1", "derived.ngcdf-allocation-per-km2", "NG-CDF allocation per square kilometre", "KES per km2", "ratio", "Approved NG-CDF allocation of the 2019/20 financial year divided by the computed area of the constituency.", ("finance.budgets.approved_amount", "geography.area_km2")),
        Formula("turnout", "1", "derived.turnout", "Turnout", "ratio", "ratio", "Votes cast divided by registered voters for the same election, unit and level.", ("electoral.electorates.votes_cast", "electoral.electorates.registered_voters")),
        Formula("vote-share", "1", "derived.vote-share", "Vote share", "ratio", "ratio", "A candidate's votes divided by valid votes.", ("electoral.results.votes", "electoral.electorates.valid_votes")),
    )
}


def divide(numerator, denominator) -> Decimal | None:
    """None for a missing or zero denominator (the value is then not stored)."""
    if numerator is None or denominator is None or Decimal(denominator) == 0:
        return None
    return Decimal(numerator) / Decimal(denominator)


_OBS = """SELECT o.id::text AS id, u.code AS unit, o.numeric_value
            FROM statistical.observations o JOIN statistical.indicators i ON i.id = o.indicator_id AND i.code = %s
            JOIN geography.units u ON u.id = o.geo_unit_id
           WHERE o.is_current {extra}"""
_NO_DIM = "AND NOT EXISTS (SELECT 1 FROM statistical.observation_dimensions d WHERE d.observation_id = o.id)"


def _by_unit(conn, indicator: str, extra: str = "") -> dict[str, tuple[str, Decimal]]:
    return {r["unit"]: (r["id"], r["numeric_value"]) for r in conn.execute(_OBS.format(extra=extra), (indicator,)).fetchall()}


def inputs(conn: psycopg.Connection, formula: str) -> list[dict]:
    """[{unit, value, parts: [(role, observation id or None, value, label)]}] for every unit that has all inputs."""
    pop = _by_unit(conn, "census.population", _NO_DIM)
    area = _by_unit(conn, "geography.area_km2")
    out: list[dict] = []
    if formula == "density":
        for unit, (pid, p) in pop.items():
            if unit in area:
                aid, a = area[unit]
                out.append({"unit": unit, "numerator": p, "denominator": a, "inputs": [("population", pid), ("area", aid)], "label": "census 2019 / computed area"})
    elif formula == "voters-per-population":
        for r in conn.execute(
            """SELECT u.code AS unit, e.id::text AS eid, e.registered_voters FROM electoral.electorates e JOIN electoral.elections el ON el.id = e.election_id AND el.code = 'ke/election/2022-08-09/general'
                 JOIN geography.units u ON u.id = e.geo_unit_id WHERE e.is_current AND e.registered_voters IS NOT NULL"""
        ).fetchall():
            if r["unit"] in pop:
                pid, p = pop[r["unit"]]
                out.append({"unit": r["unit"], "numerator": r["registered_voters"], "denominator": p, "inputs": [("population", pid)], "label": f"2022 register (electorate {r['eid']}) / census 2019"})
    elif formula in ("ngcdf-per-person", "ngcdf-per-km2"):
        for r in conn.execute(
            """SELECT g.code AS unit, b.id::text AS bid, b.approved_amount FROM finance.budgets b JOIN finance.units fu ON fu.id = b.unit_id JOIN finance.years y ON y.id = b.fiscal_year_id AND y.code = 'fy/ke/2019/20'
                 JOIN geography.units g ON g.id = fu.geo_unit_id WHERE b.is_current AND fu.code LIKE 'ke/ngcdf/%%' AND b.kind = 'original'"""
        ).fetchall():
            den = pop if formula == "ngcdf-per-person" else area
            if r["unit"] in den:
                did, d = den[r["unit"]]
                out.append({"unit": r["unit"], "numerator": r["approved_amount"], "denominator": d, "inputs": [("denominator", did)], "label": f"NG-CDF 2019/20 allocation (budget {r['bid']}) / {'census 2019 population' if formula == 'ngcdf-per-person' else 'computed area'}"})
    else:
        raise ValueError(f"{formula} has no inputs loaded yet (electoral results and turnout are not in the database)")
    return out


def run(conn: psycopg.Connection, store: LocalDirectoryStore, formula_id: str, jurisdiction: str = "ke") -> dict:
    f = FORMULAS[formula_id]
    rows, skipped = [], 0
    comp = []
    for item in inputs(conn, formula_id):
        value = divide(item["numerator"], item["denominator"])
        if value is None:
            skipped += 1
            continue
        comp.append({"unit": item["unit"], "value": str(value), "inputs": item["inputs"], "from": item["label"]})
        rows.append(item | {"value": value})
    pub = statload.publisher(conn, *PUBLISHER)
    report = json.dumps({"formula": f.computation, "definition": f.definition, "rows": comp}, sort_keys=True, default=str).encode()
    source = statload.preserve(conn, store, report, f"derived-{f.id}-v{f.version}.json", pub, f"Derived indicator: {f.name} ({f.computation})", None, "Derived by Mzizi from its inputs; inherits the licences of the input sources", f"Computed by formula {f.computation}: {f.definition}", "derived-indicators", "application/json")
    J = ref("reference.jurisdictions", code=jurisdiction)
    obs, links = [], []
    for r in rows:
        key = dict(tableId=ref("statistical.datasets", code=DATASET), indicatorId=ref("statistical.indicators", code=f.indicator), periodId=ref("statistical.periods", code=PERIOD_CENSUS), geoUnitId=ref("geography.units", code=r["unit"]), vintageId=ref("statistical.vintages", code=f.vintage))
        obs.append({"_seg": f"{f.id}-{r['unit']}", **key, "numericValue": f"{r['value']:.4f}", "confidenceLevel": "estimate", "estimateKind": "derived", "measureType": f.measure, "releaseLabel": r["label"][:200]})
        for role, input_id in r["inputs"]:
            links.append({"_seg": f"{f.id}-{r['unit']}-{role}", "observationId": ref("statistical.observations", **key), "inputObservationId": input_id, "inputRole": role, "computation": f.computation})
    groups = [
        Group("category", "statistical.categories", ["code"], [{"code": CATEGORY[0], "label": CATEGORY[1]}]),
        Group("indicator", "statistical.indicators", ["code"], [{"code": f.indicator, "name": f.name, "unitOfMeasure": f.unit, "definition": f.definition, "categoryId": ref("statistical.categories", code=CATEGORY[0])}]),
        Group("vintage", "statistical.vintages", ["code"], [{"code": f.vintage, "label": f"formula {f.computation}"}]),
        Group("dataset", "statistical.datasets", ["code"], [{"code": DATASET, "title": "Derived indicators computed by Mzizi", "collector": PUBLISHER[1], "methodology": "Each value is a registered formula applied to current input observations; see observation_derivations.", "jurisdictionId": J}]),
        Group("observation", "statistical.observations", ["tableId", "indicatorId", "periodId", "geoUnitId", "vintageId"], obs, method="inferred"),
        Group("derivation", "statistical.observation_derivations", ["observationId", "inputObservationId"], links, method="inferred"),
    ]
    staged = statload.stage(conn, store, source, "derived-indicators", f.version, f"derived/{f.id}", groups)
    return {"formula": f.computation, "computed": len(rows), "skipped_missing_or_zero_denominator": skipped, "runs": staged.runs, "stats": staged.stats}


def stale(conn: psycopg.Connection) -> list[dict]:
    """Current derived observations that have an input observation which is no longer current."""
    return conn.execute(
        """SELECT DISTINCT o.id::text AS observation, v.code AS formula FROM statistical.observations o JOIN statistical.vintages v ON v.id = o.vintage_id AND v.code LIKE 'derived/%%'
             JOIN statistical.observation_derivations d ON d.observation_id = o.id JOIN statistical.observations i ON i.id = d.input_observation_id
            WHERE o.is_current AND NOT i.is_current"""
    ).fetchall()
