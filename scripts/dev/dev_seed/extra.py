"""Development rows for the tables the 2026-11-19 schema added: events and the election timetable, seasons, calendars,
terms, facilities, polling stations with station-level votes, bills with stages and agenda, reporting obligations and
reports, coverage, metrics and abbreviations. Everything here is invented or illustrative development data, tagged `dev`
in its notes, and never promoted to `seed/`. Community rows (actors, devices, posts) are created by visitors at runtime,
so they are not seeded."""

from __future__ import annotations

import random
from datetime import date, timedelta

from dev_seed.common import Feature, Row
from dev_seed.people import Builder
from dev_seed.store import Tables

DEV = "Development data: illustrative, not an official record."
PUBLIC_HOLIDAYS = [
    ("new-year", "New Year's Day", "Siku ya Mwaka Mpya", 1, 1),
    ("labour-day", "Labour Day", "Siku ya Wafanyakazi", 5, 1),
    ("madaraka-day", "Madaraka Day", "Siku ya Madaraka", 6, 1),
    ("mashujaa-day", "Mashujaa Day", "Siku ya Mashujaa", 10, 20),
    ("jamhuri-day", "Jamhuri Day", "Siku ya Jamhuri", 12, 12),
    ("christmas-day", "Christmas Day", "Siku ya Krismasi", 12, 25),
    ("boxing-day", "Boxing Day", "Siku ya Ndondi", 12, 26),
]
MILESTONES = [
    ("voter-registration-closes", "Voter registration closes", -90),
    ("nominations-open", "Nominations open", -60),
    ("nominations-close", "Nominations close", -45),
    ("campaign-period-starts", "Campaign period starts", -45),
    ("polling-day", "Polling day", 0),
    ("results-declared", "Results declared", 7),
    ("petition-deadline", "Petition deadline", 14),
]


def _easter(year: int) -> date:
    a, b, c = year % 19, year // 100, year % 100
    d, e = b // 4, b % 4
    g = (8 * b + 13) // 25
    h = (19 * a + b - d - g + 15) % 30
    i, k = c // 4, c % 4
    el = (32 + 2 * e + 2 * i - h - k) % 7
    m = (a + 11 * h + 19 * el) // 433
    month = (h + el - 7 * m + 90) // 25
    day = (h + el - 7 * m + 33 * month + 19) % 32
    return date(year, month, day)


def _second_tuesday(year: int, month: int) -> date:
    first = date(year, month, 1)
    return first + timedelta(days=(1 - first.weekday()) % 7 + 7)


def _event(t: Tables, code: str, kind: str, en: str, sw: str = "", extra: Row | None = None) -> None:
    row: Row = {"code": code, "country_code": "ke", "event_kind_code": f"evt.event.kind.{kind}"}
    row.update(extra or {})
    t.add("ke/event/events.csv", row)
    t.add("ke/event/names.csv", {"event_code": code, "language_code": "en", "name": en, "is_preferred": "true"})
    if sw:
        t.add("ke/event/names.csv", {"event_code": code, "language_code": "sw", "name": sw, "is_preferred": "true"})


def _occurrence(t: Tables, code: str, event: str, planned: date, actual: date | None, status: str, knowledge: str, note: str = DEV) -> None:
    t.add(
        "ke/event/occurrences.csv",
        {
            "code": code,
            "event_code": event,
            "planned_starts_on": planned.isoformat(),
            "actual_starts_on": actual.isoformat() if actual else "",
            "status_code": f"evt.occurrence.status.{status}",
            "knowledge_code": f"evt.occurrence.knowledge.{knowledge}",
            "timezone": "Africa/Nairobi",
            "is_all_day": "true",
            "venue_note": note,
        },
    )


