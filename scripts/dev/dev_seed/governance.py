"""Government as data: reference values (arms, ways of holding a seat, office tiers, levels), every public body with the
arm and the law that created it, ministries with their Cabinet Secretaries and Principal Secretaries, the elected tree
(President to MCA), relationships between bodies, mandates and the Constitution articles behind each of them.

The bodies and their legal bases are public facts (gov_data.py); the persons are invented, tagged `dev`."""

from __future__ import annotations

from dev_seed.common import Feature
from dev_seed.gov_core import Ctx, wording_codes
from dev_seed.gov_data import (
    APPOINTMENTS,
    ARMS,
    BASES,
    BODIES,
    CONTENT_CATEGORIES,
    CONTENT_CLASSES,
    LEVELS,
    MANDATES,
    RELATIONS,
    TABS,
    TIERS,
    Value,
)
from dev_seed.gov_elected import elected, tiers_and_levels
from dev_seed.gov_ministries import ministries
from dev_seed.people import Builder
from dev_seed.store import Tables


def _values(t: Tables, scheme: str, title: str, items: list[Value], new_scheme: bool = True) -> None:
    if new_scheme:
        t.add("global/reference/dev3.schemes.csv", {"code": scheme, "title": title, "owner_snapshot": "dev sample"})
    for position, (word, english, swahili, parent) in enumerate(items, 1):
        code = f"{scheme}.{word}"
        t.add(
            "global/reference/values/dev3.values.csv",
            {
                "code": code,
                "scheme_code": scheme,
                "label": english,
                "parent_code": f"{scheme}.{parent}" if parent else "",
                "position": str(position),
            },
        )
        t.add(
            "global/reference/dev3.value_labels.csv",
            {"value_code": code, "language_code": "sw", "label_kind": "preferred", "label": swahili},
        )


def build_reference(t: Tables) -> None:
    _values(t, "gov.arm", "Arm of government or kind of body", ARMS)
    _values(t, "gov.establishment.basis", "What created a public body", BASES)
    _values(t, "gov.relationship.kind", "How two public bodies relate", RELATIONS)
    _values(t, "gov.mandate.kind", "Kind of statement about a body's mandate", MANDATES)
    _values(t, "gov.office.kind", "", TIERS, new_scheme=False)
    _values(t, "gov.appointment.kind", "", APPOINTMENTS, new_scheme=False)
    _values(t, "fil.content.category", "What a text is about", CONTENT_CATEGORIES)
    _values(t, "fil.content.classification", "How a text is placed on a screen", CONTENT_CLASSES)
    _values(t, "gov.level", "Level of government", [(w, e, s, "") for w, e, s, _, _ in LEVELS])
    _values(t, "gov.leader.tab", "Ways to look at leaders", [(w, e, s, "") for w, e, s, _ in TABS])
    for tab, _, _, kinds in TABS:
        for kind in kinds:
            t.add(
                "global/reference/dev3.value_relations.csv",
                {
                    "source_value_code": f"gov.leader.tab.{tab}",
                    "target_value_code": f"gov.appointment.kind.{kind}",
                    "relation_kind": "broader_than",
                },
            )
    for word, _, _, kind_code, _ in LEVELS:
        t.add(
            "global/reference/dev3.value_relations.csv",
            {
                "source_value_code": f"gov.level.{word}",
                "target_value_code": kind_code.removeprefix("ref.val."),
                "relation_kind": "related_to",
            },
        )


def _bodies(c: Ctx, wording: set[str]) -> None:
    for body in BODIES:
        code = c.institution(body)
        c.mandate(code, "purpose", body.purpose)
        for item in body.functions:
            c.mandate(code, "function", item)
        if body.articles:
            nums = ", ".join(f"Article {a}" for a in body.articles)
            c.mandate(code, "legal-basis", f"{nums} of the Constitution of Kenya, 2010")
        if body.act:
            c.mandate(code, "legal-basis", body.act)
        for index, article in enumerate(body.articles):
            kind = "established-by" if index == 0 and body.basis == "constitution" else "governed-by"
            c.effect(
                wording, "governance.institutions", code, article, kind, f"The Constitution provides for {body.name}."
            )
        if body.parent:
            c.relate(code, "part-of", f"ke.institution.{body.parent}")
        for seat in body.seats:
            for i in range(1, seat.count + 1):
                person = None
                unit = "ke" if body.slug == "presidency" else ""
                if seat.tier == "president":
                    person = c.person("ke.person.william-ruto", "William Ruto")
                elif seat.tier == "deputy-president":
                    person = c.person("ke.person.kithure-kindiki", "Kithure Kindiki")
                c.seat(code, body.slug, seat, i, unit, person)
    # keep the existing office codes the activity seed and the apps already know
    for office in c.b.offices:
        if office["code"] == "ke.office.presidency.president":
            office["code"] = "ke.office.president"
        elif office["code"] == "ke.office.presidency.deputy-president":
            office["code"] = "ke.office.deputy-president"
    for holder in c.b.holders:
        if holder["office_code"] == "ke.office.presidency.president":
            holder["office_code"] = "ke.office.president"
            holder["code"] = "ke.office.president.2022"
        elif holder["office_code"] == "ke.office.presidency.deputy-president":
            holder["office_code"] = "ke.office.deputy-president"
            holder["code"] = "ke.office.deputy-president.2022"


def build_governance(b: Builder, t: Tables, counties: list[Feature]) -> None:
    c = Ctx(b, t)
    wording = wording_codes()
    build_reference(t)
    _bodies(c, wording)
    ministries(c, wording)
    elected(c, counties, wording)
    tiers_and_levels(c, wording)
    # the National Assembly row already exists from the people builder; make sure it has its arm and basis
    na = c.institutions.get("ke.institution.national-assembly")
    if na is not None:
        na["arm_code"] = "gov.arm.legislature"
        na["establishment_basis_code"] = "gov.establishment.basis.constitution"
