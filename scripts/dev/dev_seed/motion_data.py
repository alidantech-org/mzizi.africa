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
