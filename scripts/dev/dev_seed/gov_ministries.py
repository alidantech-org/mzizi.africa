"""Ministries with their Cabinet Secretaries and state departments with their Principal Secretaries, and the oversight
and funding lines between bodies."""

from __future__ import annotations

from dev_seed.gov_core import Ctx
from dev_seed.gov_data import MINISTRIES, Body


def ministries(c: Ctx, wording: set[str]) -> None:
    for key, name, departments in MINISTRIES:
        body = Body(
            key,
            name,
            "ministry",
            "executive",
            "constitution",
            "cabinet",
            f"Leads government work on: {name.split(' of ', 1)[-1]}.",
            articles=("152",),
            since="2010",
        )
        code = c.institution(body)
        c.relate(code, "part-of", "ke.institution.cabinet")
        c.mandate(
            code,
            "purpose",
            f"Sets policy and runs national services for {name.removeprefix('Ministry of ').removeprefix('The ')}.",
        )
        c.mandate(
            code,
            "legal-basis",
            "Article 152 of the Constitution of Kenya, 2010 and the Executive Order on the organisation of government",
        )
        c.effect(
            wording, "governance.institutions", code, "152", "governed-by", "Cabinet Secretaries lead the ministries."
        )
        office = f"ke.office.cabinet.{key}"
        c.b.offices.append(
            {
                "code": office,
                "institution_code": code,
                "office_kind_code": "gov.office.kind.cabinet-secretary",
                "unit_feature_code": "",
                "from_year": "2022",
                "from_to_precision": "exact",
            }
        )
        c.b.holders.append(
            {
                "code": f"{office}.2022",
                "office_code": office,
                "individual_code": c.b.person(c.rng),
                "appointment_kind_code": "gov.appointment.kind.appointed",
                "took_office_on": "2022-10-27",
                "from_year": "2022",
                "from_to_precision": "exact",
            }
        )
        for n, dept in enumerate(departments, 1):
            dcode = f"ke.institution.{key}.sd-{n}"
            c.b.entity(dcode, "ofc.entity.kind.public-body", dept)
            c.b.institutions.append(
                {
                    "code": dcode,
                    "entity_code": dcode,
                    "institution_kind_code": "gov.institution.kind.state-department",
                    "arm_code": "gov.arm.executive",
                    "establishment_basis_code": "gov.establishment.basis.executive-order",
                }
            )
            c.institutions[dcode] = c.b.institutions[-1]
            c.relate(dcode, "part-of", code)
            c.mandate(dcode, "purpose", f"{dept} carries out the day-to-day work of {name} in its area.")
            c.mandate(dcode, "legal-basis", "Executive Order on the organisation of government")
            office = f"ke.office.ps.{key}.{n}"
            c.b.offices.append(
                {
                    "code": office,
                    "institution_code": dcode,
                    "office_kind_code": "gov.office.kind.principal-secretary",
                    "unit_feature_code": "",
                    "from_year": "2022",
                    "from_to_precision": "exact",
                }
            )
            c.b.holders.append(
                {
                    "code": f"{office}.2022",
                    "office_code": office,
                    "individual_code": c.b.person(c.rng),
                    "appointment_kind_code": "gov.appointment.kind.appointed",
                    "took_office_on": "2022-11-10",
                    "from_year": "2022",
                    "from_to_precision": "exact",
                }
            )
    # oversight and funding lines
    for sub, kind, obj in (
        ("ipoa", "oversees", "national-police-service"),
        ("npsc", "oversees", "national-police-service"),
        ("equalisation-fund", "funds", "county-governments"),
        ("cra", "oversees", "county-governments"),
        ("auditor-general", "oversees", "county-governments"),
        ("ppra", "oversees", "cabinet"),
        ("iebc", "oversees", "orpp"),
    ):
        c.relate(f"ke.institution.{sub}", kind, f"ke.institution.{obj}")
