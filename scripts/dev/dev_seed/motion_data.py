"""The development motions and bills: the matters the activities seed votes on."""

from __future__ import annotations

GOVERNMENT_PARTIES = {"uda", "anc", "kanu", "ford-kenya"}
# (code, title, kind, outcome, summary, provision slug, budget, pass probability for the government line, sitting index)
NATIONAL: list[tuple[str, str, str, str, str, str, bool, float, int]] = [
    (
        "finance-bill-2025",
        "The Finance Bill, 2025",
        "bill",
        "passed",
        "Changes to taxes and charges for the next financial year.",
        "art-209",
        False,
        0.72,
        0,
    ),
    (
        "appropriations-bill-2025",
        "The Appropriations Bill, 2025",
        "budget",
        "passed",
        "Authorises the national budget estimates for the financial year 2025/26.",
        "art-201",
        True,
        0.8,
        1,
    ),
    (
        "bps-2026",
        "Adoption of the Budget Policy Statement 2026",
        "motion",
        "passed",
        "Sets the ceilings and priorities for the 2026/27 budget.",
        "art-201",
        True,
        0.76,
        2,
    ),
    (
        "cs-vetting-2025",
        "Approval of nominated Cabinet Secretaries",
        "appointment",
        "passed",
        "The House considers the committee's report on the nominees.",
        "",
        False,
        0.82,
        3,
    ),
    (
        "county-revenue-allocation",
        "County Allocation of Revenue Bill, 2025",
        "bill",
        "rejected",
        "Divides the counties' share of national revenue among the 47 counties.",
        "art-201",
        True,
        0.45,
        4,
    ),
]
COUNTY: list[tuple[str, str, str, str, str, bool, float]] = [
    (
        "nairobi-finance-bill",
        "The Nairobi City County Finance Bill",
        "bill",
        "passed",
        "Fees, levies and charges the county may collect.",
        False,
        0.7,
    ),
    (
        "nairobi-supplementary",
        "Supplementary Appropriation (No. 1)",
        "budget",
        "passed",
        "Moves money between county programmes.",
        True,
        0.66,
    ),
    (
        "nairobi-ceo-approval",
        "Approval of nominated County Executive Committee members",
        "appointment",
        "rejected",
        "Vetting of the governor's nominees.",
        False,
        0.4,
    ),
]


# Invented speech openings per kind; development data, never real Hansard.
_OPENINGS = {
    "speech": (
        "Mr Speaker, I rise in support of the position taken on {t}. Our people in the constituency are waiting to see how this changes their lives.",
        "Mr Speaker, on {t}, I wish to be clear: the figures must follow the people, and the people must see the benefit.",
        "I thank the mover. On {t}, I have two concerns for this House, the timeline and the oversight of how the money is spent.",
    ),
    "question": (
        "Could the mover tell the House, on {t}, how the cost was arrived at and which communities were consulted?",
        "On {t}, what safeguards are in place so that funds reach the wards they are meant for?",
    ),
    "statement": (
        "A statement on {t}: the committee has reviewed the submissions and notes the points raised by the public.",
        "For the record on {t}, the members of my party will vote in line with the views collected in the constituencies.",
    ),
    "statement-judge": (
        "On {t}, in my opinion the question turns on whether the levy is a tax within the meaning of the Constitution.",
    ),
}


def speech_text(kind: str, title: str, pick: int) -> str:
    """A short invented contribution, labelled as development data so nobody mistakes it for the record."""
    options = _OPENINGS.get(kind, _OPENINGS["statement"])
    return options[pick % len(options)].format(t=title) + " [Development data: invented text]"