def _calendar_and_events(t: Tables, counties: list[Feature]) -> None:
    for code, kind, name_note in [
        ("ke.calendar.gregorian", "gregorian", False),
        ("ke.calendar.fiscal-year", "fiscal-year", False),
        ("ke.calendar.school-year", "school-year", False),
        ("ke.calendar.islamic-lunar", "islamic-lunar", True),
    ]:
        row: Row = {"code": code, "country_code": "ke", "calendar_kind_code": f"evt.calendar.kind.{kind}", "is_observed": str(name_note).lower()}
        if kind == "fiscal-year":
            row.update(year_start_month="7", year_start_day="1")
        if kind == "school-year":
            row.update(year_start_month="1", year_start_day="1")
        t.add("ke/event/calendars.csv", row)
    years = (2026, 2027, 2028)
    for slug, en, sw, month, day in PUBLIC_HOLIDAYS:
        ev = f"ke.event.holiday.{slug}"
        _event(t, ev, "public-holiday", en, sw, {"calendar_code": "ke.calendar.gregorian"})
        t.add(
            "ke/event/rules.csv",
            {"event_code": ev, "rule_kind_code": "evt.rule.kind.fixed-date", "month": str(month), "day_of_month": str(day),
             "adjustment_code": "evt.rule.adjustment.next-monday-if-sunday", "rrule": f"FREQ=YEARLY;BYMONTH={month};BYMONTHDAY={day}"},
        )
        for year in years:
            planned = date(year, month, day)
            moved = planned + timedelta(days=1) if planned.weekday() == 6 else None
            occ = f"ke.occurrence.holiday.{slug}.{year}"
            _occurrence(t, occ, ev, planned, moved or planned, "rescheduled" if moved else "scheduled", "confirmed")
            if moved:
                t.add(
                    "ke/event/changes.csv",
                    {"code": f"ke.change.holiday.{slug}.{year}", "occurrence_code": occ, "change_kind_code": "evt.change.kind.reschedule",
                     "reason_code": "evt.change.reason.rest-day", "from_on": planned.isoformat(), "to_on": moved.isoformat(),
                     "explanation": "The date falls on a Sunday, so the holiday is observed on the Monday. " + DEV},
                )
    for slug, en, sw, offset in [("good-friday", "Good Friday", "Ijumaa Kuu", -2), ("easter-monday", "Easter Monday", "Jumatatu ya Pasaka", 1)]:
        ev = f"ke.event.holiday.{slug}"
        _event(t, ev, "public-holiday", en, sw, {"calendar_code": "ke.calendar.gregorian"})
        for year in years:
            day = _easter(year) + timedelta(days=offset)
            _occurrence(t, f"ke.occurrence.holiday.{slug}.{year}", ev, day, day, "scheduled", "confirmed")
    # the general election: a rule, the held and the projected occurrence, venues across the counties, the election row and a timetable
    ge = "ke.event.general-election"
    _event(t, ge, "general-election", "General election", "Uchaguzi mkuu", {"calendar_code": "ke.calendar.gregorian"})
    t.add(
        "ke/event/rules.csv",
        {"event_code": ge, "rule_kind_code": "evt.rule.kind.nth-weekday", "month": "8", "weekday": "2", "nth_weekday": "2",
         "interval_years": "5", "anchor_on": "2022-08-09", "from_year": "2022", "from_to_precision": "exact", "rrule": "FREQ=YEARLY;INTERVAL=5;BYMONTH=8;BYDAY=2TU"},
    )
    _occurrence(t, "ke.occurrence.general-election.2022", ge, date(2022, 8, 9), date(2022, 8, 9), "held", "confirmed")
    day_2027 = _second_tuesday(2027, 8)
    _occurrence(t, "ke.occurrence.general-election.2027", ge, day_2027, None, "scheduled", "projected",
                "Projected from the rule: the second Tuesday of August every fifth year. " + DEV)
    for c in counties:
        t.add("ke/event/venues.csv", {"occurrence_code": "ke.occurrence.general-election.2027", "feature_code": c.code,
                                      "role_code": "evt.venue.role.area-covered"})
    t.add("ke/politics/elections.csv", {"code": "ke.election.2027", "election_kind_code": "pol.election.kind.general",
                                        "held_on": day_2027.isoformat(), "country_code": "ke",
                                        "status_code": "pol.election.status.planned", "term_code": "ke.term.parliament.14"})
    for number, code in [(11, "ke.election.2013"), (12, "ke.election.2017"), (13, "ke.election.2022")]:
        for row in t.rows("ke/politics/elections.csv"):
            if row["code"] == code:
                row["status_code"] = "pol.election.status.certified"
                row["term_code"] = f"ke.term.parliament.{number}"
    t.add("ke/event/subjects.csv", {"code": "ke.event-subject.general-election.2027", "event_code": ge, "role_code": "evt.subject.role.about",
                                    "subject_table": "politics.elections", "subject_code": "ke.election.2027"})
    schedule = "ke.schedule.election-timetable.2027"
    t.add("ke/event/schedules.csv", {"code": schedule, "country_code": "ke", "schedule_kind_code": "evt.schedule.kind.election-timetable",
                                     "anchor_event_code": ge, "anchor_on": day_2027.isoformat(), "status_code": "evt.schedule.status.draft",
                                     "issuer_entity_code": "ke.institution.iebc"})
    for position, (slug, en, offset) in enumerate(MILESTONES, start=1):
        ev = f"ke.event.election-milestone.2027.{slug}"
        _event(t, ev, "election-milestone", en)
        occ = f"ke.occurrence.election-milestone.2027.{slug}"
        _occurrence(t, occ, ev, day_2027 + timedelta(days=offset), None, "scheduled", "projected",
                    "Illustrative offset from polling day. " + DEV)
        t.add("ke/event/items.csv", {"schedule_code": schedule, "event_code": ev, "occurrence_code": occ, "offset_days": str(offset),
                                     "counts_working_days": "false", "position": str(position), "note": DEV})
        t.add("ke/event/subjects.csv", {"code": f"ke.event-subject.election-milestone.2027.{slug}", "event_code": ev,
                                        "role_code": "evt.subject.role.milestone-of", "subject_table": "politics.elections",
                                        "subject_code": "ke.election.2027"})
    for slug, kind, sm, sd, em, ed, natural in [
        ("long-rains", "long-rains", 3, 1, 5, 31, True), ("short-rains", "short-rains", 10, 1, 12, 31, True),
        ("dry-season-early", "dry-season", 1, 1, 2, 28, True), ("dry-season-mid", "dry-season", 6, 1, 9, 30, True),
        ("term-1", "school-term", 1, 1, 4, 30, False), ("term-2", "school-term", 5, 1, 8, 31, False), ("term-3", "school-term", 9, 1, 11, 30, False),
    ]:
        t.add("ke/event/seasons.csv", {"code": f"ke.season.{slug}", "country_code": "ke", "season_kind_code": f"evt.season.kind.{kind}",
                                       "start_month": str(sm), "start_day": str(sd), "end_month": str(em), "end_day": str(ed),
                                       "is_natural": str(natural).lower(), "description": DEV})


