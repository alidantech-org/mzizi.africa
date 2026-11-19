"""The invented governors, MPs and MCAs, with their parties, offices and tenures."""

from __future__ import annotations

import random

from dev_seed.common import Feature, Row
from dev_seed.names import PARTIES, person_name, weighted_party


class Builder:
    def __init__(self) -> None:
        self.entities: list[Row] = []
        self.names: list[Row] = []
        self.individuals: list[Row] = []
        self.institutions: list[Row] = []
        self.offices: list[Row] = []
        self.holders: list[Row] = []
        self.parties: list[Row] = []
        self.memberships: list[Row] = []
        self.projects: list[Row] = []
        self.procurements: list[Row] = []
        self.bids: list[Row] = []
        self.contracts: list[Row] = []
        self.person_count = 0

    def entity(self, code: str, kind: str, name: str, trading: bool = False) -> None:
        self.entities.append({"code": code, "kind_code": kind})
        self.names.append(
            {
                "entity_code": code,
                "name_kind_code": "ofc.name.kind.official",
                "language_code": "en",
                "is_preferred": "true",
                "name": name,
            }
        )
        del trading

    def person(self, rng: random.Random) -> str:
        self.person_count += 1
        code = f"ke.person.dev-{self.person_count:05d}"
        year = rng.randint(1958, 1990)
        self.individuals.append(
            {"code": code, "birth_date": f"{year}-{rng.randint(1, 12):02d}-{rng.randint(1, 28):02d}"}
        )
        self.names.append(
            {
                "individual_code": code,
                "name_kind_code": "ofc.name.kind.official",
                "language_code": "en",
                "is_preferred": "true",
                "name": person_name(rng),
            }
        )
        return code

    def holder(self, rng: random.Random, office: str, party_code: str, party_name: str) -> None:
        person = self.person(rng)
        self.holders.append(
            {
                "code": f"{office}.2022",
                "office_code": office,
                "individual_code": person,
                "appointment_kind_code": "gov.selection.method.elected",
                "took_office_on": "2022-08-25",
                "from_year": "2022",
                "from_to_precision": "exact",
            }
        )
        self.memberships.append(
            {
                "code": f"{person}.{party_code}",
                "individual_code": person,
                "party_code": f"ke.party.{party_code}",
                "membership_kind_code": "pol.membership.kind.member",
                "joined_on": "2021-03-01",
                "from_year": "2021",
                "from_to_precision": "exact",
            }
        )
        del party_name


def build_people(b: Builder, counties: list[Feature], constituencies: list[Feature], wards: list[Feature]) -> None:
    for code, name, _ in PARTIES:
        b.entity(f"ke.party.{code}", "ofc.entity.kind.political-party", name)
        b.parties.append(
            {
                "code": f"ke.party.{code}",
                "entity_code": f"ke.party.{code}",
                "party_kind_code": "pol.party.kind.fully-registered",
            }
        )
    b.entity("ke.institution.national-assembly", "ofc.entity.kind.public-body", "National Assembly")
    b.institutions.append(
        {
            "code": "ke.institution.national-assembly",
            "entity_code": "ke.institution.national-assembly",
            "institution_kind_code": "gov.institution.kind.legislature",
        }
    )
    county_slug = {f.code: f.code.split(".")[1] for f in counties}
    for county in counties:
        key = county_slug[county.code]
        b.entity(
            f"ke.institution.{key}.government",
            "ofc.entity.kind.county-government",
            f"County Government of {county.name}",
        )
        b.institutions.append(
            {
                "code": f"ke.institution.{key}.government",
                "entity_code": f"ke.institution.{key}.government",
                "institution_kind_code": "gov.institution.kind.county-government",
            }
        )
        b.entity(f"ke.institution.{key}.assembly", "ofc.entity.kind.public-body", f"{county.name} County Assembly")
        b.institutions.append(
            {
                "code": f"ke.institution.{key}.assembly",
                "entity_code": f"ke.institution.{key}.assembly",
                "institution_kind_code": "gov.institution.kind.legislature",
            }
        )
        rng = random.Random(f"governor.{key}")
        office = f"ke.office.governor.{key}"
        b.offices.append(
            {
                "code": office,
                "institution_code": f"ke.institution.{key}.government",
                "office_kind_code": "gov.position.title.governor",
                "unit_feature_code": county.code,
                "from_year": "2013",
                "from_to_precision": "exact",
            }
        )
        pcode, pname = weighted_party(rng)
        b.holder(rng, office, pcode, pname)
    for item in constituencies:
        parts = item.code.split(".")
        county_key, local = parts[1], parts[2]
        rng = random.Random(f"mp.{item.code}")
        office = f"ke.office.mp.{county_key}.{local}"
        b.offices.append(
            {
                "code": office,
                "institution_code": "ke.institution.national-assembly",
                "office_kind_code": "gov.position.title.member-of-parliament",
                "unit_feature_code": item.code,
                "from_year": "2013",
                "from_to_precision": "exact",
            }
        )
        pcode, pname = weighted_party(rng)
        b.holder(rng, office, pcode, pname)
    for item in wards:
        parts = item.code.split(".")
        county_key, const_key, local = parts[1], parts[2], parts[3]
        rng = random.Random(f"mca.{item.code}")
        office = f"ke.office.mca.{county_key}.{const_key}.{local}"
        b.offices.append(
            {
                "code": office,
                "institution_code": f"ke.institution.{county_key}.assembly",
                "office_kind_code": "gov.position.title.member-of-county-assembly",
                "unit_feature_code": item.code,
                "from_year": "2013",
                "from_to_precision": "exact",
            }
        )
        pcode, pname = weighted_party(rng)
        b.holder(rng, office, pcode, pname)
