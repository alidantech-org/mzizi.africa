"""Civic money and works: the NG-CDF allocations read from the scraped PDFs, constituency funds for every constituency, the
Political Parties Fund, the tenders collected from the public tenders portal, and project locations.

The five Nairobi constituencies carry the published allocation lines (amounts, project names, status). The other 285
constituencies carry a modelled allocation for one year, flagged as development data. Project locations are approximate
points inside the unit's outline."""

from __future__ import annotations

import csv
import datetime as dt
import json
import random
from pathlib import Path

import yaml
from shapely.geometry import MultiPolygon, Point

from dev_seed.common import ROOT, Feature, Row, slug
from dev_seed.ngcdf import Allocation, read_allocations
from dev_seed.people import Builder
from dev_seed.real import PartyAllocation
from dev_seed.store import Tables

TENDERS = ROOT / ".dev/sources/ke-tenders"
TENDER_RECORDS = ROOT / ".dev/runs/tenders-active-full/records.csv"
TODAY = dt.date(2026, 11, 18)
PROJECT_CLASSES = {
    "education-infrastructure",
    "roads-and-drainage",
    "health-infrastructure",
    "security-and-administration",
    "other-projects",
}
MODEL_SPLIT = {
    "salaries": 0.04,
    "running-costs": 0.06,
    "committee": 0.03,
    "bursary": 0.26,
    "emergency": 0.05,
    "capacity-building": 0.01,
    "education-infrastructure": 0.4,
    "roads-and-drainage": 0.08,
    "health-infrastructure": 0.05,
    "other-projects": 0.02,
}


def point_in(geometry: MultiPolygon, rng: random.Random) -> Point:
    minx, miny, maxx, maxy = geometry.bounds
    for _ in range(200):
        p = Point(rng.uniform(minx, maxx), rng.uniform(miny, maxy))
        if geometry.contains(p):
            return p
    return geometry.representative_point()


def _fiscal(t: Tables, start: int) -> str:
    code = f"ke.fiscal-period.fy-{start}-{start + 1}"
    if not any(r["code"] == code for r in t.rows("ke/finance/fiscal_periods.csv")):
        t.add(
            "ke/finance/fiscal_periods.csv",
            {
                "code": code,
                "starts_on": f"{start}-07-01",
                "ends_on": f"{start + 1}-06-30",
                "period_kind_code": "fin.period.kind.financial-year",
                "country_code": "ke",
            },
        )
    return code


def _status(allocation: Allocation) -> str:
    if allocation.status == "ongoing":
        return "civ.project.status.ongoing"
    return "civ.project.status.completed" if allocation.year_to <= 2023 else "civ.project.status.planned"


