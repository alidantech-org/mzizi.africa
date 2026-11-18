"""Statistics: indicators and observations for the country, counties, constituencies, wards, towns and villages.

Real figures (county area, the 2009 and 2019 censuses, registered voters in 2022, national population) come from the
Wikipedia county table and the KNBS Facts and Figures kept under `.dev/`. Everything below the county, every breakdown
(sex, age, residence, community, language) and the survey indicators are modelled from those anchors, flagged
`estimated`, and are development data, not published figures."""

from __future__ import annotations

import math
import random
import uuid
from dataclasses import dataclass

from shapely.geometry import MultiPolygon

from dev_seed.common import Feature, Row
from dev_seed.places import Place
from dev_seed.real import CountyFigures, read_key_indicators
from dev_seed.store import Tables

NS = uuid.UUID("5d8e2f0a-6b1c-4c1e-9a53-0d3f7b7a2e11")
CENSUS = {2009: "2009-08-24", 2019: "2019-08-24"}
AGE_SHARES = [11.7, 11.8, 11.3, 10.4, 9.9, 8.8, 7.1, 5.9, 4.6, 3.8, 3.2, 2.5, 2.1, 1.5, 1.2, 1.2]
AGE_CODES = [f"{a}-{a + 4}" for a in range(0, 75, 5)] + ["75-plus"]
COMMUNITIES = [
    "kikuyu",
    "luhya",
    "kalenjin",
    "luo",
    "kamba",
    "kisii",
    "mijikenda",
    "meru",
    "somali",
    "turkana",
    "maasai",
    "embu",
    "taita",
    "other",
]
DOMINANT: dict[str, str] = {
    **dict.fromkeys(["kiambu", "nyeri", "muranga", "kirinyaga", "nyandarua", "laikipia"], "kikuyu"),
    **dict.fromkeys(["kakamega", "bungoma", "vihiga", "busia", "trans-nzoia"], "luhya"),
    **dict.fromkeys(["kisumu", "siaya", "homa-bay", "migori"], "luo"),
    **dict.fromkeys(["kericho", "bomet", "nandi", "uasin-gishu", "baringo", "elgeyo-marakwet", "nakuru"], "kalenjin"),
    **dict.fromkeys(["machakos", "makueni", "kitui"], "kamba"),
    **dict.fromkeys(["kisii", "nyamira"], "kisii"),
    **dict.fromkeys(["mombasa", "kilifi", "kwale", "lamu", "tana-river"], "mijikenda"),
    **dict.fromkeys(["meru", "tharaka-nithi", "isiolo"], "meru"),
    "embu": "embu",
    **dict.fromkeys(["garissa", "wajir", "mandera", "marsabit"], "somali"),
    **dict.fromkeys(["turkana", "west-pokot", "samburu"], "turkana"),
    **dict.fromkeys(["narok", "kajiado"], "maasai"),
    "taita-taveta": "taita",
    "nairobi": "kikuyu",
}
LANGUAGE_OF = {
    "kikuyu": "ki",
    "luhya": "luy",
    "kalenjin": "kln",
    "luo": "luo",
    "kamba": "kam",
    "somali": "so",
    "meru": "mer",
}
INDICATORS: list[tuple[str, str, str, str, str, str, bool | None]] = [
    (
        "sta.area.km2",
        "Land area",
        "topic.land",
        "unit.km2",
        "sta.measure.kind.amount",
        "Area of the unit in square kilometres.",
        None,
    ),
    (
        "sta.population.total",
        "Population",
        "topic.population",
        "unit.person",
        "sta.measure.kind.count",
        "Resident population from the census and yearly estimates.",
        None,
    ),
    (
        "sta.population.language-speakers",
        "Speakers of a language",
        "topic.demographics",
        "unit.person",
        "sta.measure.kind.count",
        "People who speak the language at home.",
        None,
    ),
    (
        "sta.elections.registered-voters",
        "Registered voters",
        "topic.elections",
        "unit.person",
        "sta.measure.kind.count",
        "People on the voters' register at the general election.",
        None,
    ),
    (
        "sta.education.literacy-rate",
        "Literacy rate",
        "topic.education",
        "unit.percent",
        "sta.measure.kind.rate",
        "Share of adults who can read and write.",
        True,
    ),
    (
        "sta.economy.poverty-rate",
        "Poverty rate",
        "topic.economy",
        "unit.percent",
        "sta.measure.kind.rate",
        "Share of people living below the poverty line.",
        False,
    ),
    (
        "sta.water.safe-water-share",
        "Households with safe water",
        "topic.water",
        "unit.percent",
        "sta.measure.kind.share",
        "Share of households using an improved water source.",
        True,
    ),
    (
        "sta.health.facilities-per-100k",
        "Health facilities per 100,000 people",
        "topic.health",
        "unit.per-100k",
        "sta.measure.kind.rate",
        "Licensed health facilities for every 100,000 residents.",
        True,
    ),
    (
        "sta.transparency.audit-opinion-score",
        "Audit opinion score",
        "topic.transparency",
        "unit.score",
        "sta.measure.kind.index",
        "Auditor-General opinion, from 0 (adverse) to 100 (unqualified).",
        True,
    ),
    (
        "sta.transparency.open-data-score",
        "Open data score",
        "topic.transparency",
        "unit.score",
        "sta.measure.kind.index",
        "How much budget and procurement data the body publishes, 0 to 100.",
        True,
    ),
]


