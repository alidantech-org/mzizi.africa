"""Builds the development seed under `.dev/seed-dev/` and a merged tree the engine's seed loader can read.

The dev data exists only to prove the API and the UIs against a real PostgreSQL database. It is invented and not
verified: the people, parties' members, amounts and dates are made up, tagged `dev` in their codes, and are never
promoted to `seed/`. Geometries are the real geoBoundaries outlines kept under `.dev/datasets`.

    uv run scripts/dev/build_dev_seed.py            # writes .dev/seed-dev/data/** and .dev/seed-dev/merged/
    uv run mzizi-engine seed --root .dev/seed-dev/merged --apply

The merged tree is `seed/` (symlinked) plus the dev files, with the artifact catalogue extended for the dev files so
the loader records their provenance like any other seed file.
"""

from __future__ import annotations

import csv
import difflib
import json
import random
import re
import shutil
from dataclasses import dataclass
from pathlib import Path

from shapely import make_valid, to_wkt
from shapely.geometry import MultiPolygon, Point, Polygon, shape
from shapely.geometry.base import BaseGeometry

from mzizi_manifest.features.data.datasets import artifact_code, dataset_code

ROOT = Path(__file__).resolve().parents[2]
SEED = ROOT / "seed"
DEV = ROOT / ".dev" / "seed-dev"
DATA = DEV / "data"
MERGED = DEV / "merged"
GEO = ROOT / ".dev" / "datasets" / "geoboundaries" / "KEN"
ADM1 = (
    ROOT / ".dev" / "archives" / "seed" / "_fixtures" / "extraction" / "geoboundaries" / "KEN-ADM1-simplified.geojson"
)

Row = dict[str, str]


@dataclass(frozen=True)
class Feature:
    code: str
    name: str


def slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def write_csv(relative: str, header: list[str], rows: list[Row]) -> None:
    path = DATA / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=header, extrasaction="ignore", lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def read_features(folder: str) -> list[Feature]:
    base = SEED / "data" / "ke" / "geo" / folder
    names: dict[str, str] = {}
    with (base / "names.csv").open(encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            if row["is_default"] == "true":
                names[row["feature_code"]] = row["name"]
    with (base / "features.csv").open(encoding="utf-8") as handle:
        return [Feature(row["code"], names.get(row["code"], row["code"])) for row in csv.DictReader(handle)]


# --------------------------------------------------------------------------------------------------- geometries
def polygonal(geometry: BaseGeometry) -> MultiPolygon:
    """The geometry as a valid MultiPolygon (the column accepts any geometry; outlines are polygonal)."""
    fixed = geometry if geometry.is_valid else make_valid(geometry)
    parts: list[Polygon] = []
    pending = [fixed]
    while pending:
        item = pending.pop()
        if isinstance(item, Polygon):
            parts.append(item)
        elif hasattr(item, "geoms"):
            pending.extend(item.geoms)
    return MultiPolygon(parts)


def best_match(name: str, candidates: dict[str, str]) -> str | None:
    """The candidate code whose last segment is `name`, or the closest spelling above a cutoff."""
    wanted = slug(name)
    for code in candidates:
        if code.rsplit(".", 1)[-1] == wanted:
            return code
    close = difflib.get_close_matches(wanted, [code.rsplit(".", 1)[-1] for code in candidates], n=1, cutoff=0.72)
    if not close:
        return None
    return next(code for code in candidates if code.rsplit(".", 1)[-1] == close[0])


def load_shapes(path: Path) -> list[tuple[str, BaseGeometry]]:
    document = json.loads(path.read_text(encoding="utf-8"))
    return [(item["properties"]["shapeName"], shape(item["geometry"])) for item in document["features"]]


def build_geometries(
    counties: list[Feature], constituencies: list[Feature], wards: list[Feature]
) -> dict[str, MultiPolygon]:
    result: dict[str, MultiPolygon] = {}
    county_codes = {f.code: f.name for f in counties}
    county_shapes: dict[str, BaseGeometry] = {}
    for name, geometry in load_shapes(ADM1):
        code = best_match(name, county_codes)
        if code is not None and code not in county_shapes:
            county_shapes[code] = geometry
            result[code] = polygonal(geometry)
    constituency_shapes: dict[str, BaseGeometry] = {}
    for name, geometry in load_shapes(GEO / "KEN-ADM2-simplified.geojson"):
        point = geometry.representative_point()
        county = next((c for c, g in county_shapes.items() if g.contains(point)), None)
        pool = {f.code: f.name for f in constituencies if county is not None and f.code.startswith(f"{county}.")}
        code = best_match(name, pool or {f.code: f.name for f in constituencies})
        if code is not None and code not in constituency_shapes:
            constituency_shapes[code] = geometry
            result[code] = polygonal(geometry)
    taken: set[str] = set()
    for name, geometry in load_shapes(GEO / "KEN-ADM3-simplified.geojson"):
        centre: Point = geometry.representative_point()
        parent = next((c for c, g in constituency_shapes.items() if g.contains(centre)), None)
        if parent is None:
            continue
        pool = {f.code: f.name for f in wards if f.code.startswith(f"{parent}.") and f.code not in taken}
        code = best_match(name, pool)
        if code is not None:
            taken.add(code)
            result[code] = polygonal(geometry)
    return result


def write_geometries(geometries: dict[str, MultiPolygon]) -> None:
    rows = [
        {
            "feature_code": code,
            "geometry_role_code": "geo.geometry.role.outline",
            "basis_code": "geo.geometry.basis.approximate",
            "revision": "1",
            "srid": "4326",
            "geometry": f"SRID=4326;{to_wkt(geometry, rounding_precision=5)}",
            "confidence": "0.7",
            "from_year": "2013",
            "from_to_precision": "exact",
            "min_zoom": "0",
            "max_zoom": "18",
        }
        for code, geometry in sorted(geometries.items())
    ]
    header = [
        "feature_code",
        "geometry_role_code",
        "basis_code",
        "revision",
        "srid",
        "geometry",
        "confidence",
        "from_year",
        "from_to_precision",
        "min_zoom",
        "max_zoom",
    ]
    write_csv("ke/geo/dev-boundaries/geometries.csv", header, rows)


# ------------------------------------------------------------------------------------------------------- people
FIRST = [
    "Wanjiru",
    "Kamau",
    "Achieng",
    "Otieno",
    "Njeri",
    "Mwangi",
    "Akinyi",
    "Odhiambo",
    "Chebet",
    "Kiprono",
    "Amina",
    "Hassan",
    "Naliaka",
    "Wafula",
    "Mutheu",
    "Musyoka",
    "Wambui",
    "Kariuki",
    "Atieno",
    "Omondi",
    "Jepkosgei",
    "Kiplagat",
    "Fatuma",
    "Abdi",
    "Nyambura",
    "Maina",
    "Adhiambo",
    "Ochieng",
    "Cherono",
    "Rotich",
    "Zawadi",
    "Mohamed",
    "Syokau",
    "Kioko",
    "Naserian",
    "Lekishon",
    "Moraa",
    "Nyakundi",
    "Wangari",
    "Gathoni",
]
LAST = [
    "Mwangi",
    "Njoroge",
    "Otieno",
    "Kamau",
    "Odhiambo",
    "Wekesa",
    "Kiptoo",
    "Mutua",
    "Ndung'u",
    "Omondi",
    "Kibet",
    "Abdullahi",
    "Wanyama",
    "Kimani",
    "Ochieng",
    "Muriuki",
    "Barasa",
    "Cheruiyot",
    "Ouma",
    "Nyaga",
    "Korir",
    "Ali",
    "Mbugua",
    "Simiyu",
    "Kilonzo",
    "Gitau",
    "Onyango",
    "Langat",
    "Hussein",
    "Macharia",
    "Nzioka",
    "Ruto",
    "Karanja",
]
PARTIES = [
    ("uda", "United Democratic Alliance", 5),
    ("odm", "Orange Democratic Movement", 5),
    ("jubilee", "Jubilee Party", 2),
    ("wiper", "Wiper Democratic Movement", 2),
    ("anc", "Amani National Congress", 1),
    ("kanu", "Kenya African National Union", 1),
    ("ford-kenya", "FORD-Kenya", 1),
    ("dap-k", "Democratic Action Party of Kenya", 1),
    ("independent", "Independent", 1),
]
COMPANY_WORDS = [
    "Savannah",
    "Rift",
    "Lakeside",
    "Highland",
    "Coastal",
    "Equator",
    "Baobab",
    "Acacia",
    "Kilimani",
    "Safari",
]
COMPANY_TRADES = [
    "Roadworks",
    "Construction",
    "Water Engineering",
    "Electrical Works",
    "Supplies",
    "Medical Supplies",
    "ICT Solutions",
    "Builders",
]
PROJECT_THEMES = [
    ("Rehabilitation of access roads", "roads"),
    ("Borehole drilling and water supply", "water"),
    ("Construction of a health dispensary", "health"),
    ("Supply of classroom desks", "education"),
    ("Street lighting installation", "energy"),
    ("Upgrading of a market shed", "markets"),
]


def person_name(rng: random.Random) -> str:
    return f"{rng.choice(FIRST)} {rng.choice(LAST)}"


def weighted_party(rng: random.Random) -> tuple[str, str]:
    pool = [(code, name) for code, name, weight in PARTIES for _ in range(weight)]
    return rng.choice(pool)


class Builder:
    def __init__(self) -> None:
        self.entities: list[Row] = []
        self.names: list[Row] = []
        self.individuals: list[Row] = []
        self.institutions: list[Row] = []
        self.offices: list[Row] = []
        self.holders: list[Row] = []
        self.parties: list[Row] = []
        self.memberships: list[Row] = []
        self.projects: list[Row] = []
        self.procurements: list[Row] = []
        self.bids: list[Row] = []
        self.contracts: list[Row] = []
        self.person_count = 0

    def entity(self, code: str, kind: str, name: str, trading: bool = False) -> None:
        self.entities.append({"code": code, "kind_code": kind})
        self.names.append(
            {
                "entity_code": code,
                "name_kind_code": "ofc.name.kind.official",
                "language_code": "en",
                "is_preferred": "true",
                "name": name,
            }
        )
        del trading

    def person(self, rng: random.Random) -> str:
        self.person_count += 1
        code = f"ke.person.dev-{self.person_count:05d}"
        year = rng.randint(1958, 1990)
        self.individuals.append(
            {"code": code, "birth_date": f"{year}-{rng.randint(1, 12):02d}-{rng.randint(1, 28):02d}"}
        )
        self.names.append(
            {
                "individual_code": code,
                "name_kind_code": "ofc.name.kind.official",
                "language_code": "en",
                "is_preferred": "true",
                "name": person_name(rng),
            }
        )
        return code

    def holder(self, rng: random.Random, office: str, party_code: str, party_name: str) -> None:
        person = self.person(rng)
        self.holders.append(
            {
                "code": f"{office}.2022",
                "office_code": office,
                "individual_code": person,
                "appointment_kind_code": "gov.appointment.kind.elected",
                "took_office_on": "2022-08-25",
                "from_year": "2022",
                "from_to_precision": "exact",
            }
        )
        self.memberships.append(
            {
                "code": f"{person}.{party_code}",
                "individual_code": person,
                "party_code": f"ke.party.{party_code}",
                "membership_kind_code": "pol.membership.kind.member",
                "joined_on": "2021-03-01",
                "from_year": "2021",
                "from_to_precision": "exact",
            }
        )
        del party_name


def build_people(b: Builder, counties: list[Feature], constituencies: list[Feature], wards: list[Feature]) -> None:
    for code, name, _ in PARTIES:
        b.entity(f"ke.party.{code}", "ofc.entity.kind.political-party", name)
        b.parties.append(
            {
                "code": f"ke.party.{code}",
                "entity_code": f"ke.party.{code}",
                "party_kind_code": "pol.party.kind.fully-registered",
            }
        )
    b.entity("ke.institution.national-assembly", "ofc.entity.kind.public-body", "National Assembly")
    b.institutions.append(
        {
            "code": "ke.institution.national-assembly",
            "entity_code": "ke.institution.national-assembly",
            "institution_kind_code": "gov.institution.kind.legislature",
        }
    )
    county_slug = {f.code: f.code.split(".")[1] for f in counties}
    for county in counties:
        key = county_slug[county.code]
        b.entity(
            f"ke.institution.{key}.government",
            "ofc.entity.kind.county-government",
            f"County Government of {county.name}",
        )
        b.institutions.append(
            {
                "code": f"ke.institution.{key}.government",
                "entity_code": f"ke.institution.{key}.government",
                "institution_kind_code": "gov.institution.kind.county-government",
            }
        )
        b.entity(f"ke.institution.{key}.assembly", "ofc.entity.kind.public-body", f"{county.name} County Assembly")
        b.institutions.append(
            {
                "code": f"ke.institution.{key}.assembly",
                "entity_code": f"ke.institution.{key}.assembly",
                "institution_kind_code": "gov.institution.kind.legislature",
            }
        )
        rng = random.Random(f"governor.{key}")
        office = f"ke.office.governor.{key}"
        b.offices.append(
            {
                "code": office,
                "institution_code": f"ke.institution.{key}.government",
                "office_kind_code": "gov.office.kind.governor",
                "unit_feature_code": county.code,
                "from_year": "2013",
                "from_to_precision": "exact",
            }
        )
        pcode, pname = weighted_party(rng)
        b.holder(rng, office, pcode, pname)
    for item in constituencies:
        parts = item.code.split(".")
        county_key, local = parts[1], parts[2]
        rng = random.Random(f"mp.{item.code}")
        office = f"ke.office.mp.{county_key}.{local}"
        b.offices.append(
            {
                "code": office,
                "institution_code": "ke.institution.national-assembly",
                "office_kind_code": "gov.office.kind.member-of-parliament",
                "unit_feature_code": item.code,
                "from_year": "2013",
                "from_to_precision": "exact",
            }
        )
        pcode, pname = weighted_party(rng)
        b.holder(rng, office, pcode, pname)
    for item in wards:
        parts = item.code.split(".")
        county_key, const_key, local = parts[1], parts[2], parts[3]
        rng = random.Random(f"mca.{item.code}")
        office = f"ke.office.mca.{county_key}.{const_key}.{local}"
        b.offices.append(
            {
                "code": office,
                "institution_code": f"ke.institution.{county_key}.assembly",
                "office_kind_code": "gov.office.kind.member-of-county-assembly",
                "unit_feature_code": item.code,
                "from_year": "2013",
                "from_to_precision": "exact",
            }
        )
        pcode, pname = weighted_party(rng)
        b.holder(rng, office, pcode, pname)


def build_procurement(b: Builder, counties: list[Feature], constituencies: list[Feature], wards: list[Feature]) -> None:
    rng = random.Random("procurement")
    companies: list[str] = []
    for i in range(60):
        name = f"{rng.choice(COMPANY_WORDS)} {rng.choice(COMPANY_TRADES)} Ltd"
        code = f"ke.company.dev-{i + 1:03d}"
        companies.append(code)
        b.entity(code, "ofc.entity.kind.company", name)
    wards_by_county: dict[str, list[Feature]] = {}
    for ward in wards:
        wards_by_county.setdefault(ward.code.split(".")[1], []).append(ward)
    sequence = 0

    def add(buyer_key: str, scope: Feature, theme: tuple[str, str], rng: random.Random) -> None:
        nonlocal sequence
        sequence += 1
        n = f"{sequence:05d}"
        year = rng.choice([2024, 2025, 2026])
        published = f"{year}-{rng.randint(1, 9):02d}-{rng.randint(1, 28):02d}"
        title = f"{theme[0]}: {scope.name}"
        project, procurement = f"ke.project.dev-{n}", f"ke.procurement.dev-{n}"
        b.projects.append(
            {
                "code": project,
                "name": title,
                "description": f"{title}. Sample project for the development database.",
                "status_code": rng.choice(
                    ["civ.project.status.planned", "civ.project.status.ongoing", "civ.project.status.completed"]
                ),
                "scope_unit_feature_code": scope.code,
                "responsible_institution_code": f"ke.institution.{buyer_key}.government",
                "country_code": "ke",
                "started_on": published,
            }
        )
        b.procurements.append(
            {
                "code": procurement,
                "buyer_entity_code": f"ke.institution.{buyer_key}.government",
                "procedure_kind_code": rng.choice(
                    [
                        "civ.procurement.procedure.open-tender",
                        "civ.procurement.procedure.request-for-quotation",
                        "civ.procurement.procedure.restricted-tender",
                    ]
                ),
                "project_code": project,
                "published_on": published,
                "country_code": "ke",
            }
        )
        amount = rng.randint(8, 240) * 250_000 * 100
        bidders = rng.sample(companies, 3)
        winner = rng.choice(bidders)
        for index, bidder in enumerate(bidders, start=1):
            b.bids.append(
                {
                    "code": f"{procurement}.b{index}",
                    "procurement_code": procurement,
                    "bidder_entity_code": bidder,
                    "outcome_code": "civ.bid.outcome.successful"
                    if bidder == winner
                    else "civ.bid.outcome.unsuccessful",
                    "amount_minor_units": str(int(amount * (1 + (index - 1) * 0.07))),
                    "currency_code": "fin.currency.kes",
                    "submitted_on": published,
                }
            )
        b.contracts.append(
            {
                "code": f"ke.contract.dev-{n}",
                "procurement_code": procurement,
                "project_code": project,
                "contractor_entity_code": winner,
                "amount_minor_units": str(amount),
                "currency_code": "fin.currency.kes",
                "signed_on": published,
                "status_code": rng.choice(
                    ["civ.contract.status.active", "civ.contract.status.completed", "civ.contract.status.signed"]
                ),
            }
        )

    for county in counties:
        key = county.code.split(".")[1]
        for theme in rng.sample(PROJECT_THEMES, 3):
            add(key, county, theme, rng)
        for ward in rng.sample(wards_by_county.get(key, []), min(len(wards_by_county.get(key, [])), 8)):
            add(key, ward, rng.choice(PROJECT_THEMES), rng)
    for item in constituencies:
        for theme in rng.sample(PROJECT_THEMES, 2):
            add(item.code.split(".")[1], item, theme, rng)


def write_people(b: Builder) -> None:
    write_csv(
        "global/reference/dev.schemes.csv",
        ["code", "title", "owner_snapshot"],
        [
            {
                "code": "gov.appointment.kind",
                "title": "How an office holder came to hold the office",
                "owner_snapshot": "dev sample",
            },
            {"code": "civ.project.status", "title": "Where a public project stands", "owner_snapshot": "dev sample"},
        ],
    )
    values: list[Row] = []
    labels_sw: list[Row] = []
    kinds = (
        (
            "gov.office.kind",
            [
                ("governor", "Governor", "Gavana"),
                ("member-of-parliament", "Member of Parliament", "Mbunge"),
                ("member-of-county-assembly", "Member of County Assembly", "Mwakilishi wa Wadi"),
            ],
        ),
        (
            "gov.appointment.kind",
            [
                ("elected", "Elected", "Amechaguliwa"),
                ("nominated", "Nominated", "Ameteuliwa na chama"),
                ("appointed", "Appointed", "Ameteuliwa"),
            ],
        ),
        (
            "civ.project.status",
            [
                ("planned", "Planned", "Imepangwa"),
                ("ongoing", "Ongoing", "Inaendelea"),
                ("completed", "Completed", "Imekamilika"),
                ("stalled", "Stalled", "Imekwama"),
            ],
        ),
    )
    for scheme, members in kinds:
        for word, english, swahili in members:
            values.append({"code": f"{scheme}.{word}", "scheme_code": scheme, "label": english})
            labels_sw.append(
                {"value_code": f"{scheme}.{word}", "language_code": "sw", "label_kind": "preferred", "label": swahili}
            )
    write_csv("global/reference/values/dev.values.csv", ["code", "scheme_code", "label"], values)
    write_csv(
        "global/reference/dev.value_labels.csv", ["value_code", "language_code", "label_kind", "label"], labels_sw
    )
    write_csv("ke/official/entities.csv", ["code", "kind_code"], b.entities)
    write_csv("ke/official/individuals.csv", ["code", "birth_date"], b.individuals)
    write_csv(
        "ke/official/names.csv",
        ["entity_code", "individual_code", "name_kind_code", "language_code", "is_preferred", "name"],
        b.names,
    )
    write_csv("ke/governance/institutions.csv", ["code", "entity_code", "institution_kind_code"], b.institutions)
    write_csv(
        "ke/governance/offices.csv",
        ["code", "institution_code", "office_kind_code", "unit_feature_code", "from_year", "from_to_precision"],
        b.offices,
    )
    write_csv(
        "ke/governance/holders.csv",
        [
            "code",
            "office_code",
            "individual_code",
            "appointment_kind_code",
            "took_office_on",
            "from_year",
            "from_to_precision",
        ],
        b.holders,
    )
    write_csv("ke/politics/parties.csv", ["code", "entity_code", "party_kind_code"], b.parties)
    write_csv(
        "ke/politics/memberships.csv",
        [
            "code",
            "individual_code",
            "party_code",
            "membership_kind_code",
            "joined_on",
            "from_year",
            "from_to_precision",
        ],
        b.memberships,
    )
    write_csv(
        "ke/civic/projects.csv",
        [
            "code",
            "name",
            "description",
            "status_code",
            "scope_unit_feature_code",
            "responsible_institution_code",
            "country_code",
            "started_on",
        ],
        b.projects,
    )
    write_csv(
        "ke/civic/procurements.csv",
        ["code", "buyer_entity_code", "procedure_kind_code", "project_code", "published_on", "country_code"],
        b.procurements,
    )
    write_csv(
        "ke/civic/bids.csv",
        [
            "code",
            "procurement_code",
            "bidder_entity_code",
            "outcome_code",
            "amount_minor_units",
            "currency_code",
            "submitted_on",
        ],
        b.bids,
    )
    write_csv(
        "ke/civic/contracts.csv",
        [
            "code",
            "procurement_code",
            "project_code",
            "contractor_entity_code",
            "amount_minor_units",
            "currency_code",
            "signed_on",
            "status_code",
        ],
        b.contracts,
    )


# ----------------------------------------------------------------------------------------------------- merging
def merge_trees() -> None:
    """Symlink every seed file into the merged tree, add the dev files and extend the artifact catalogue."""
    if MERGED.exists():
        shutil.rmtree(MERGED)
    for source in SEED.rglob("*"):
        target = MERGED / source.relative_to(SEED)
        if source.is_dir():
            target.mkdir(parents=True, exist_ok=True)
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            target.symlink_to(source)
    added: list[Path] = []
    for source in sorted(DATA.rglob("*.csv")):
        target = MERGED / "data" / source.relative_to(DATA)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)
        added.append(target)
    catalogue = MERGED / "data" / "global" / "source"
    artifacts: list[Row] = []
    editions: list[Row] = []
    products: dict[str, Row] = {}
    for file in added:
        code = artifact_code(MERGED, file)
        product = dataset_code(MERGED, file)
        relative = file.relative_to(MERGED).as_posix()
        digest = code.split("~", 1)[1].removesuffix(".csv")
        import hashlib

        artifacts.append(
            {
                "code": code,
                "edition_code": code.removesuffix(".csv"),
                "sha256": hashlib.sha256(file.read_bytes()).hexdigest(),
                "format": "csv",
                "content_type": "text/csv",
                "size_bytes": str(file.stat().st_size),
                "location": f"seed/{relative}",
            }
        )
        editions.append(
            {
                "code": code.removesuffix(".csv"),
                "product_code": product,
                "designation": digest,
                "description": "dev sample CSV",
            }
        )
        products[product] = {
            "code": product,
            "kind_code": "src.product.kind.dataset",
            "title": f"Dev sample data: {relative.removeprefix('data/')}",
            "description": "Invented development data; not verified and not promoted to seed.",
        }
    for name, rows in (
        ("seed.artifacts.csv", artifacts),
        ("seed.editions.csv", editions),
        ("seed.products.csv", list(products.values())),
    ):
        path = catalogue / name
        original = path.resolve()
        with original.open(encoding="utf-8", newline="") as handle:
            reader = csv.DictReader(handle)
            header = list(reader.fieldnames or [])
            existing = list(reader)
        path.unlink()
        with path.open("w", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(handle, fieldnames=header, extrasaction="ignore", lineterminator="\n")
            writer.writeheader()
            writer.writerows([*existing, *rows])


def main() -> None:
    if DATA.exists():
        shutil.rmtree(DATA)
    counties = read_features("counties")
    constituencies = read_features("constituencies")
    wards = read_features("wards")
    geometries = build_geometries(counties, constituencies, wards)
    print(
        f"geometries: {sum(1 for c in counties if c.code in geometries)}/{len(counties)} counties, "
        f"{sum(1 for c in constituencies if c.code in geometries)}/{len(constituencies)} constituencies, "
        f"{sum(1 for c in wards if c.code in geometries)}/{len(wards)} wards"
    )
    write_geometries(geometries)
    builder = Builder()
    build_people(builder, counties, constituencies, wards)
    build_procurement(builder, counties, constituencies, wards)
    write_people(builder)
    merge_trees()
    print(
        f"people: {builder.person_count}, offices: {len(builder.offices)}, projects: {len(builder.projects)}, "
        f"bids: {len(builder.bids)}, contracts: {len(builder.contracts)}; merged tree: {MERGED}"
    )


if __name__ == "__main__":
    main()