def build_ngcdf(b: Builder, t: Tables, constituencies: list[Feature], geometries: dict[str, MultiPolygon]) -> None:
    allocations = read_allocations()
    real = {a.constituency.lower() for a in allocations}
    by_name = {c.name.lower(): c for c in constituencies}
    for item in constituencies:
        county, local = item.code.split(".")[1:3]
        institution = f"ke.institution.ngcdf.{county}.{local}"
        b.entity(institution, "ofc.entity.kind.public-body", f"NG-CDF {item.name} Constituency Committee")
        b.institutions.append(
            {
                "code": institution,
                "entity_code": institution,
                "institution_kind_code": "gov.institution.kind.commission",
            }
        )
        t.add(
            "ke/finance/funds.csv",
            {
                "code": f"ke.fund.ngcdf.{county}.{local}",
                "fund_kind_code": "fin.fund.kind.development-fund",
                "managing_entity_code": institution,
                "scope_unit_feature_code": item.code,
                "country_code": "ke",
            },
        )
    sequence = 0
    counters: dict[tuple[str, int], int] = {}
    for a in allocations:
        unit = by_name.get(a.constituency.lower())
        if unit is None:
            continue
        county, local = unit.code.split(".")[1:3]
        sequence += 1
        number = counters[(unit.code, a.year_from)] = counters.get((unit.code, a.year_from), 0) + 1
        fund, institution = f"ke.fund.ngcdf.{county}.{local}", f"ke.institution.ngcdf.{county}.{local}"
        flow: Row = {
            "code": f"ke.flow.ngcdf.{county}.{local}.{a.year_from}.{number:03d}",
            "flow_kind_code": "fin.flow.kind.allocation",
            "fund_code": fund,
            "institution_code": institution,
            "scope_unit_feature_code": unit.code,
            "expenditure_class_code": f"fin.expenditure.class.{a.category}",
            "fiscal_period_code": _fiscal(t, a.year_from),
            "amount_minor_units": str(a.amount_minor_units),
            "currency_code": "fin.currency.kes",
            "occurred_on": f"{a.year_from}-07-01",
        }
        if a.category in PROJECT_CLASSES:
            rng = random.Random(f"ngcdf.project.{sequence}")
            project = f"ke.project.ngcdf.{county}.{local}.{a.year_from}.{number:03d}"
            row: Row = {
                "code": project,
                "name": f"{a.name}: {a.activities[:120]}".strip(": "),
                "description": f"{a.activities or a.name} (NG-CDF {unit.name} allocation, financial year {a.year_from}/{a.year_to}; the location shown is approximate).",
                "status_code": _status(a),
                "scope_unit_feature_code": unit.code,
                "responsible_institution_code": institution,
                "country_code": "ke",
                "started_on": f"{a.year_from}-07-01",
            }
            if unit.code in geometries:
                point = point_in(geometries[unit.code], rng)
                row["location"] = f"SRID=4326;POINT({point.x:.5f} {point.y:.5f})"
            b.projects.append(row)
            flow["project_code"] = project
        t.add("ke/finance/flows.csv", flow)
    # one modelled year for every constituency that has no published lines
    for item in constituencies:
        if item.name.lower() in real:
            continue
        county, local = item.code.split(".")[1:3]
        rng = random.Random(f"ngcdf.model.{item.code}")
        total = rng.randint(125, 165) * 1_000_000 * 100
        for cls, share in MODEL_SPLIT.items():
            t.add(
                "ke/finance/flows.csv",
                {
                    "code": f"ke.flow.ngcdf.{county}.{local}.2023.{cls}",
                    "flow_kind_code": "fin.flow.kind.allocation",
                    "fund_code": f"ke.fund.ngcdf.{county}.{local}",
                    "institution_code": f"ke.institution.ngcdf.{county}.{local}",
                    "scope_unit_feature_code": item.code,
                    "expenditure_class_code": f"fin.expenditure.class.{cls}",
                    "fiscal_period_code": _fiscal(t, 2023),
                    "amount_minor_units": str(round(total * share * rng.uniform(0.9, 1.1))),
                    "currency_code": "fin.currency.kes",
                    "occurred_on": "2023-07-01",
                },
            )


def build_party_fund(b: Builder, t: Tables, fund: list[PartyAllocation], registry_to_party: dict[str, str]) -> None:
    b.entity("ke.institution.orpp", "ofc.entity.kind.public-body", "Office of the Registrar of Political Parties")
    t.add(
        "ke/finance/funds.csv",
        {
            "code": "ke.fund.political-parties",
            "fund_kind_code": "fin.fund.kind.statutory-fund",
            "managing_entity_code": "ke.institution.orpp",
            "country_code": "ke",
        },
    )
    fiscal = _fiscal(t, 2026)
    for party in fund:
        code = registry_to_party[party.registry_code]
        t.add(
            "ke/finance/flows.csv",
            {
                "code": f"ke.flow.ppf.2026.{code}",
                "flow_kind_code": "fin.flow.kind.allocation",
                "fund_code": "ke.fund.political-parties",
                "counterparty_entity_code": f"ke.party.{code}",
                "fiscal_period_code": fiscal,
                "amount_minor_units": str(party.amount_kes * 100),
                "currency_code": "fin.currency.kes",
                "occurred_on": "2026-07-01",
            },
        )


