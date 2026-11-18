"""Elections 2013, 2017 and 2022: contests, candidates, electorates and results.

The presidential candidates and national totals are the published IEBC figures; the county split of those totals is
modelled so that it adds up to them (regional bias, registered voters from the county table) and is development data.
Governor and MP contests are modelled: in 2022 the winner is the person who holds the office in the dev database, so a
leader's page can show the votes that put them there. Losing candidates are invented."""

from __future__ import annotations

import random
from dataclasses import dataclass

from dev_seed.common import Feature, Row, slug
from dev_seed.names import PARTIES, weighted_party
from dev_seed.people import Builder
from dev_seed.real import CountyFigures, PartyAllocation
from dev_seed.store import Tables

ELECTIONS = {2013: "2013-03-04", 2017: "2017-08-08", 2022: "2022-08-09"}
VOTERS_REGISTERED = {2013: 14_352_533, 2017: 19_611_423, 2022: 22_120_458}
# year -> [(person slug, display name, party code, national votes)]
PRESIDENTIAL: dict[int, list[tuple[str, str, str, int]]] = {
    2013: [
        ("uhuru-kenyatta", "Uhuru Kenyatta", "jubilee", 6_173_433),
        ("raila-odinga", "Raila Odinga", "odm", 5_340_546),
        ("musalia-mudavadi", "Musalia Mudavadi", "anc", 483_981),
    ],
    2017: [
        ("uhuru-kenyatta", "Uhuru Kenyatta", "jubilee", 8_203_290),
        ("raila-odinga", "Raila Odinga", "odm", 6_762_224),
        ("ekuru-aukot", "Ekuru Aukot", "independent", 27_311),
    ],
    2022: [
        ("william-ruto", "William Ruto", "uda", 7_176_141),
        ("raila-odinga", "Raila Odinga", "odm", 6_942_930),
        ("george-wajackoyah", "George Wajackoyah", "independent", 61_969),
        ("david-mwaure", "David Mwaure", "independent", 31_987),
    ],
}
WEST_COAST = {
    "kisumu",
    "siaya",
    "homa-bay",
    "migori",
    "mombasa",
    "kilifi",
    "kwale",
    "lamu",
    "tana-river",
    "busia",
    "vihiga",
    "kakamega",
    "bungoma",
    "nairobi",
    "machakos",
    "makueni",
    "kitui",
    "taita-taveta",
    "garissa",
    "wajir",
    "mandera",
    "marsabit",
    "isiolo",
}
PARTY_SLUGS = {"united-democratic-alliance": "uda", "orange-democratic-movement": "odm", "jubilee-party": "jubilee"}


@dataclass(frozen=True)
class Seat:
    contest: str
    unit: str
    registered: int


def add_real_parties(b: Builder, fund: list[PartyAllocation]) -> dict[str, str]:
    """All registered parties of the 2026/27 fund list, as party entities; returns registry code to party code."""
    known = {code for code, _, _ in PARTIES}
    by_registry: dict[str, str] = {}
    for party in fund:
        code = PARTY_SLUGS.get(slug(party.name)) or f"orpp-{party.registry_code}"
        by_registry[party.registry_code] = code
        if code in known:
            continue
        known.add(code)
        b.entity(f"ke.party.{code}", "ofc.entity.kind.political-party", party.name)
        b.parties.append(
            {
                "code": f"ke.party.{code}",
                "entity_code": f"ke.party.{code}",
                "party_kind_code": "pol.party.kind.fully-registered",
            }
        )
    return by_registry


def _membership(b: Builder, person: str, party: str, year: int) -> None:
    b.memberships.append(
        {
            "code": f"{person}.{party}.{year}",
            "individual_code": person,
            "party_code": f"ke.party.{party}",
            "membership_kind_code": "pol.membership.kind.member",
            "joined_on": f"{year - 1}-06-01",
            "from_year": str(year - 1),
            "from_to_precision": "exact",
        }
    )


