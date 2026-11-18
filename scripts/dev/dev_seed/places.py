"""Towns, cities and villages below the ward: well-known real places at approximate coordinates, placed under the ward
that contains them. Wards are not the smallest unit the system can describe; these are features of kind city, town or
village with a label point, and statistics, projects and media can attach to them like to any other unit."""

from __future__ import annotations

import random
from dataclasses import dataclass

from shapely.geometry import MultiPolygon, Point

from dev_seed.common import Feature, slug
from dev_seed.store import Tables

# name, latitude, longitude, kind (city or town or village), parent place name for villages, 2019-era population estimate
PLACES: list[tuple[str, float, float, str, str, int]] = [
    ("Nairobi CBD", -1.2864, 36.8172, "town", "", 310000),
    ("Kibera", -1.3133, 36.7878, "town", "", 185000),
    ("Karen", -1.3197, 36.7073, "town", "", 65000),
    ("Eastleigh", -1.2744, 36.8450, "town", "", 240000),
    ("Kangemi", -1.2655, 36.7470, "town", "", 100000),
    ("Kawangware", -1.2830, 36.7440, "town", "", 120000),
    ("Mathare", -1.2603, 36.8590, "town", "", 206000),
    ("Gigiri", -1.2335, 36.8050, "town", "", 18000),
    ("Kayole", -1.2760, 36.9120, "town", "", 190000),
    ("Dandora", -1.2540, 36.9020, "town", "", 150000),
    ("Githurai", -1.2064, 36.9167, "town", "", 140000),
    ("Roysambu", -1.2190, 36.8830, "town", "", 80000),
    ("Kilimani", -1.2900, 36.7870, "town", "", 70000),
    ("Lavington", -1.2780, 36.7700, "town", "", 38000),
    ("Mlolongo", -1.3940, 36.9400, "town", "", 110000),
    ("Rongai", -1.3960, 36.7440, "town", "", 99000),
    ("Soweto East", -1.3150, 36.7950, "village", "Kibera", 30000),
    ("Gatwekera", -1.3120, 36.7810, "village", "Kibera", 26000),
    ("Laini Saba", -1.3100, 36.7930, "village", "Kibera", 28000),
    ("Kianda", -1.3070, 36.7860, "village", "Kibera", 14000),
    ("Makina", -1.3180, 36.7860, "village", "Kibera", 16000),
    ("Huruma", -1.2570, 36.8680, "village", "Mathare", 40000),
    ("Mabatini", -1.2630, 36.8660, "village", "Mathare", 32000),
    ("Kosovo", -1.2590, 36.8620, "village", "Mathare", 28000),
    ("Thika", -1.0332, 37.0693, "town", "", 280000),
    ("Ruiru", -1.1500, 36.9600, "town", "", 300000),
    ("Kiambu", -1.1714, 36.8356, "town", "", 88000),
    ("Limuru", -1.1060, 36.6420, "town", "", 66000),
    ("Machakos", -1.5177, 37.2634, "town", "", 150000),
    ("Kitui", -1.3667, 38.0106, "town", "", 155000),
    ("Naivasha", -0.7172, 36.4310, "town", "", 181000),
    ("Nakuru", -0.3031, 36.0800, "city", "", 570000),
    ("Gilgil", -0.4930, 36.3190, "town", "", 60000),
    ("Eldoret", 0.5143, 35.2698, "city", "", 475000),
    ("Kitale", 1.0157, 35.0062, "town", "", 106000),
    ("Kisumu", -0.0917, 34.7680, "city", "", 610000),
    ("Kakamega", 0.2827, 34.7519, "town", "", 107000),
    ("Bungoma", 0.5635, 34.5606, "town", "", 55000),
    ("Busia", 0.4608, 34.1115, "town", "", 54000),
    ("Homa Bay", -0.5273, 34.4571, "town", "", 66000),
    ("Kisii", -0.6817, 34.7667, "town", "", 120000),
    ("Migori", -1.0634, 34.4731, "town", "", 66000),
    ("Kericho", -0.3689, 35.2863, "town", "", 150000),
    ("Nyeri", -0.4197, 36.9510, "town", "", 125000),
    ("Nanyuki", 0.0067, 37.0722, "town", "", 50000),
    ("Meru", 0.0480, 37.6559, "town", "", 240000),
    ("Embu", -0.5389, 37.4596, "town", "", 60000),
    ("Mombasa Old Town", -4.0620, 39.6730, "town", "", 30000),
    ("Malindi", -3.2192, 40.1169, "town", "", 120000),
    ("Kilifi", -3.6305, 39.8499, "town", "", 100000),
    ("Lamu", -2.2696, 40.9006, "town", "", 24000),
    ("Garissa", -0.4569, 39.6583, "town", "", 163000),
    ("Wajir", 1.7471, 40.0573, "town", "", 90000),
    ("Mandera", 3.9373, 41.8569, "town", "", 100000),
    ("Marsabit", 2.3284, 37.9899, "town", "", 25000),
    ("Lodwar", 3.1191, 35.5973, "town", "", 82000),
    ("Narok", -1.0783, 35.8601, "town", "", 42000),
    ("Kajiado", -1.8524, 36.7820, "town", "", 31000),
    ("Voi", -3.3961, 38.5561, "town", "", 45000),
    ("Isiolo", 0.3546, 37.5822, "town", "", 69000),
    ("Nyahururu", 0.0383, 36.3650, "town", "", 52000),
]
KIND = {"city": "geo.feature.kind.city", "town": "geo.feature.kind.town", "village": "geo.feature.kind.village"}