def build_tenders(b: Builder, t: Tables, counties: list[Feature]) -> int:
    """Map the collected tender notices through `civic.mapping.yml`; returns how many were mapped."""
    mapping = yaml.safe_load((TENDERS / "civic.mapping.yml").read_text(encoding="utf-8"))
    procedure, status = mapping["lookups"]["procedure"], mapping["lookups"]["status"]
    works = set(mapping["lookups"]["scope_projects_for"])
    if not TENDER_RECORDS.exists():
        return 0
    portal = {str(c["id"]): c["name"] for c in json.loads((TENDERS / "counties.json").read_text(encoding="utf-8"))}
    county_by_slug = {c.code.split(".")[1]: c for c in counties}
    gaps: dict[str, int] = {}
    mapped = 0
    entities: set[str] = set()
    with TENDER_RECORDS.open(encoding="utf-8") as handle:
        for record in csv.DictReader(handle):
            kind = procedure.get(record["method"])
            if kind is None:
                gaps[record["method"]] = gaps.get(record["method"], 0) + 1
                continue
            buyer = f"ke.entity.tender-{slug(record['entity'])}"
            if buyer not in entities:
                entities.add(buyer)
                b.entity(buyer, "ofc.entity.kind.public-body", record["entity"].title())
            code = f"ke.procurement.tender-{record['portal_id']}"
            closes = dt.date.fromisoformat(record["closes_on"]) if record["closes_on"] else None
            row: Row = {
                "code": code,
                "buyer_entity_code": buyer,
                "procedure_kind_code": kind,
                "title": record["title"].title()[:290],
                "reference": record["reference"][:290],
                "status_code": status["open"] if closes is None or closes >= TODAY else status["closed"],
                "published_on": record["published_on"],
                "closes_on": record["closes_on"],
                "country_code": "ke",
            }
            county = county_by_slug.get(slug(portal.get(record["entity_county_id"], "")))
            if record["category"] in works and county is not None:
                project = f"ke.project.tender-{record['portal_id']}"
                b.projects.append(
                    {
                        "code": project,
                        "name": record["title"].title()[:290],
                        "description": f"{record['title'].title()}. Advertised on the Kenya public tenders portal by {record['entity'].title()}.",
                        "status_code": "civ.project.status.planned",
                        "scope_unit_feature_code": county.code,
                        "country_code": "ke",
                        "started_on": record["published_on"],
                    }
                )
                row["project_code"] = project
            b.procurements.append(row)
            mapped += 1
    Path(ROOT / ".dev/seed-dev").mkdir(parents=True, exist_ok=True)
    (ROOT / ".dev/seed-dev/tenders-mapping-gaps.json").write_text(json.dumps(gaps, indent=1), encoding="utf-8")
    return mapped


def finish_projects(b: Builder, geometries: dict[str, MultiPolygon]) -> None:
    """Give every invented project an approximate location inside its unit and make its tender status follow its state."""
    for index, project in enumerate(b.projects):
        if project.get("location") or project["scope_unit_feature_code"] not in geometries:
            continue
        p = point_in(geometries[project["scope_unit_feature_code"]], random.Random(f"loc.{index}"))
        project["location"] = f"SRID=4326;POINT({p.x:.5f} {p.y:.5f})"
    state = {p["code"]: p["status_code"] for p in b.projects}
    for procurement in b.procurements:
        if procurement.get("status_code"):
            continue
        project_state = state.get(procurement.get("project_code", ""), "")
        published = dt.date.fromisoformat(procurement["published_on"])
        status = {
            "civ.project.status.planned": "open",
            "civ.project.status.ongoing": "awarded",
            "civ.project.status.completed": "complete",
        }.get(project_state, "closed")
        procurement["status_code"] = f"civ.procurement.status.{status}"
        procurement["closes_on"] = (published + dt.timedelta(days=30)).isoformat()
        if status in ("awarded", "complete"):
            procurement["awarded_on"] = (published + dt.timedelta(days=60)).isoformat()