def _terms(t: Tables) -> None:
    for number, start, end in [(11, "2013-03-28", "2017-08-30"), (12, "2017-08-31", "2022-09-07"), (13, "2022-09-08", "2027-09-07"), (14, "2027-09-08", "")]:
        t.add("ke/governance/terms.csv", {"code": f"ke.term.parliament.{number}", "country_code": "ke", "term_kind_code": "gov.term.kind.parliamentary",
                                          "institution_code": "ke.institution.parliament", "ordinal": str(number), "starts_on": start, "ends_on": end})
    for number, start, end in [(1, "2013-04-09", "2022-09-12"), (2, "2022-09-13", "")]:
        t.add("ke/governance/terms.csv", {"code": f"ke.term.presidential.{number}", "country_code": "ke", "term_kind_code": "gov.term.kind.presidential",
                                          "institution_code": "ke.institution.presidency", "ordinal": str(number), "starts_on": start, "ends_on": end})


def _point(shape) -> str:
    p = shape.representative_point()
    return f"SRID=4326;POINT({p.x:.5f} {p.y:.5f})"


def _facilities(b: Builder, t: Tables, counties, constituencies, wards, geometries) -> None:
    rng = random.Random("facilities")
    institutions = {r["code"] for r in b.institutions}
    candidates = ["ke.candidate.2022.presidential.william-ruto", "ke.candidate.2022.presidential.raila-odinga",
                  "ke.candidate.2022.presidential.george-wajackoyah", "ke.candidate.2022.presidential.david-mwaure"]
    shares = [0.50, 0.48, 0.015, 0.005]

    def feature(code: str, name: str, kind: str, near: str, from_year: str = "2013", part_of: str | None = None) -> str | None:
        shape = geometries.get(near)
        if shape is None:
            return None
        t.add("ke/geo/dev-facilities/features.csv", {"code": code, "feature_type_code": f"geo.feature.kind.{kind}", "from_year": from_year, "from_to_precision": "approximate"})
        t.add("ke/geo/dev-facilities/names.csv", {"feature_code": code, "name": name, "name_kind_code": "geo.name.kind.official", "language_code": "en", "is_default": "true"})
        t.add("ke/geo/dev-facilities/geometries.csv", {"feature_code": code, "geometry_role_code": "geo.geometry.role.label-point", "basis_code": "geo.geometry.basis.approximate",
                                                      "revision": "1", "srid": "4326", "geometry": _point(shape), "confidence": "0.4", "from_year": from_year, "from_to_precision": "approximate"})
        if part_of:
            t.add("ke/geo/dev-facilities/relationships.csv", {"subject_feature_code": code, "object_feature_code": part_of,
                                                             "relationship_kind_code": "geo.relationship.kind.part-of", "system_code": "geo.relationship.system.administrative",
                                                             "from_year": "2013", "from_to_precision": "approximate"})
        return code

    def facility(code: str, feat: str, klass: str, operator: str, ownership: str = "public", status: str = "operational") -> None:
        row: Row = {"code": code, "feature_code": feat, "facility_class_code": f"civ.facility.class.{klass}", "country_code": "ke",
                    "ownership_code": f"civ.facility.ownership.{ownership}", "status_code": f"civ.facility.status.{status}", "opened_on": "2013-03-04"}
        if operator in institutions:
            row["operator_entity_code"] = operator
        t.add("ke/civic/facilities.csv", row)

    def observe(indicator: str, feat: str, value: int) -> None:
        t.add("ke/statistics/observations.csv", {"code": f"{indicator}.{feat}.2025-01-01", "indicator_code": indicator, "feature_code": feat,
                                                 "period_from": "2025-01-01", "value": str(value), "estimated": "true"})

    for indicator, name, desc, topic in [("sta.facility.beds", "Hospital beds", "Beds in one facility.", "topic.health"),
                                         ("sta.facility.enrolment", "School enrolment", "Learners enrolled in one school.", "topic.education"),
                                         ("sta.facility.classrooms", "Classrooms", "Classrooms in one school.", "topic.education")]:
        t.add("ke/statistics/indicators.csv", {"code": indicator, "name": name, "description": desc + " " + DEV, "topic_code": topic,
                                               "unit_code": "unit.person" if indicator != "sta.facility.classrooms" else "", "measure_kind_code": "sta.measure.kind.count",
                                               "role_code": "sta.indicator.role.facility-capacity"})
    for county in counties:
        gov = f"ke.institution.{county.code.removeprefix('ke.')}.government"
        assembly = f"ke.institution.{county.code.removeprefix('ke.')}.assembly"
        slug = county.code.removeprefix("ke.")
        for kind, name, klass, operator in [("governor-office", f"Office of the Governor, {county.name}", "governor-office", gov),
                                            ("assembly-office", f"{county.name} County Assembly offices", "county-assembly", assembly),
                                            ("referral-hospital", f"{county.name} County Referral Hospital", "county-referral-hospital", gov)]:
            f = feature(f"{county.code}.{kind}", name, "building", county.code, part_of=county.code)
            if f:
                facility(f"ke.facility.{slug}.{kind}", f, klass, operator)
                if klass == "county-referral-hospital":
                    observe("sta.facility.beds", f, rng.randint(150, 600))
    for con in constituencies:
        parts = con.code.removeprefix("ke.").split(".")
        ngcdf = f"ke.institution.ngcdf.{'.'.join(parts)}"
        for kind, name, klass, operator, near in [("ngcdf-office", f"{con.name} NG-CDF office", "constituency-fund-office", ngcdf, con.code),
                                                  ("health-centre", f"{con.name} Health Centre", "health-centre", f"ke.institution.{parts[0]}.government", con.code),
                                                  ("police-station", f"{con.name} Police Station", "police-station", "ke.institution.national-police-service", con.code)]:
            f = feature(f"{con.code}.{kind}", name, "building", near, part_of=con.code)
            if f:
                facility(f"ke.facility.{'.'.join(parts)}.{kind}", f, klass, operator)
                if klass == "health-centre":
                    observe("sta.facility.beds", f, rng.randint(10, 60))
    for ward in wards:
        parts = ward.code.removeprefix("ke.").split(".")
        school = feature(f"{ward.code}.primary-school", f"{ward.name} Primary School", "building", ward.code)
        station = feature(f"{ward.code}.polling-station", f"{ward.name} Primary School polling station", "polling-station", ward.code)
        if not school or not station:
            continue
        facility(f"ke.facility.{'.'.join(parts)}.primary-school", school, "primary-school", f"ke.institution.{parts[0]}.government")
        observe("sta.facility.enrolment", school, rng.randint(180, 1400))
        observe("sta.facility.classrooms", school, rng.randint(6, 28))
        facility(f"ke.facility.{'.'.join(parts)}.polling-station", station, "polling-station", "ke.institution.iebc")
        for subject, obj, system in [(station, school, "electoral"), (station, ward.code, "electoral"), (school, ward.code, "administrative")]:
            t.add("ke/geo/dev-facilities/relationships.csv", {"subject_feature_code": subject, "object_feature_code": obj,
                                                             "relationship_kind_code": "geo.relationship.kind.located-on" if obj == school else "geo.relationship.kind.part-of",
                                                             "system_code": f"geo.relationship.system.{system}", "from_year": "2013", "from_to_precision": "approximate"})
        registered = rng.randint(250, 900)
        cast = int(registered * rng.uniform(0.62, 0.86))
        rejected, spoilt = rng.randint(0, 6), rng.randint(0, 4)
        valid = max(0, cast - rejected - spoilt)
        t.add("ke/politics/polls.csv", {"code": f"ke.poll.2022.{'.'.join(parts)}", "election_code": "ke.election.2022", "station_feature_code": station,
                                         "host_feature_code": school, "status_code": "pol.poll.status.operated", "registered_voters": str(registered),
                                         "stream_count": str(rng.randint(1, 3)), "note": DEV})
        t.add("ke/politics/electorates.csv", {"contest_code": "ke.contest.2022.presidential", "unit_feature_code": station, "registered_voters": str(registered),
                                              "ballots_cast": str(cast), "valid_ballots": str(valid), "rejected_ballots": str(rejected),
                                              "spoilt_ballots": str(spoilt), "status_code": "pol.result.status.declared"})
        left = valid
        for index, (cand, share) in enumerate(zip(candidates, shares)):
            votes = left if index == len(candidates) - 1 else min(left, int(valid * share * rng.uniform(0.7, 1.3)))
            left -= votes
            t.add("ke/politics/results.csv", {"candidate_code": cand, "unit_feature_code": station, "votes": str(votes), "status_code": "pol.result.status.declared"})


