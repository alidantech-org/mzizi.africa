"""Invented projects with procurement, bids and contracts, scoped to counties, constituencies and wards."""

from __future__ import annotations

import random

from dev_seed.common import Feature
from dev_seed.names import COMPANY_TRADES, COMPANY_WORDS, PROJECT_THEMES
from dev_seed.people import Builder


def build_procurement(b: Builder, counties: list[Feature], constituencies: list[Feature], wards: list[Feature]) -> None:
    rng = random.Random("procurement")
    companies: list[str] = []
    for i in range(60):
        name = f"{rng.choice(COMPANY_WORDS)} {rng.choice(COMPANY_TRADES)} Ltd"
        code = f"ke.company.dev-{i + 1:03d}"
        companies.append(code)
        b.entity(code, "ofc.entity.kind.company", name)
    wards_by_county: dict[str, list[Feature]] = {}
    for ward in wards:
        wards_by_county.setdefault(ward.code.split(".")[1], []).append(ward)
    sequence = 0

    def add(buyer_key: str, scope: Feature, theme: tuple[str, str], rng: random.Random) -> None:
        nonlocal sequence
        sequence += 1
        n = f"{sequence:05d}"
        year = rng.choice([2024, 2025, 2026])
        published = f"{year}-{rng.randint(1, 9):02d}-{rng.randint(1, 28):02d}"
        title = f"{theme[0]}: {scope.name}"
        project, procurement = f"ke.project.dev-{n}", f"ke.procurement.dev-{n}"
        b.projects.append(
            {
                "code": project,
                "name": title,
                "description": f"{title}. Sample project for the development database.",
                "status_code": rng.choice(
                    ["civ.project.status.planned", "civ.project.status.ongoing", "civ.project.status.completed"]
                ),
                "scope_unit_feature_code": scope.code,
                "responsible_institution_code": f"ke.institution.{buyer_key}.government",
                "country_code": "ke",
                "started_on": published,
            }
        )
        b.procurements.append(
            {
                "code": procurement,
                "buyer_entity_code": f"ke.institution.{buyer_key}.government",
                "procedure_kind_code": rng.choice(
                    [
                        "civ.procurement.procedure.open-tender",
                        "civ.procurement.procedure.request-for-quotation",
                        "civ.procurement.procedure.restricted-tender",
                    ]
                ),
                "project_code": project,
                "published_on": published,
                "country_code": "ke",
            }
        )
        amount = rng.randint(8, 240) * 250_000 * 100
        bidders = rng.sample(companies, 3)
        winner = rng.choice(bidders)
        for index, bidder in enumerate(bidders, start=1):
            b.bids.append(
                {
                    "code": f"{procurement}.b{index}",
                    "procurement_code": procurement,
                    "bidder_entity_code": bidder,
                    "outcome_code": "civ.bid.outcome.successful"
                    if bidder == winner
                    else "civ.bid.outcome.unsuccessful",
                    "amount_minor_units": str(int(amount * (1 + (index - 1) * 0.07))),
                    "currency_code": "fin.currency.kes",
                    "submitted_on": published,
                }
            )
        b.contracts.append(
            {
                "code": f"ke.contract.dev-{n}",
                "procurement_code": procurement,
                "project_code": project,
                "contractor_entity_code": winner,
                "amount_minor_units": str(amount),
                "currency_code": "fin.currency.kes",
                "signed_on": published,
                "status_code": rng.choice(
                    ["civ.contract.status.active", "civ.contract.status.completed", "civ.contract.status.signed"]
                ),
            }
        )

    for county in counties:
        key = county.code.split(".")[1]
        for theme in rng.sample(PROJECT_THEMES, 3):
            add(key, county, theme, rng)
        for ward in rng.sample(wards_by_county.get(key, []), min(len(wards_by_county.get(key, [])), 8)):
            add(key, ward, rng.choice(PROJECT_THEMES), rng)
    for item in constituencies:
        for theme in rng.sample(PROJECT_THEMES, 2):
            add(item.code.split(".")[1], item, theme, rng)
