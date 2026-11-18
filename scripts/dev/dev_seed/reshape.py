"""Reshapes the invented development rows to the current schema before they are written.

The builders were written for the earlier schema (activities, facts, one reference file per dev batch). Rather than
rewrite each builder, this step maps their rows to the tables the schema has now:

- sittings, motions, votes and contributions become events and occurrences (the dated meeting), governance sittings,
  motions, votes and speeches (the legislative record);
- facts become fun-fact content rows about a place;
- electorates carry the reporting status the schema now requires;
- dev reference schemes and values that the real seed defines now are dropped, and the retired `act.*` codes map to `gov.*`.
"""

from __future__ import annotations

import csv

from dev_seed.common import SEED
from dev_seed.store import Tables

MOTION_KIND = {"bill": "motion", "budget": "budget-estimate"}
SITTING_KIND = {"cabinet": "cabinet-meeting"}


def _real_codes() -> tuple[set[str], set[str]]:
    base = SEED / "data/global/reference"
    schemes: set[str] = set()
    values: set[str] = set()
    with (base / "schemes.csv").open(encoding="utf-8", newline="") as handle:
        schemes = {row["code"] for row in csv.DictReader(handle)}
    for path in (base / "values").glob("*.values.csv"):
        if path.name.startswith("dev"):
            continue
        with path.open(encoding="utf-8", newline="") as handle:
            values.update(row["code"] for row in csv.DictReader(handle))
    return schemes, values


def _drop_duplicate_reference(t: Tables) -> None:
    schemes, values = _real_codes()
    for path, rows in list(t._rows.items()):
        name = path.rsplit("/", 1)[-1]
        if not path.startswith("global/reference/") or "dev" not in name:
            continue
        if name.endswith(".schemes.csv"):
            rows[:] = [r for r in rows if r["code"] not in schemes and not r["code"].startswith("act.")]
        elif name.endswith(".values.csv"):
            rows[:] = [r for r in rows if r["code"] not in values and not r["code"].startswith("act.")]
        elif name.endswith(".value_labels.csv"):
            rows[:] = [r for r in rows if not r["value_code"].startswith("act.")]
        elif name.endswith(".value_relations.csv"):
            rows[:] = [r for r in rows if not any(str(v).startswith("act.") for v in r.values())]


def _gov(code: str, old: str, new: str, mapping: dict[str, str] | None = None) -> str:
    tail = code.removeprefix(old + ".")
    return f"{new}.{(mapping or {}).get(tail, tail)}"


def _activities(t: Tables) -> None:
    sittings = t._rows.pop("ke/activities/sittings.csv", [])
    motions = t._rows.pop("ke/activities/motions.csv", [])
    votes = t._rows.pop("ke/activities/votes.csv", [])
    contributions = t._rows.pop("ke/activities/contributions.csv", [])
    for s in sittings:
        slug = s["code"].removeprefix("ke.sitting.")
        event = f"ke.event.sitting.{slug}"
        occurrence = f"ke.occurrence.sitting.{slug}"
        t.add("ke/event/events.csv", {"code": event, "country_code": "ke", "event_kind_code": "evt.event.kind.sitting"})
        t.add(
            "ke/event/occurrences.csv",
            {
                "code": occurrence,
                "event_code": event,
                "planned_starts_on": s["held_on"],
                "actual_starts_on": s["held_on"],
                "status_code": "evt.occurrence.status.held",
                "knowledge_code": "evt.occurrence.knowledge.confirmed",
                "timezone": "Africa/Nairobi",
                "is_all_day": "false",
            },
        )
        t.add(
            "ke/governance/sittings.csv",
            {
                "code": s["code"],
                "institution_code": s["institution_code"],
                "occurrence_code": occurrence,
                "sitting_kind_code": _gov(s["sitting_kind_code"], "act.sitting.kind", "gov.sitting.kind", SITTING_KIND),
                "title": s["title"],
            },
        )
    for m in motions:
        m["motion_kind_code"] = _gov(m["motion_kind_code"], "act.motion.kind", "gov.motion.kind", MOTION_KIND)
        m["outcome_code"] = _gov(m["outcome_code"], "act.motion.outcome", "gov.motion.outcome")
        t.add("ke/governance/motions.csv", m)
    for v in votes:
        v["position_code"] = _gov(v["position_code"], "act.vote.position", "gov.vote.position")
        t.add("ke/governance/votes.csv", v)
    order: dict[str, int] = {}
    for c in contributions:
        order[c["sitting_code"]] = order.get(c["sitting_code"], 0) + 1
        row = dict(c)
        row["speech_kind_code"] = _gov(row.pop("contribution_kind_code"), "act.contribution.kind", "gov.speech.kind")
        row["position"] = str(order[c["sitting_code"]])
        t.add("ke/governance/speeches.csv", row)


def _facts(t: Tables) -> None:
    facts = t._rows.pop("ke/facts/facts.csv", [])
    places: dict[str, str] = {}
    for p in t._rows.pop("ke/facts/fact_places.csv", []):
        places.setdefault(p["fact_code"], p["feature_code"])
    for number, f in enumerate(facts, start=1):
        place = places.get(f["code"])
        t.add(
            "ke/filesystem/contents.csv",
            {
                "code": f"ke.content.fun-fact.{number:03d}",
                "language_code": "en",
                "title": f["statement"],
                "summary": f.get("detail", ""),
                "category_code": "fil.content.category.fun-fact",
                "classification_code": "fil.content.classification.tip",
                "body": f.get("detail") or f["statement"],
                "is_development_text": "true",
                "subject_table": "geography.features" if place else "reference.countries",
                "subject_code": place or "ke",
            },
        )


def reshape(t: Tables) -> None:
    for row in t.rows("ke/filesystem/contents.csv"):
        row.pop("slug", None)
    _drop_duplicate_reference(t)
    _activities(t)
    _facts(t)
    for row in t.rows("ke/politics/electorates.csv"):
        row.setdefault("status_code", "pol.result.status.declared")