def build_bills(t: Tables) -> None:
    motions = [m for m in t.rows("ke/governance/motions.csv") if "bill" in m.get("title", "").lower()]
    for number, m in enumerate(motions, start=1):
        bill = f"ke.bill.{m['code'].rsplit('.', 1)[-1]}"
        sitting = next((s for s in t.rows("ke/governance/sittings.csv") if s["code"] == m["sitting_code"]), None)
        t.add("ke/governance/bills.csv", {"code": bill, "country_code": "ke", "institution_code": sitting["institution_code"] if sitting else "ke.institution.national-assembly",
                                          "bill_kind_code": "gov.bill.kind.public", "status_code": "gov.bill.status.introduced", "title": m["title"],
                                          "summary": m.get("summary", ""), "sponsor_holder_code": m.get("moved_by_holder_code", "")})
        m["bill_code"] = bill
        for sequence, stage in enumerate(["first-reading", "second-reading", "third-reading"], start=1):
            t.add("ke/governance/stages.csv", {"bill_code": bill, "stage_kind_code": f"gov.stage.kind.{stage}", "sitting_code": m["sitting_code"],
                                               "sequence_number": str(sequence), "outcome_code": "gov.motion.outcome.passed" if sequence < 3 else "gov.motion.outcome.pending"})
    seen: dict[str, int] = {}
    for m in t.rows("ke/governance/motions.csv"):
        seen[m["sitting_code"]] = seen.get(m["sitting_code"], 0) + 1
        t.add("ke/governance/agenda.csv", {"sitting_code": m["sitting_code"], "position": str(seen[m["sitting_code"]]), "agenda_kind_code": "gov.agenda.kind.motions",
                                           "title": m["title"], "motion_code": m["code"], "bill_code": m.get("bill_code", "")})


