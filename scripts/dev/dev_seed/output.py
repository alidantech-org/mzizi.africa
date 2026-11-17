"""Writes the built rows as seed CSV files, with the dev reference values and their Swahili labels."""

from __future__ import annotations

from dev_seed.common import Row, write_csv
from dev_seed.people import Builder


def write_people(b: Builder) -> None:
    write_csv(
        "global/reference/dev.schemes.csv",
        ["code", "title", "owner_snapshot"],
        [
            {
                "code": "gov.appointment.kind",
                "title": "How an office holder came to hold the office",
                "owner_snapshot": "dev sample",
            },
            {"code": "civ.project.status", "title": "Where a public project stands", "owner_snapshot": "dev sample"},
        ],
    )
    values: list[Row] = []
    labels_sw: list[Row] = []
    kinds = (
        (
            "gov.office.kind",
            [
                ("governor", "Governor", "Gavana"),
                ("member-of-parliament", "Member of Parliament", "Mbunge"),
                ("member-of-county-assembly", "Member of County Assembly", "Mwakilishi wa Wadi"),
            ],
        ),
        (
            "gov.appointment.kind",
            [
                ("elected", "Elected", "Amechaguliwa"),
                ("nominated", "Nominated", "Ameteuliwa na chama"),
                ("appointed", "Appointed", "Ameteuliwa"),
            ],
        ),
        (
            "civ.project.status",
            [
                ("planned", "Planned", "Imepangwa"),
                ("ongoing", "Ongoing", "Inaendelea"),
                ("completed", "Completed", "Imekamilika"),
                ("stalled", "Stalled", "Imekwama"),
            ],
        ),
    )
    for scheme, members in kinds:
        for word, english, swahili in members:
            values.append({"code": f"{scheme}.{word}", "scheme_code": scheme, "label": english})
            labels_sw.append(
                {"value_code": f"{scheme}.{word}", "language_code": "sw", "label_kind": "preferred", "label": swahili}
            )
    write_csv("global/reference/values/dev.values.csv", ["code", "scheme_code", "label"], values)
    write_csv(
        "global/reference/dev.value_labels.csv", ["value_code", "language_code", "label_kind", "label"], labels_sw
    )
    write_csv("ke/official/entities.csv", ["code", "kind_code"], b.entities)
    write_csv("ke/official/individuals.csv", ["code", "birth_date"], b.individuals)
    write_csv(
        "ke/official/names.csv",
        ["entity_code", "individual_code", "name_kind_code", "language_code", "is_preferred", "name"],
        b.names,
    )
    write_csv("ke/governance/institutions.csv", ["code", "entity_code", "institution_kind_code"], b.institutions)
    write_csv(
        "ke/governance/offices.csv",
        ["code", "institution_code", "office_kind_code", "unit_feature_code", "from_year", "from_to_precision"],
        b.offices,
    )
    write_csv(
        "ke/governance/holders.csv",
        [
            "code",
            "office_code",
            "individual_code",
            "appointment_kind_code",
            "took_office_on",
            "from_year",
            "from_to_precision",
        ],
        b.holders,
    )
    write_csv("ke/politics/parties.csv", ["code", "entity_code", "party_kind_code"], b.parties)
    write_csv(
        "ke/politics/memberships.csv",
        [
            "code",
            "individual_code",
            "party_code",
            "membership_kind_code",
            "joined_on",
            "from_year",
            "from_to_precision",
        ],
        b.memberships,
    )
    write_csv(
        "ke/civic/projects.csv",
        [
            "code",
            "name",
            "description",
            "status_code",
            "scope_unit_feature_code",
            "responsible_institution_code",
            "country_code",
            "started_on",
        ],
        b.projects,
    )
    write_csv(
        "ke/civic/procurements.csv",
        ["code", "buyer_entity_code", "procedure_kind_code", "project_code", "published_on", "country_code"],
        b.procurements,
    )
    write_csv(
        "ke/civic/bids.csv",
        [
            "code",
            "procurement_code",
            "bidder_entity_code",
            "outcome_code",
            "amount_minor_units",
            "currency_code",
            "submitted_on",
        ],
        b.bids,
    )
    write_csv(
        "ke/civic/contracts.csv",
        [
            "code",
            "procurement_code",
            "project_code",
            "contractor_entity_code",
            "amount_minor_units",
            "currency_code",
            "signed_on",
            "status_code",
        ],
        b.contracts,
    )
