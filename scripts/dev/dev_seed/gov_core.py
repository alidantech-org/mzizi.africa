"""Shared pieces of the governance seed: the builder context that writes institutions, offices, relationships,
mandates and legal effects, and the article numbers behind office tiers and levels."""

from __future__ import annotations

import csv
import random

from dev_seed.common import SEED
from dev_seed.gov_data import Body, Seat
from dev_seed.people import Builder
from dev_seed.store import Tables

ENTITY_KIND = {
    "commission": "ofc.entity.kind.commission",
    "court": "ofc.entity.kind.court",
    "parastatal": "ofc.entity.kind.parastatal",
    "county-government": "ofc.entity.kind.county-government",
}
ARTICLE_OF_TIER = {
    "president": "131",
    "deputy-president": "147",
    "governor": "179",
    "deputy-governor": "179",
    "senator": "98",
    "woman-representative": "97",
    "member-of-parliament": "97",
    "member-of-county-assembly": "177",
    "cabinet-secretary": "152",
    "principal-secretary": "155",
    "attorney-general": "156",
    "director-of-public-prosecutions": "157",
    "chief-justice": "161",
    "deputy-chief-justice": "161",
    "judge": "166",
    "commission-chairperson": "250",
    "commission-vice-chairperson": "250",
    "commissioner": "250",
    "speaker": "106",
    "inspector-general": "245",
}
ARTICLE_OF_LEVEL = {"country": "1", "county": "176", "sub-county": "176", "constituency": "89", "ward": "177"}
OBSERVED = "2026-11-18T09:00:00+03:00"


def wording_codes() -> set[str]:
    codes: set[str] = set()
    for path in (SEED / "data/ke/legal/constitution-2010").rglob("wordings.csv"):
        with path.open(encoding="utf-8") as handle:
            codes.update(row["code"] for row in csv.DictReader(handle))
    return codes


class Ctx:
    def __init__(self, b: Builder, t: Tables) -> None:
        self.b, self.t = b, t
        self.rng = random.Random("governance")
        self.institutions = {row["code"]: row for row in b.institutions}
        self.persons: dict[str, str] = {}

    def person(self, code: str, name: str) -> str:
        if not any(i["code"] == code for i in self.b.individuals):
            self.b.individuals.append({"code": code, "birth_date": ""})
            self.b.names.append(
                {
                    "individual_code": code,
                    "name_kind_code": "ofc.name.kind.official",
                    "language_code": "en",
                    "is_preferred": "true",
                    "name": name,
                }
            )
        return code

    def institution(self, body: Body) -> str:
        code = f"ke.institution.{body.slug}"
        row = self.institutions.get(code)
        if row is None:
            self.b.entity(code, ENTITY_KIND.get(body.kind, "ofc.entity.kind.public-body"), body.name)
            row = {"code": code, "entity_code": code, "institution_kind_code": f"gov.institution.kind.{body.kind}"}
            self.b.institutions.append(row)
            self.institutions[code] = row
        row["arm_code"] = f"gov.arm.{body.arm}"
        row["establishment_basis_code"] = f"gov.establishment.basis.{body.basis}"
        return code

    def seat(self, institution: str, slug_: str, seat: Seat, n: int, unit: str, name: str | None = None) -> None:
        office = f"ke.office.{slug_}.{seat.tier}-{n:02d}" if seat.count > 1 else f"ke.office.{slug_}.{seat.tier}"
        self.b.offices.append(
            {
                "code": office,
                "institution_code": institution,
                "office_kind_code": f"gov.office.kind.{seat.tier}",
                "unit_feature_code": unit,
                "from_year": "2022",
                "from_to_precision": "exact",
            }
        )
        person = name or self.b.person(self.rng)
        self.b.holders.append(
            {
                "code": f"{office}.2022",
                "office_code": office,
                "individual_code": person,
                "appointment_kind_code": f"gov.appointment.kind.{seat.how}",
                "took_office_on": "2022-09-27",
                "from_year": "2022",
                "from_to_precision": "exact",
            }
        )

    def relate(self, subject: str, kind: str, obj: str) -> None:
        self.t.add(
            "ke/governance/relationships.csv",
            {
                "subject_institution_code": subject,
                "object_institution_code": obj,
                "relationship_kind_code": f"gov.relationship.kind.{kind}",
            },
        )

    def mandate(self, institution: str, kind: str, text: str) -> None:
        self.t.add(
            "ke/governance/mandates.csv",
            {"institution_code": institution, "mandate_kind_code": f"gov.mandate.kind.{kind}", "description": text},
        )

    def effect(self, wording: set[str], table: str, subject: str, article: str, kind: str, why: str) -> None:
        code = f"ke.constitution-2010.art-{article}.v-2010"
        if code not in wording:
            return
        self.t.add(
            "ke/legal/effects/governance.effects.csv",
            {
                "code": f"ke.constitution-2010.art-{article}.{kind}.{subject}",
                "wording_code": code,
                "subject_table": table,
                "subject_code": subject,
                "kind_code": f"leg.effect.kind.{kind}",
                "explanation": why,
                "review_status": "proposed",
                "observed_at": OBSERVED,
            },
        )