def _accountability(b: Builder, t: Tables, counties: list[Feature]) -> None:
    rng = random.Random("obligations")
    for code, kind, obligor, freq, text in [
        ("ke.obligation.county-budget", "publish-budget", "county-government", "annual", "Every county government publishes its approved budget."),
        ("ke.obligation.county-quarterly", "report-quarterly-spending", "county-government", "quarterly", "Every county government reports spending each quarter."),
        ("ke.obligation.procurement-plan", "publish-procurement-plan", "procuring-entity", "annual", "Every procuring entity publishes its annual procurement plan."),
        ("ke.obligation.award-notices", "publish-award-notices", "procuring-entity", "per-event", "Award notices are published when a contract is awarded."),
    ]:
        t.add("ke/governance/obligations.csv", {"code": code, "country_code": "ke", "obligation_kind_code": f"gov.obligation.kind.{kind}",
                                                "obligor_kind_code": f"gov.obligor.kind.{obligor}", "frequency_code": f"gov.obligation.frequency.{freq}",
                                                "description": text + " " + DEV})
    statuses = ["on-time", "on-time", "late", "missing", "found-elsewhere"]
    for county in counties:
        entity = f"ke.institution.{county.code.removeprefix('ke.')}.government"
        for quarter in range(1, 5):
            status = rng.choice(statuses)
            row: Row = {"code": f"ke.report.county-quarterly.{county.code.removeprefix('ke.')}.2025-q{quarter}", "obligation_code": "ke.obligation.county-quarterly",
                        "reporter_entity_code": entity, "period_from": f"2025-{(quarter - 1) * 3 + 1:02d}-01", "period_until": f"2025-{quarter * 3:02d}-28",
                        "due_on": f"2025-{min(12, quarter * 3 + 1):02d}-15", "status_code": f"gov.report.status.{status}"}
            if status in ("on-time", "late"):
                row["filed_on"] = f"2025-{min(12, quarter * 3 + 1):02d}-{'10' if status == 'on-time' else '28'}"
            t.add("ke/governance/reports.csv", row)
    for slug, source, subject, level, note in [
        ("ngcdf-projects", "hdx", "projects", "partial", "NG-CDF allocations and project lists are partly published."),
        ("results", "hdx", "results", "complete", "Presidential results by county are published."),
        ("tenders", "hdx", "tenders", "partial", "Open tenders from one portal only."),
        ("facilities", "hdx", "facilities", "none-published", "No national facility register was collected for this development database."),
        ("budgets", "hdx", "budgets", "sample", "A sample of county budgets."),
    ]:
        t.add("ke/source/coverage.csv", {"code": f"ke.coverage.{slug}", "country_code": "ke", "source_code": source, "coverage_subject_code": f"src.coverage.subject.{subject}",
                                         "level_code": f"src.coverage.level.{level}", "checked_on": "2026-11-19", "note": note + " " + DEV})


