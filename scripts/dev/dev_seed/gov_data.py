"""The shape of Kenyan government as data, loaded from `data/gov.json`: arms, ways of holding a seat, office tiers,
bodies, ministries and the laws that establish them. Names of institutions and article numbers are public facts; the
persons that hold the offices are invented by the builder and tagged `dev`. The apps never read this: it is loaded into
reference values, institutions, offices, relationships, mandates and legal effects, and the apps read those."""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

Value = tuple[str, str, str, str]
_DATA = json.loads((Path(__file__).parent / "data" / "gov.json").read_text(encoding="utf-8"))


def _values(name: str) -> list[Value]:
    return [(a, b, c, d) for a, b, c, d in _DATA[name]]


ARMS = _values("ARMS")
BASES = _values("BASES")
RELATIONS = _values("RELATIONS")
MANDATES = _values("MANDATES")
APPOINTMENTS = _values("APPOINTMENTS")
TIERS = _values("TIERS")
CONTENT_CATEGORIES = _values("CONTENT_CATEGORIES")
CONTENT_CLASSES = _values("CONTENT_CLASSES")
# (word, English, Swahili, appointment kinds it includes)
TABS: list[tuple[str, str, str, tuple[str, ...]]] = [(a, b, c, tuple(d)) for a, b, c, d in _DATA["TABS"]]
TAB_ABOUT: dict[str, str] = _DATA["TAB_ABOUT"]
# (word, English, Swahili, geography kind value, what the level does)
LEVELS: list[tuple[str, str, str, str, str]] = [(a, b, c, d, e) for a, b, c, d, e in _DATA["LEVELS"]]
# (slug, name, [state departments])
MINISTRIES: list[tuple[str, str, list[str]]] = [(a, b, list(c)) for a, b, c in _DATA["MINISTRIES"]]


@dataclass(frozen=True)
class Seat:
    """One office in a body: how many, which tier, how held."""

    tier: str
    count: int = 1
    how: str = "appointed"
    title: str = ""


@dataclass(frozen=True)
class Body:
    slug: str
    name: str
    kind: str
    arm: str
    basis: str
    parent: str
    purpose: str
    functions: tuple[str, ...] = ()
    articles: tuple[str, ...] = ()
    act: str = ""
    since: str = ""
    seats: tuple[Seat, ...] = ()
    note: str = ""


BODIES: list[Body] = [
    Body(
        **{
            **{k: v for k, v in b.items() if k not in ("seats", "functions", "articles")},
            "functions": tuple(b["functions"]),
            "articles": tuple(b["articles"]),
            "seats": tuple(Seat(**s) for s in b["seats"]),
        }
    )
    for b in _DATA["BODIES"]
]