@dataclass
class Demography:
    area: dict[str, float]
    population_2019: dict[str, int]
    population_2009: dict[str, int]


def km2(geometry: MultiPolygon) -> float:
    latitude = geometry.centroid.y
    return geometry.area * 111.32 * 111.32 * math.cos(math.radians(latitude))


def obs(t: Tables, indicator: str, feature: str, period: str, value: float, **dims: str) -> None:
    key = f"{indicator}|{feature}|{period}|{sorted(dims.items())}"
    row: Row = {
        "code": f"{indicator}.{feature}.{period}.{uuid.uuid5(NS, key).hex[:8]}",
        "indicator_code": indicator,
        "feature_code": feature,
        "period_from": period,
        "value": f"{value:.4f}".rstrip("0").rstrip("."),
        "estimated": dims.pop("estimated", "true"),
    }
    row.update(dims)
    t.add("ke/statistics/observations.csv", row)


def build_statistics(
    t: Tables,
    counties: list[Feature],
    constituencies: list[Feature],
    wards: list[Feature],
    geometries: dict[str, MultiPolygon],
    figures: dict[str, CountyFigures],
    places: list[Place],
) -> Demography:
    for code, name, topic, unit, measure, describe, better in INDICATORS:
        row: Row = {
            "code": code,
            "name": name,
            "description": describe,
            "topic_code": topic,
            "unit_code": unit,
            "measure_kind_code": measure,
            "higher_is_better": "" if better is None else str(better).lower(),
        }
        t.add("ke/statistics/indicators.csv", row)
    demography = Demography({}, {}, {})
    key_indicators = read_key_indicators().get("population-millions", {})
    for year, millions in key_indicators.items():
        obs(t, "sta.population.total", "ke", f"{year}-07-01", millions * 1_000_000, estimated="false")
    national_2019 = sum(f.population_2019 for f in figures.values())
    obs(t, "sta.population.total", "ke", CENSUS[2019], national_2019, estimated="false")
    obs(
        t,
        "sta.population.total",
        "ke",
        CENSUS[2009],
        sum(f.population_2009 for f in figures.values()),
        estimated="false",
    )
    obs(t, "sta.area.km2", "ke", "2019-01-01", sum(f.area_km2 for f in figures.values()), estimated="false")

    def share_split(parents: list[Feature], children: list[Feature], parent_of: dict[str, str]) -> None:
        grouped: dict[str, list[Feature]] = {}
        for child in children:
            grouped.setdefault(parent_of[child.code], []).append(child)
        for parent, kids in grouped.items():
            rng = random.Random(f"split.{parent}")
            weights = {
                k.code: (km2(geometries[k.code]) if k.code in geometries else 1.0) ** 0.5 * rng.uniform(0.6, 1.6)
                for k in kids
            }
            total = sum(weights.values())
            for kid in kids:
                share = weights[kid.code] / total
                demography.population_2019[kid.code] = round(demography.population_2019[parent] * share)
                demography.population_2009[kid.code] = round(demography.population_2009[parent] * share)
                if kid.code in geometries:
                    demography.area[kid.code] = km2(geometries[kid.code])

    for county in counties:
        slug_ = county.code.split(".")[1]
        figure = figures[slug_]
        demography.area[county.code] = figure.area_km2
        demography.population_2019[county.code] = figure.population_2019
        demography.population_2009[county.code] = figure.population_2009
        growth = (figure.population_2019 / figure.population_2009) ** (1 / 10)
        for year in range(2009, 2026):
            period = CENSUS.get(year, f"{year}-07-01")
            obs(
                t,
                "sta.population.total",
                county.code,
                period,
                figure.population_2009 * growth ** (year - 2009),
                estimated="false" if year in CENSUS else "true",
            )
        obs(t, "sta.area.km2", county.code, "2019-01-01", figure.area_km2, estimated="false")
        rng = random.Random(f"county.{slug_}")
        for year, scale in ((2022, 1.0), (2017, 0.89), (2013, 0.74)):
            obs(
                t,
                "sta.elections.registered-voters",
                county.code,
                f"{year}-08-01",
                figure.registered_voters_2022 * scale * rng.uniform(0.985, 1.015),
                estimated="false" if year == 2022 else "true",
            )
        _breakdowns(t, county.code, slug_, figure.population_2019, rng)
        _survey(t, county.code, rng, slug_)
    county_of = {c.code: c.code for c in counties}
    share_split(counties, constituencies, {c.code: ".".join(c.code.split(".")[:2]) for c in constituencies})
    share_split(constituencies, wards, {w.code: ".".join(w.code.split(".")[:3]) for w in wards})
    del county_of
    for feature in [*constituencies, *wards]:
        if feature.code in demography.area:
            obs(t, "sta.area.km2", feature.code, "2019-01-01", demography.area[feature.code])
        for year in (2009, 2019):
            pop = (demography.population_2019 if year == 2019 else demography.population_2009).get(feature.code)
            if pop:
                obs(t, "sta.population.total", feature.code, CENSUS[year], pop)
    for place in places:
        for year in (2009, 2019):
            obs(t, "sta.population.total", place.code, CENSUS[year], place.population * (0.78 if year == 2009 else 1.0))
        demography.population_2019[place.code] = place.population
    return demography


