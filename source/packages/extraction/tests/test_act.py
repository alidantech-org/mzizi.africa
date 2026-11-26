"""The Act parser places sections, subsections, paragraphs, definitions and schedules from lines, and cites by designation."""

from __future__ import annotations

import re

from mzizi_extraction.legislation.act import ActLayout, ActLine, _Parser
from mzizi_extraction.legislation.citations import find_citations

LAYOUT = ActLayout(running=(), body_start=re.compile(r"^Part I\b"), heading="inline")


def run(texts: list[str]):
    parser = _Parser(LAYOUT)
    for text in texts:
        parser.feed(ActLine(1, text, False, 0.0))
    parser.flush()
    return parser.root


def test_sections_follow_the_expected_order_and_nest() -> None:
    root = run(
        [
            "Part I – PRELIMINARY",
            "1. Short title",
            "This Act may be cited as the Test Act.",
            "2. Interpretation",
            "In this Act—",
            "“court” means the High Court;",
            "3. Duties",
            "(1) A person shall—",
            "(a) act;",
            "(b) report to section 2 (1); and",
            "(c) stay",
            "(2) The Minister may—",
            "(a) direct—",
            "(i) one;",
            "(ii) two.",
            "3A. Added duty",
            "A person shall pay.",
            "[Act No. 2 of 2022, s. 3.]",
            "FIRST SCHEDULE [s. 3]",
            "FEES",
            "1. Ten shillings.",
        ]
    )
    part = root.children[0]
    assert [s.designation for s in part.children] == ["Section 1", "Section 2", "Section 3", "Section 3A"]
    s3 = part.children[2]
    assert [c.designation for c in s3.children] == ["(1)", "(2)"]
    assert [p.designation for p in s3.children[0].children] == ["(a)", "(b)", "(c)"]
    assert [x.designation for x in s3.children[1].children[0].children] == ["(i)", "(ii)"]
    assert part.children[1].children[0].kind == "definition"
    assert part.children[3].notes == ["[Act No. 2 of 2022, s. 3.]"]
    schedule = root.children[1]
    assert (schedule.designation, schedule.title, schedule.notes) == ("Schedule 1", "FEES", ["[s. 3]"])
    assert schedule.children[0].designation == "1"


def test_citations_read_lists_ranges_and_instruments() -> None:
    found = find_citations(
        "in accordance with Article 10, (a) and (b) of the Constitution of Kenya, 2010; see sections 12 to 15 and section 4(1)(a), (b) or (c) of the Land Act, 2012"
    )
    assert [(c.relation, c.into.scope, [(d.path, d.to) for d in c.targets]) for c in found] == [
        ("in-accordance-with", "constitution", [(("10", "(a)"), None), (("10", "(b)"), None)]),
        ("refers-to", "self", [(("12",), ("15",))]),
        ("refers-to", "named", [(("4", "(1)", "(a)"), None), (("4", "(1)", "(b)"), None), (("4", "(1)", "(c)"), None)]),
    ]
    assert found[2].into.name == "Land Act, 2012"


def test_a_bare_number_after_a_comma_is_not_a_citation() -> None:
    assert [d.path for d in find_citations("section 10, 14 days later")[0].targets] == [("10",)]
    assert [c.kind for c in find_citations("in accordance with the Constitution")] == ["instrument"]
