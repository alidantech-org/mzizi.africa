"""The elected tree below the President: Deputy Governors, Senators, Woman Representatives and nominated Members of
Parliament, and the constitutional articles behind each office tier and level."""

from __future__ import annotations

import random

from dev_seed.common import Feature
from dev_seed.gov_core import ARTICLE_OF_LEVEL, ARTICLE_OF_TIER, Ctx
from dev_seed.names import weighted_party


def elected(c: Ctx, counties: list[Feature], wording: set[str]) -> None:
    b = c.b
    party_of = {m["individual_code"]: m["party_code"].removeprefix("ke.party.") for m in b.memberships}
    gov_holder = {h["office_code"]: h for h in b.holders}
    for county in counties:
        key = county.code.split(".")[1]
        rng = random.Random(f"county-tree.{key}")
        government = f"ke.institution.{key}.government"
        for _code, row in (
            (government, c.institutions.get(government)),
            (f"ke.institution.{key}.assembly", c.institutions.get(f"ke.institution.{key}.assembly")),
        ):
            if row is not None:
                row["arm_code"] = "gov.arm.county"
                row["establishment_basis_code"] = "gov.establishment.basis.constitution"
        c.relate(government, "part-of", "ke.institution.county-governments")
        c.relate(f"ke.institution.{key}.assembly", "part-of", government)
        c.effect(
            wording,
            "governance.institutions",
            government,
            "179",
            "established-by",
            "The county executive is led by the Governor.",
        )
        c.effect(
            wording,
            "governance.institutions",
            f"ke.institution.{key}.assembly",
            "176",
            "established-by",
            "Each county has a county assembly.",
        )
        gov = gov_holder.get(f"ke.office.governor.{key}")
        party = party_of.get(gov["individual_code"], "independent") if gov else "independent"
        for office, institution, tier, how, who in (
            (f"ke.office.deputy-governor.{key}", government, "deputy-governor", "running-mate", None),
            (f"ke.office.senator.{key}", "ke.institution.senate", "senator", "elected", "party"),
            (
                f"ke.office.woman-rep.{key}",
                "ke.institution.national-assembly",
                "woman-representative",
                "elected",
                "party",
            ),
        ):
            b.offices.append(
                {
                    "code": office,
                    "institution_code": institution,
                    "office_kind_code": f"gov.position.title.{tier}",
                    "unit_feature_code": county.code,
                    "from_year": "2022",
                    "from_to_precision": "exact",
                }
            )
            person = b.person(rng)
            b.holders.append(
                {
                    "code": f"{office}.2022",
                    "office_code": office,
                    "individual_code": person,
                    "appointment_kind_code": f"gov.selection.method.{how}",
                    "took_office_on": "2022-08-25",
                    "from_year": "2022",
                    "from_to_precision": "exact",
                }
            )
            pcode = party if who is None else weighted_party(rng)[0]
            b.memberships.append(
                {
                    "code": f"{person}.{pcode}",
                    "individual_code": person,
                    "party_code": f"ke.party.{pcode}",
                    "membership_kind_code": "pol.membership.kind.member",
                    "joined_on": "2021-03-01",
                    "from_year": "2021",
                    "from_to_precision": "exact",
                }
            )
    for county in counties:
        key = county.code.split(".")[1]
        rng = random.Random(f"nominated-mca.{key}")
        for n in range(1, 5):
            office = f"ke.office.mca.{key}.nominated-{n:02d}"
            b.offices.append(
                {
                    "code": office,
                    "institution_code": f"ke.institution.{key}.assembly",
                    "office_kind_code": "gov.position.title.member-of-county-assembly",
                    "unit_feature_code": county.code,
                    "from_year": "2022",
                    "from_to_precision": "exact",
                }
            )
            b.holders.append(
                {
                    "code": f"{office}.2022",
                    "office_code": office,
                    "individual_code": b.person(rng),
                    "appointment_kind_code": "gov.selection.method.nominated",
                    "took_office_on": "2022-09-08",
                    "from_year": "2022",
                    "from_to_precision": "exact",
                }
            )
    for n in range(1, 13):
        office = f"ke.office.mp.nominated-{n:02d}"
        b.offices.append(
            {
                "code": office,
                "institution_code": "ke.institution.national-assembly",
                "office_kind_code": "gov.position.title.member-of-parliament",
                "unit_feature_code": "",
                "from_year": "2022",
                "from_to_precision": "exact",
            }
        )
        b.holders.append(
            {
                "code": f"{office}.2022",
                "office_code": office,
                "individual_code": b.person(c.rng),
                "appointment_kind_code": "gov.selection.method.nominated",
                "took_office_on": "2022-09-08",
                "from_year": "2022",
                "from_to_precision": "exact",
            }
        )


def tiers_and_levels(c: Ctx, wording: set[str]) -> None:
    for tier, article in ARTICLE_OF_TIER.items():
        c.effect(
            wording,
            "reference.values",
            f"gov.position.title.{tier}",
            article,
            "governed-by",
            f"The Constitution provides for the office of {tier.replace('-', ' ')}.",
        )
    for level, article in ARTICLE_OF_LEVEL.items():
        c.effect(
            wording,
            "reference.values",
            f"gov.level.{level}",
            article,
            "governed-by",
            f"The Constitution provides for the {level.replace('-', ' ')} level.",
        )