def _breakdowns(t: Tables, code: str, slug_: str, population: int, rng: random.Random) -> None:
    period = CENSUS[2019]
    female = rng.uniform(0.502, 0.512)
    obs(
        t,
        "sta.population.total",
        code,
        period,
        population * female,
        sex_code="sta.dimension.sex.female",
        estimated="false",
    )
    obs(
        t,
        "sta.population.total",
        code,
        period,
        population * (1 - female),
        sex_code="sta.dimension.sex.male",
        estimated="false",
    )
    young = rng.uniform(-1.2, 1.2)
    weights = [max(0.3, s + (young * (3 - i) * 0.12)) for i, s in enumerate(AGE_SHARES)]
    for age, w in zip(AGE_CODES, weights, strict=True):
        obs(
            t,
            "sta.population.total",
            code,
            period,
            population * w / sum(weights),
            age_group_code=f"sta.dimension.agegroup.{age}",
        )
    urban = (
        1.0
        if slug_ in ("nairobi", "mombasa")
        else min(
            0.9,
            max(
                0.05,
                rng.uniform(0.1, 0.5)
                + (0.2 if slug_ in ("kiambu", "nakuru", "kisumu", "uasin-gishu", "machakos") else 0),
            ),
        )
    )
    obs(t, "sta.population.total", code, period, population * urban, residence_code="sta.dimension.residence.urban")
    obs(
        t,
        "sta.population.total",
        code,
        period,
        population * (1 - urban),
        residence_code="sta.dimension.residence.rural",
    )
    dominant = DOMINANT.get(slug_)
    shares = {c: rng.uniform(0.01, 0.06) for c in COMMUNITIES}
    if dominant:
        shares[dominant] = rng.uniform(0.55, 0.85)
    else:
        shares = {c: rng.uniform(0.02, 0.2) for c in COMMUNITIES}
    total = sum(shares.values())
    for community, share in shares.items():
        obs(
            t,
            "sta.population.total",
            code,
            period,
            population * share / total,
            ethnicity_code=f"sta.dimension.ethnicity.{community}",
        )
        language = LANGUAGE_OF.get(community)
        if language:
            obs(
                t,
                "sta.population.language-speakers",
                code,
                period,
                population * share / total * rng.uniform(0.7, 0.95),
                language_code=language,
            )
    obs(t, "sta.population.language-speakers", code, period, population * rng.uniform(0.9, 0.98), language_code="sw")
    obs(t, "sta.population.language-speakers", code, period, population * rng.uniform(0.3, 0.7), language_code="en")


def _survey(t: Tables, code: str, rng: random.Random, slug_: str) -> None:
    arid = slug_ in ("turkana", "mandera", "wajir", "marsabit", "garissa", "samburu", "west-pokot", "tana-river")
    ranges = {
        "sta.education.literacy-rate": (45, 70) if arid else (78, 96),
        "sta.economy.poverty-rate": (55, 79) if arid else (14, 46),
        "sta.water.safe-water-share": (30, 58) if arid else (55, 92),
        "sta.health.facilities-per-100k": (8, 30),
        "sta.transparency.audit-opinion-score": (20, 95),
        "sta.transparency.open-data-score": (10, 90),
    }
    for indicator, (low, high) in ranges.items():
        for year in (2019, 2023):
            base = rng.uniform(low, high) if year == 2019 else None
            obs(t, indicator, code, f"{year}-01-01", base if base is not None else rng.uniform(low, high))