def build_elections(
    b: Builder,
    t: Tables,
    counties: list[Feature],
    constituencies: list[Feature],
    figures: dict[str, CountyFigures],
    extra_party_codes: list[str],
) -> None:
    holders = {h["office_code"]: h for h in b.holders}
    party_of = {m["individual_code"]: m["party_code"].removeprefix("ke.party.") for m in b.memberships}
    for year, held in ELECTIONS.items():
        code = f"ke.election.{year}"
        t.add(
            "ke/politics/elections.csv",
            {"code": code, "election_kind_code": "pol.election.kind.general", "held_on": held, "country_code": "ke"},
        )
    # presidential: one contest, results by county
    for year in ELECTIONS:
        contest = f"ke.contest.{year}.presidential"
        t.add(
            "ke/politics/contests.csv",
            {
                "code": contest,
                "election_code": f"ke.election.{year}",
                "contest_kind_code": "pol.contest.kind.presidential",
                "unit_feature_code": "ke",
            },
        )
        t.add(
            "ke/politics/electorates.csv",
            {
                "contest_code": contest,
                "unit_feature_code": "ke",
                "registered_voters": str(VOTERS_REGISTERED[year]),
                "ballots_cast": str(round(sum(v for *_, v in PRESIDENTIAL[year]) / 0.985)),
                "valid_ballots": str(sum(v for *_, v in PRESIDENTIAL[year])),
                "rejected_ballots": str(round(sum(v for *_, v in PRESIDENTIAL[year]) * 0.015)),
            },
        )
        scale = {2013: 0.74, 2017: 0.89, 2022: 1.0}[year]
        weights: dict[str, list[float]] = {}
        rng = random.Random(f"president.{year}")
        for county in counties:
            key = county.code.split(".")[1]
            registered = figures[key].registered_voters_2022 * scale
            lean = rng.uniform(0.55, 0.85) if key in WEST_COAST else rng.uniform(0.1, 0.4)
            weights[county.code] = [registered, lean]
        for index, (person, name, party, total) in enumerate(PRESIDENTIAL[year]):
            individual = f"ke.person.{person}"
            if not any(i["code"] == individual for i in b.individuals):
                b.individuals.append({"code": individual, "birth_date": ""})
                b.names.append(
                    {
                        "individual_code": individual,
                        "name_kind_code": "ofc.name.kind.official",
                        "language_code": "en",
                        "is_preferred": "true",
                        "name": name,
                    }
                )
            cand = f"ke.candidate.{year}.presidential.{person}"
            t.add(
                "ke/politics/candidates.csv",
                {
                    "code": cand,
                    "contest_code": contest,
                    "individual_code": individual,
                    "candidate_kind_code": "pol.candidate.kind.candidate",
                    "party_id_at_election_code": f"ke.party.{party}",
                    "ballot_order": str(index + 1),
                },
            )
            if not any(m["code"] == f"{individual}.{party}.{year}" for m in b.memberships):
                _membership(b, individual, party, year)
            raw: dict[str, float]
            if index == 0:
                raw = {c: w[0] * (1 - w[1]) for c, w in weights.items()}
            elif index == 1:
                raw = {c: w[0] * w[1] for c, w in weights.items()}
            else:
                raw = {c: w[0] * rng.uniform(0.5, 1.5) for c, w in weights.items()}
            norm = sum(raw.values())
            shares = {unit_code: round(total * value / norm) for unit_code, value in raw.items()}
            shares[next(reversed(shares))] += total - sum(
                shares.values()
            )  # the county figures add up to the published total
            for unit_code, votes in shares.items():
                t.add(
                    "ke/politics/results.csv",
                    {
                        "candidate_code": cand,
                        "unit_feature_code": unit_code,
                        "votes": str(votes),
                        "status_code": "pol.result.status.declared",
                    },
                )
    # county electorates for the presidential contest
    for year in ELECTIONS:
        contest = f"ke.contest.{year}.presidential"
        scale = {2013: 0.74, 2017: 0.89, 2022: 1.0}[year]
        cast = {
            r["unit_feature_code"]: 0
            for r in t.rows("ke/politics/results.csv")
            if r["candidate_code"].startswith(f"ke.candidate.{year}.presidential")
        }
        for r in t.rows("ke/politics/results.csv"):
            if r["candidate_code"].startswith(f"ke.candidate.{year}.presidential."):
                cast[r["unit_feature_code"]] += int(r["votes"])
        for county in counties:
            reg = round(figures[county.code.split(".")[1]].registered_voters_2022 * scale)
            valid = cast[county.code]
            t.add(
                "ke/politics/electorates.csv",
                {
                    "contest_code": contest,
                    "unit_feature_code": county.code,
                    "registered_voters": str(reg),
                    "ballots_cast": str(round(valid / 0.985)),
                    "valid_ballots": str(valid),
                    "rejected_ballots": str(round(valid * 0.015)),
                },
            )
    # governors and MPs
    parties = [c for c, _, _ in PARTIES if c != "independent"] + extra_party_codes[:6]
    for year in ELECTIONS:
        scale = {2013: 0.74, 2017: 0.89, 2022: 1.0}[year]
        for county in counties:
            key = county.code.split(".")[1]
            _contest(
                b,
                t,
                f"ke.contest.{year}.governor.{key}",
                year,
                "pol.contest.kind.governor",
                f"ke.office.governor.{key}",
                county.code,
                round(figures[key].registered_voters_2022 * scale),
                holders,
                party_of,
                parties,
            )
        for item in constituencies:
            _, ck, local = item.code.split(".")
            county_reg = figures[ck].registered_voters_2022 * scale
            share = 1 / max(1, sum(1 for c in constituencies if c.code.split(".")[1] == ck))
            reg = round(county_reg * share * random.Random(f"reg.{item.code}").uniform(0.7, 1.3))
            _contest(
                b,
                t,
                f"ke.contest.{year}.mp.{ck}.{local}",
                year,
                "pol.contest.kind.member-of-parliament",
                f"ke.office.mp.{ck}.{local}",
                item.code,
                reg,
                holders,
                party_of,
                parties,
            )


