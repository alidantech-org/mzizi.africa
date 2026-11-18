"""Contacts: offices and leaders. The addresses of the National Assembly and of three NG-CDF offices are read from public
pages (the scraped sites); leaders' emails, phones and social handles are placeholders on reserved or non-working ranges."""

from __future__ import annotations

import re

from dev_seed.common import slug
from dev_seed.people import Builder
from dev_seed.store import Tables

REAL = [
    ("ke.institution.national-assembly", "website", "https://www.parliament.go.ke"),
    ("ke.institution.national-assembly", "physical-address", "Parliament Buildings, Parliament Road, Nairobi"),
    ("ke.institution.national-assembly", "postal-address", "P.O. Box 41842-00100, Nairobi"),
    (
        "ke.institution.ngcdf.nairobi.kasarani",
        "physical-address",
        "Kasarani Constituency Njiru Office, off Kangundo Road",
    ),
    (
        "ke.institution.ngcdf.nairobi.langata",
        "physical-address",
        "Wilson Airport, Deputy County Commissioner's compound",
    ),
    ("ke.institution.ngcdf.nairobi.langata", "mobile", "+254 771 591 734"),
    (
        "ke.institution.ngcdf.nairobi.makadara",
        "physical-address",
        "NG-CDF Makadara, KCB Building, 6th Floor, Jogoo Road, opposite Uchumi supermarket",
    ),
    ("ke.institution.nairobi.government", "website", "https://nairobi.go.ke"),
    ("ke.institution.mombasa.government", "website", "https://mombasa.go.ke"),
    ("ke.institution.kisumu.government", "website", "https://kisumu.go.ke"),
    ("ke.institution.nakuru.government", "website", "https://nakuru.go.ke"),
]


def build_contacts(b: Builder, t: Tables, names: dict[str, str]) -> None:
    for entity, kind, value in REAL:
        t.add(
            "ke/official/contacts.csv",
            {
                "code": f"ke.contact.{slug(entity)}.{kind}",
                "entity_code": entity,
                "kind_code": f"ofc.contact.kind.{kind}",
                "value": value,
                "visibility_code": "ofc.contact.visibility.public",
            },
        )
    for index, holder in enumerate(
        h for h in b.holders if h["office_code"].startswith(("ke.office.governor.", "ke.office.mp."))
    ):
        person = holder["individual_code"]
        handle = re.sub(r"[^a-z0-9]", "", names.get(person, person).lower())[:15] or f"leader{index}"
        base = f"ke.contact.{person}"
        t.add(
            "ke/official/contacts.csv",
            {
                "code": f"{base}.email",
                "individual_code": person,
                "kind_code": "ofc.contact.kind.email",
                "value": f"{handle}@leaders.example",
                "visibility_code": "ofc.contact.visibility.public",
            },
        )
        t.add(
            "ke/official/contacts.csv",
            {
                "code": f"{base}.mobile",
                "individual_code": person,
                "kind_code": "ofc.contact.kind.mobile",
                "value": f"+254 700 000 {index % 1000:03d}",
                "visibility_code": "ofc.contact.visibility.public",
            },
        )
        t.add(
            "ke/official/contacts.csv",
            {
                "code": f"{base}.x",
                "individual_code": person,
                "kind_code": "ofc.contact.kind.x",
                "value": f"https://x.com/{handle}",
                "visibility_code": "ofc.contact.visibility.public",
            },
        )
        if index % 2 == 0:
            t.add(
                "ke/official/contacts.csv",
                {
                    "code": f"{base}.facebook",
                    "individual_code": person,
                    "kind_code": "ofc.contact.kind.facebook",
                    "value": f"https://www.facebook.com/{handle}",
                    "visibility_code": "ofc.contact.visibility.public",
                },
            )