@dataclass(frozen=True)
class Place:
    code: str
    name: str
    kind: str
    parent_code: str
    latitude: float
    longitude: float
    population: int


def build_places(t: Tables, geometries: dict[str, MultiPolygon], features: list[Feature]) -> list[Place]:
    rng = random.Random("places")
    codes = {f.code for f in features}
    by_depth = sorted((c for c in geometries if c in codes), key=lambda c: -c.count("."))
    made: dict[str, Place] = {}
    for name, lat, lon, kind, parent_name, population in PLACES:
        if parent_name:
            parent = made.get(parent_name)
            if parent is None:
                continue
            parent_code = parent.code
        else:
            point = Point(lon, lat)
            parent_code = next((c for c in by_depth if geometries[c].contains(point)), "")
            if not parent_code:
                continue
        place = Place(f"{parent_code}.{slug(name)}", name, kind, parent_code, lat, lon, population)
        made[name] = place
        t.add(
            "ke/geo/dev-places/features.csv",
            {
                "code": place.code,
                "feature_type_code": KIND[kind],
                "from_year": "1900",
                "from_to_precision": "approximate",
            },
        )
        t.add(
            "ke/geo/dev-places/names.csv",
            {
                "feature_code": place.code,
                "name": name,
                "name_kind_code": "geo.name.kind.official",
                "language_code": "en",
                "is_default": "true",
            },
        )
        t.add(
            "ke/geo/dev-places/relationships.csv",
            {
                "subject_feature_code": place.code,
                "object_feature_code": parent_code,
                "relationship_kind_code": "geo.relationship.kind.part-of",
                "system_code": "geo.relationship.system.administrative",
                "starts_on": "",
                "from_year": "1900",
                "from_to_precision": "approximate",
            },
        )
        t.add(
            "ke/geo/dev-places/geometries.csv",
            {
                "feature_code": place.code,
                "geometry_role_code": "geo.geometry.role.label-point",
                "basis_code": "geo.geometry.basis.approximate",
                "revision": "1",
                "srid": "4326",
                "geometry": f"SRID=4326;POINT({lon:.5f} {lat:.5f})",
                "confidence": "0.6",
                "from_year": "1900",
                "from_to_precision": "approximate",
                "min_zoom": "8",
                "max_zoom": "20",
            },
        )
    del rng
    return list(made.values())