def _abbreviations(b: Builder) -> None:
    for entity, abbr in [("iebc", "IEBC"), ("orpp", "ORPP"), ("knbs", "KNBS"), ("eacc", "EACC"), ("kra", "KRA"), ("ntsa", "NTSA"), ("nema", "NEMA"),
                         ("nlc", "NLC"), ("psc", "PSC"), ("tsc", "TSC"), ("src", "SRC"), ("cra", "CRA"), ("ppra", "PPRA"), ("dpp", "ODPP"),
                         ("ngec", "NGEC"), ("knchr", "KNCHR"), ("ncic", "NCIC"), ("ca", "CA"), ("ipoa", "IPOA")]:
        b.names.append({"entity_code": f"ke.institution.{entity}", "name_kind_code": "ofc.name.kind.abbreviation",
                        "language_code": "mul", "is_preferred": "false", "name": abbr})
    for party, abbr in [("uda", "UDA"), ("odm", "ODM"), ("jubilee", "Jubilee")]:
        b.names.append({"entity_code": f"ke.party.{party}", "name_kind_code": "ofc.name.kind.abbreviation",
                        "language_code": "mul", "is_preferred": "false", "name": abbr})


def _metrics(t: Tables) -> None:
    for slug, topic, num, den, factor, higher in [
        ("population-density", "topic.population", "sta.population.total", "sta.area.km2", "1", ""),
        ("registered-voters", "topic.elections", "sta.elections.registered-voters", "", "", ""),
        ("literacy", "topic.education", "sta.education.literacy-rate", "", "", "true"),
        ("poverty", "topic.economy", "sta.economy.poverty-rate", "", "", "false"),
        ("health-facilities", "topic.health", "sta.health.facilities-per-100k", "", "", "true"),
    ]:
        t.add("ke/statistics/metrics.csv", {"code": f"ke.metric.{slug}", "topic_code": topic, "numerator_indicator_code": num, "denominator_indicator_code": den,
                                            "per_factor": factor, "higher_is_better": higher, "is_rankable": "true", "default_level_kind_code": "geo.feature.kind.county"})


def build_extra(b: Builder, t: Tables, counties, constituencies, wards, geometries) -> None:
    _terms(t)
    _calendar_and_events(t, counties)
    _facilities(b, t, counties, constituencies, wards, geometries)
    _abbreviations(b)
    _metrics(t)
    _accountability(b, t, counties)