def _contest(
    b: Builder,
    t: Tables,
    code: str,
    year: int,
    kind: str,
    office: str,
    unit: str,
    registered: int,
    holders: dict[str, Row],
    party_of: dict[str, str],
    parties: list[str],
) -> None:
    rng = random.Random(code)
    t.add(
        "ke/politics/contests.csv",
        {
            "code": code,
            "election_code": f"ke.election.{year}",
            "contest_kind_code": kind,
            "office_code": office,
            "unit_feature_code": unit,
        },
    )
    turnout = rng.uniform(0.52, 0.82)
    valid = round(registered * turnout * 0.985)
    count = rng.randint(3, 5)
    win_share = rng.uniform(0.34, 0.66)
    rest = [rng.uniform(0.2, 1.0) for _ in range(count - 1)]
    shares = [win_share] + [(1 - win_share) * r / sum(rest) for r in rest]
    t.add(
        "ke/politics/electorates.csv",
        {
            "contest_code": code,
            "unit_feature_code": unit,
            "registered_voters": str(registered),
            "ballots_cast": str(round(valid / 0.985)),
            "valid_ballots": str(valid),
            "rejected_ballots": str(round(valid * 0.015)),
        },
    )
    for index, share in enumerate(shares):
        if index == 0 and year == 2022 and office in holders:
            person, party = (
                holders[office]["individual_code"],
                party_of.get(holders[office]["individual_code"], "independent"),
            )
        else:
            person = b.person(rng)
            party = rng.choice(parties) if index else weighted_party(rng)[0]
            _membership(b, person, party, year)
        cand = f"ke.candidate.{code.removeprefix('ke.contest.')}.{index + 1}"
        t.add(
            "ke/politics/candidates.csv",
            {
                "code": cand,
                "contest_code": code,
                "individual_code": person,
                "candidate_kind_code": "pol.candidate.kind.candidate",
                "party_id_at_election_code": f"ke.party.{party}",
                "ballot_order": str(index + 1),
            },
        )
        t.add(
            "ke/politics/results.csv",
            {
                "candidate_code": cand,
                "unit_feature_code": unit,
                "votes": str(round(valid * share)),
                "status_code": "pol.result.status.declared",
            },
        )
