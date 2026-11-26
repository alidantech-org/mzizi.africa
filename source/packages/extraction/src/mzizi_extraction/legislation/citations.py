"""Cross-references inside a provision's text, as a person reads them.

Handled: one designation (`section 27(1)(c)`), lists joined by commas, `and`, `or` (`sections 5, 7 and 12`), lists whose later
items are bare sub-designations (`Article 10, (a) and (b)`, `section 4(1)(a), (b) or (c)`), ranges (`sections 12 to 15`) and the
instrument they point into: this one (`this Act`, none given for a section), the Constitution (`the Constitution`, `the
Constitution of Kenya, 2010`, `the 2010 Constitution`, and any `Article`), or a named instrument (`the Survey Act, Cap. 299`,
`the Land Act, 2012`). An instrument named with no designation (`in accordance with the Constitution`) is a citation too.
The relation is read from the words just before the span. A list of bare numbers after a comma (`section 10, 14 days`) is taken
only when the list ends with `and` or `or`. Nothing here knows which instruments are loaded; the caller resolves them.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Literal, cast

Relation = Literal["amends", "as-defined-in", "in-accordance-with", "read-with", "refers-to", "subject-to", "under"]
Scope = Literal["self", "constitution", "named"]
SUBS = r"(?:\s*\([A-Za-z0-9]{1,4}\))"
ITEM = re.compile(rf"(?P<num>\d+[A-Z]{{0,2}}(?![\w.]))?(?P<subs>{SUBS}*)")
HEAD = re.compile(r"\b(?P<kind>[Ss]ections?|[Aa]rticles?|[Ss]chedules?)\s+")
SEPARATOR = re.compile(r"\s*,\s*(?:(?P<joiner>and|or)\s+)?|\s+(?P<word>and|or|to)\s+|\s*(?P<dash>[–—-])\s*")
CONSTITUTION = r"(?:\d{4}\s+)?Constitution(?:\s+of\s+Kenya)?(?:\s*,?\s*\(?\d{4}\)?)?"
WORD = r"[A-Z][A-Za-z’'&-]*"
NAMED = rf"{WORD}(?:\s+(?:{WORD}|of|and|for|on|in)){{0,8}}?\s+(?:Act|Code|Regulations|Rules)(?:\s*,?\s*(?:\d{{4}}|Cap\.\s*\d+[A-Z]?|No\.\s*\d+\s+of\s+\d{{4}}))*"
SELF = re.compile(r"(?:this|the)\s+Act\b")
CONSTITUTION_RE = re.compile(CONSTITUTION)
NAMED_RE = re.compile(NAMED)
LEADING = {
    "These",
    "Those",
    "Where",
    "Subject",
    "Under",
    "If",
    "In",
    "Despite",
    "Notwithstanding",
    "Pursuant",
    "For",
    "Any",
    "A",
    "An",
    "No",
    "Every",
    "The",
    "This",
    "Such",
    "That",
    "Which",
    "By",
    "With",
    "And",
    "Or",
    "To",
    "Of",
    "On",
    "As",
    "At",
}
BEFORE: tuple[tuple[re.Pattern[str], Relation], ...] = (
    (re.compile(r"(?:subject to|Subject to)\s+(?:the provisions of\s+)?$"), "subject-to"),
    (
        re.compile(
            r"(?:in accordance with|in conformity with|consistent with|in compliance with)\s+(?:the provisions of\s+)?$",
            re.I,
        ),
        "in-accordance-with",
    ),
    (re.compile(r"read\s+(?:together\s+)?with\s+(?:the provisions of\s+)?$", re.I), "read-with"),
    (
        re.compile(r"(?:assigned to it|defined|meaning given to it)\s+(?:under|in)\s+(?:the provisions of\s+)?$"),
        "as-defined-in",
    ),
    (re.compile(r"\bamend(?:s|ed|ing)?\s+(?:the\s+)?$", re.I), "amends"),
    (re.compile(r"(?:\bunder|pursuant to|by virtue of)\s+(?:the provisions of\s+)?$", re.I), "under"),
)


@dataclass(frozen=True)
class Designation:
    """What is cited: the numbered provision and the sub-designations below it; `to` ends a range (`sections 12 to 15`)."""

    path: tuple[str, ...]
    to: tuple[str, ...] | None = None


@dataclass(frozen=True)
class Instrument:
    scope: Scope
    #: The printed name for a named instrument, `Constitution` for the Constitution, empty for this one.
    name: str = ""


@dataclass(frozen=True)
class Citation:
    start: int
    end: int
    text: str
    relation: Relation
    #: `section`, `article`, `schedule`, or `instrument` when only an instrument is named.
    kind: str
    targets: tuple[Designation, ...]
    into: Instrument


def _subs(text: str) -> tuple[str, ...]:
    return tuple(f"({s})" for s in re.findall(r"\(([^)]+)\)", text))


def _kind(marker: str) -> str:
    return "digit" if marker.strip("()")[:1].isdigit() else "letter"


def _relative(previous: tuple[str, ...], subs: tuple[str, ...]) -> tuple[str, ...]:
    """`(b)` after `Article 10, (a)` is 10(b); `(3)(a)` after `24(2)` is 24(3)(a): replace from the level of the same kind."""
    for k in range(1, len(previous)):
        if _kind(previous[k]) == _kind(subs[0]):
            return (*previous[:k], *subs)
    return (*previous, *subs)


def _list(text: str, pos: int) -> tuple[tuple[Designation, ...], int] | None:
    """The designations of a citation list starting at `pos`, and where the list ends."""
    first = ITEM.match(text, pos)
    if first is None or not first.group("num"):
        return None
    items: list[tuple[Designation, int, bool]] = [
        (Designation((first.group("num"), *_subs(first.group("subs")))), first.end(), False)
    ]
    joined = False
    cursor = first.end()
    while True:
        sep = SEPARATOR.match(text, cursor)
        if sep is None:
            break
        item = ITEM.match(text, sep.end())
        if item is None or not (item.group("num") or item.group("subs")):
            break
        previous = items[-1][0]
        by_comma = bool(
            sep.group(0).strip() == "," or (sep.group(0).strip().startswith(",") and not sep.group("joiner"))
        )
        if sep.group("joiner") or sep.group("word") in ("and", "or"):
            joined = True
        path = (
            (item.group("num"), *_subs(item.group("subs")))
            if item.group("num")
            else _relative(previous.path, _subs(item.group("subs")))
        )
        if sep.group("word") == "to" or sep.group("dash"):
            if not item.group("num") and len(previous.path) == 1:
                break
            items[-1] = (Designation(previous.path, path), item.end(), False)
        elif not item.group("num") and len(previous.path) == 1:
            items[-1] = (
                Designation(path),
                item.end(),
                False,
            )  # `Article 10, (a) and (b)`: 10 is the anchor, not a target
        else:
            items.append((Designation(path), item.end(), by_comma and not item.group("subs")))
        cursor = item.end()
    if not joined:
        while len(items) > 1 and items[-1][2]:
            items.pop()
    return tuple(i[0] for i in items), items[-1][1]


def _before(text: str, start: int) -> Relation:
    before = text[max(0, start - 70) : start]
    return next((r for p, r in BEFORE if p.search(before)), "refers-to")


def _instrument_at(text: str, pos: int) -> tuple[Instrument, int] | None:
    tail = re.compile(r"\s+of\s+(?:the\s+|this\s+)?").match(text, pos)
    if tail is None:
        return None
    start = tail.end()
    m = SELF.match(text, start)
    if m:
        return Instrument("self"), m.end()
    m = CONSTITUTION_RE.match(text, start)
    if m:
        return Instrument("constitution", "Constitution"), m.end()
    m = NAMED_RE.match(text, start)
    return (Instrument("named", m.group(0).strip(" ,")), m.end()) if m else None


def find_citations(text: str) -> list[Citation]:
    found: list[Citation] = []
    taken = 0
    for head in HEAD.finditer(text):
        if head.start() < taken:
            continue
        parsed = _list(text, head.end())
        if parsed is None:
            continue
        targets, end = parsed
        kind = head.group("kind").lower().rstrip("s")
        if kind == "schedule" and not all(re.fullmatch(r"\d+", t.path[0]) for t in targets):
            continue
        into = Instrument("constitution", "Constitution") if kind == "article" else Instrument("self")
        outer = _instrument_at(text, end)
        if outer is not None:
            into, end = outer
        found.append(
            Citation(head.start(), end, text[head.start() : end], _before(text, head.start()), kind, targets, into)
        )
        taken = end
    spans = [(c.start, c.end) for c in found]
    for pattern, scope in ((CONSTITUTION_RE, "constitution"), (NAMED_RE, "named")):
        for m in pattern.finditer(text):
            start, name = m.start(), m.group(0)
            if (
                scope == "constitution"
                and not re.match(r"(?:the\s+)?(?:\d{4}\s+)?Constitution", text[max(0, start - 4) : m.end()].lstrip())
                and start > 0
                and text[start - 1].isalpha()
            ):
                continue
            if scope == "named":
                words = name.split()
                while words and words[0] in LEADING:
                    start += len(name) - len(name.lstrip()) if False else 0
                    name = name[len(words[0]) :].lstrip()
                    start = m.end() - len(name)
                    words = name.split()
                if not words or len(words) < 2:
                    continue
            if any(s <= start < e or s < m.end() <= e for s, e in spans) or (
                scope == "named" and "Constitution" in name
            ):
                continue
            found.append(
                Citation(
                    start,
                    m.end(),
                    text[start : m.end()],
                    _before(text, start),
                    "instrument",
                    (),
                    Instrument(cast(Scope, scope), name.strip(" ,")),
                )
            )
            spans.append((start, m.end()))
    return sorted(found, key=lambda c: c.start)
