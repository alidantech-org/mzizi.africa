"""Sittings, motions, votes and contributions for the National Assembly, the Nairobi County Assembly, the Cabinet and the
Supreme Court, with the fiscal years and budgets some motions concern. The matters and the divisions are invented
development data (parties vote mostly along their lines; some members are absent); the laws they cite are real
provisions of the Constitution already in the seed."""

from __future__ import annotations

import csv
import random

from dev_seed.common import SEED, Row
from dev_seed.motion_data import COUNTY, GOVERNMENT_PARTIES, NATIONAL, speech_text
from dev_seed.people import Builder
from dev_seed.store import Tables


def _provision_exists(slug: str) -> bool:
    path = SEED / "data/ke/legal/constitution-2010/chapter-12/provisions.csv"
    with path.open(encoding="utf-8") as handle:
        return any(row["code"] == f"ke.constitution-2010.{slug}" for row in csv.DictReader(handle))


def build_activities(b: Builder, t: Tables) -> None:
    rng = random.Random("activities")
    party_of = {m["individual_code"]: m["party_code"].removeprefix("ke.party.") for m in b.memberships}
    mps = [h for h in b.holders if h["office_code"].startswith("ke.office.mp.")]
    mcas = [h for h in b.holders if h["office_code"].startswith("ke.office.mca.nairobi.")]
    # fiscal years and budgets
    for year in (2023, 2024, 2025, 2026):
        code = f"ke.fiscal-period.fy-{year}-{year + 1}"
        t.add(
            "ke/finance/fiscal_periods.csv",
            {
                "code": code,
                "starts_on": f"{year}-07-01",
                "ends_on": f"{year + 1}-06-30",
                "period_kind_code": "fin.period.kind.financial-year",
                "country_code": "ke",
            },
        )
        budget = f"ke.budget.national.fy-{year}-{year + 1}"
        t.add(
            "ke/finance/budgets.csv",
            {
                "code": budget,
                "fiscal_period_code": code,
                "budget_kind_code": "fin.budget.kind.national",
                "country_code": "ke",
            },
        )
        t.add(
            "ke/finance/budget_versions.csv",
            {
                "budget_code": budget,
                "revision": "1",
                "status_code": "fin.budget.status.approved",
                "released_on": f"{year}-06-15",
            },
        )
    # the Cabinet, Supreme Court, Presidency and nominated members are built by dev_seed.governance
    cabinet = [h for h in b.holders if h["office_code"].startswith("ke.office.cabinet.")]
    judges = [h for h in b.holders if h["office_code"].startswith("ke.office.supreme-court.")]

    def sitting(code: str, institution: str, kind: str, title: str, day: str) -> None:
        t.add(
            "ke/activities/sittings.csv",
            {
                "code": code,
                "institution_code": institution,
                "sitting_kind_code": f"act.sitting.kind.{kind}",
                "title": title,
                "held_on": day,
            },
        )

    def motion(
        code: str,
        sit: str,
        title: str,
        kind: str,
        outcome: str,
        summary: str,
        mover: str,
        provision: str = "",
        budget: str = "",
        fiscal: str = "",
    ) -> None:
        row = {
            "code": code,
            "sitting_code": sit,
            "motion_kind_code": f"act.motion.kind.{kind}",
            "outcome_code": f"act.motion.outcome.{outcome}",
            "title": title,
            "summary": summary,
            "moved_by_holder_code": mover,
        }
        if provision and _provision_exists(provision):
            row.update(instrument_code="ke.constitution-2010", provision_code=f"ke.constitution-2010.{provision}")
        if budget:
            row.update(budget_version_code=f"{budget}|1", fiscal_period_code=fiscal)
        t.add("ke/activities/motions.csv", row)

    def division(motion_code: str, members: list[Row], government_prob: float, whole: bool = False) -> None:
        """Records every member's position (the motion's outcome is set afterwards from these votes)."""
        for holder in members:
            party = party_of.get(holder["individual_code"], "independent")
            line = party in GOVERNMENT_PARTIES
            roll = rng.random()
            if roll < 0.12:
                position = "absent"
            elif roll < 0.15:
                position = "abstain"
            else:
                support = government_prob if line else 1 - government_prob
                position = "yes" if (rng.random() < max(0.05, min(0.95, support))) else "no"
            if whole:
                position = "absent" if roll < 0.04 else "yes"
            t.add(
                "ke/activities/votes.csv",
                {
                    "motion_code": motion_code,
                    "holder_code": holder["code"],
                    "position_code": f"act.vote.position.{position}",
                },
            )

    for index, (slug_, title, kind, outcome, summary, provision, has_budget, prob, _day) in enumerate(NATIONAL):
        sit = f"ke.sitting.na.2025-{index + 1:02d}"
        sitting(
            sit,
            "ke.institution.national-assembly",
            "plenary",
            f"National Assembly sitting {index + 1}",
            f"2025-{3 + index:02d}-{12 + index:02d}",
        )
        mover = rng.choice(mps)["code"]
        fy = "ke.fiscal-period.fy-2025-2026"
        motion(
            f"ke.motion.na.{slug_}",
            sit,
            title,
            kind,
            outcome,
            summary,
            mover,
            provision,
            "ke.budget.national.fy-2025-2026" if has_budget else "",
            fy if has_budget else "",
        )
        division(f"ke.motion.na.{slug_}", mps, prob)
        for member in rng.sample(mps, 12):
            ckind = rng.choice(["speech", "speech", "question", "statement"])
            t.add(
                "ke/activities/contributions.csv",
                {
                    "code": f"ke.contribution.na.{slug_}.{member['code'].rsplit('.', 2)[-2]}",
                    "sitting_code": sit,
                    "holder_code": member["code"],
                    "motion_code": f"ke.motion.na.{slug_}",
                    "contribution_kind_code": f"act.contribution.kind.{ckind}",
                    "summary": speech_text(ckind, title, rng.randint(0, 9)),
                    "word_count": str(rng.randint(120, 1500)),
                },
            )
    for index, (slug_, title, kind, outcome, summary, has_budget, prob) in enumerate(COUNTY):
        sit = f"ke.sitting.nairobi-assembly.2025-{index + 1:02d}"
        sitting(
            sit,
            "ke.institution.nairobi.assembly",
            "plenary",
            f"Nairobi County Assembly sitting {index + 1}",
            f"2025-{4 + index:02d}-{8 + index:02d}",
        )
        mover = rng.choice(mcas)["code"]
        motion(
            f"ke.motion.nairobi.{slug_}",
            sit,
            title,
            kind,
            outcome,
            summary,
            mover,
            "",
            "ke.budget.national.fy-2025-2026" if has_budget else "",
            "ke.fiscal-period.fy-2025-2026" if has_budget else "",
        )
        division(f"ke.motion.nairobi.{slug_}", mcas, prob)
        for member in rng.sample(mcas, 8):
            t.add(
                "ke/activities/contributions.csv",
                {
                    "code": f"ke.contribution.nairobi.{slug_}.{member['code'].rsplit('.', 2)[-2]}",
                    "sitting_code": sit,
                    "holder_code": member["code"],
                    "motion_code": f"ke.motion.nairobi.{slug_}",
                    "contribution_kind_code": "act.contribution.kind.speech",
                    "summary": speech_text("speech", title, rng.randint(0, 9)),
                    "word_count": str(rng.randint(80, 900)),
                },
            )
    for index, title in enumerate(
        ("Adoption of the national infrastructure plan", "Approval of the housing delivery framework")
    ):
        sit = f"ke.sitting.cabinet.2025-{index + 1:02d}"
        sitting(
            sit, "ke.institution.cabinet", "cabinet", f"Cabinet meeting {index + 1}", f"2025-0{index + 5}-1{index + 4}"
        )
        motion(
            f"ke.motion.cabinet.{index + 1}",
            sit,
            title,
            "executive-decision",
            "passed",
            "Decision recorded in the Cabinet's despatch.",
            cabinet[index]["code"],
        )
        division(f"ke.motion.cabinet.{index + 1}", cabinet, 0.95, whole=True)
        for member in cabinet[:6]:
            t.add(
                "ke/activities/contributions.csv",
                {
                    "code": f"ke.contribution.cabinet.{index + 1}.{member['code'].rsplit('.', 2)[-2]}",
                    "sitting_code": sit,
                    "holder_code": member["code"],
                    "motion_code": f"ke.motion.cabinet.{index + 1}",
                    "contribution_kind_code": "act.contribution.kind.statement",
                    "summary": speech_text("statement", title, rng.randint(0, 9)),
                    "word_count": str(rng.randint(60, 400)),
                },
            )
    sit = "ke.sitting.supreme-court.2025-01"
    sitting(sit, "ke.institution.supreme-court", "bench", "Full bench: advisory and petition judgments", "2025-06-24")
    motion(
        "ke.motion.supreme-court.1",
        sit,
        "Judgment on the constitutionality of a county levy",
        "judgment",
        "passed",
        "The bench holds the levy lawful by a majority.",
        judges[0]["code"],
        "art-209",
    )
    for number, judge in enumerate(judges):
        t.add(
            "ke/activities/votes.csv",
            {
                "motion_code": "ke.motion.supreme-court.1",
                "holder_code": judge["code"],
                "position_code": "act.vote.position.yes" if number < 5 else "act.vote.position.no",
            },
        )
    for judge in judges[:5]:
        t.add(
            "ke/activities/contributions.csv",
            {
                "code": f"ke.contribution.supreme-court.1.{judge['code'].rsplit('.', 2)[-2]}",
                "sitting_code": sit,
                "holder_code": judge["code"],
                "motion_code": "ke.motion.supreme-court.1",
                "contribution_kind_code": "act.contribution.kind.statement",
                "summary": speech_text("statement-judge", "the constitutionality of a county levy", rng.randint(0, 9)),
                "word_count": str(rng.randint(400, 2500)),
            },
        )
    _outcomes_follow_votes(t)


def _outcomes_follow_votes(t: Tables) -> None:
    """A motion passes when more members voted yes than no; the recorded outcome always agrees with the recorded votes."""
    tally: dict[str, int] = {}
    for vote in t.rows("ke/activities/votes.csv"):
        delta = 1 if vote["position_code"].endswith(".yes") else -1 if vote["position_code"].endswith(".no") else 0
        tally[vote["motion_code"]] = tally.get(vote["motion_code"], 0) + delta
    for motion in t.rows("ke/activities/motions.csv"):
        if motion["motion_code" if "motion_code" in motion else "code"] in tally:
            motion["outcome_code"] = f"act.motion.outcome.{'passed' if tally[motion['code']] > 0 else 'rejected'}"
