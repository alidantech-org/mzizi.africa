"""Tanzania as a second country: its regions, their names in English and Swahili, routing and real boundaries.

Boundaries are the geoBoundaries simplified ADM1 outlines of Tanzania (30 regions; the data is an OpenStreetMap derivative
under the Open Data Commons Open Database Licence 1.0, so the credit and licence below travel with it). Nothing about the
country is hard-coded here beyond what the data lacks: the Swahili spellings of the five Zanzibar regions, whose
geoBoundaries names are English renderings of the official Swahili ones.
"""

from __future__ import annotations

import csv
import json

from shapely.geometry import shape

from dev_seed.common import DATA, ROOT, SEED, slug, write_csv
from dev_seed.geometry import polygonal

TZ_ADM1 = ROOT / ".dev" / "datasets" / "geoboundaries" / "TZA" / "TZA-ADM1-simplified.geojson"
REGION = "geo.feature.kind.region"
# geoBoundaries English rendering -> the official Swahili name, where they differ.
SWAHILI = {
    "Zanzibar South & Central": "Kusini Unguja",
    "Zanzibar North": "Kaskazini Unguja",
    "Zanzibar Urban/West": "Mjini Magharibi",
    "North Pemba": "Kaskazini Pemba",
    "South Pemba": "Kusini Pemba",
}
ESTABLISHED = "1964"


def write_tanzania() -> None:
    if not TZ_ADM1.is_file():
        return  # the outlines have not been fetched; Tanzania is then simply not seeded
    regions = [
        (item["properties"]["shapeName"], shape(item["geometry"]))
        for item in json.loads(TZ_ADM1.read_text(encoding="utf-8"))["features"]
    ]
    regions.sort(key=lambda r: r[0])

    # A kind of place the registered values do not have yet: the first level below a country called a region.
    write_csv(
        "global/reference/values/dev.tz.values.csv",
        ["code", "scheme_code", "label", "parent_code"],
        [{"code": REGION, "scheme_code": "geo.feature.kind", "label": "Region", "parent_code": "geo.feature.kind.administrative"}],
    )
    write_csv(
        "global/reference/dev-tz/value_labels.csv",
        ["value_code", "language_code", "label_kind", "label"],
        [{"value_code": REGION, "language_code": "sw", "label_kind": "preferred", "label": "Mkoa"}],
    )

    features = [{"code": "tz", "feature_type_code": "geo.feature.kind.country", "established_on": "", "from_year": "", "from_to_precision": ""}]
    names = [
        {"feature_code": "tz", "name": "United Republic of Tanzania", "name_kind_code": "geo.name.kind.official", "language_code": "en", "is_default": "true"},
        {"feature_code": "tz", "name": "Tanzania", "name_kind_code": "geo.name.kind.short", "language_code": "en", "is_default": "false"},
        {"feature_code": "tz", "name": "Jamhuri ya Muungano wa Tanzania", "name_kind_code": "geo.name.kind.official", "language_code": "sw", "is_default": "true"},
    ]
    identifiers = [
        {"feature_code": "tz", "identifier_scheme_code": "geo.identifier.scheme.reference-country", "external_id": "tz"},
        {"feature_code": "tz", "identifier_scheme_code": "geo.identifier.scheme.iso-3166-1-alpha2", "external_id": "TZ"},
    ]
    relationships: list[dict[str, str]] = []
    slugs: list[dict[str, str]] = []
    geometries: list[dict[str, str]] = []
    for name, geometry in regions:
        code = f"tz.{slug(name)}"
        features.append({"code": code, "feature_type_code": REGION, "established_on": "", "from_year": ESTABLISHED, "from_to_precision": "exact"})
        names.append({"feature_code": code, "name": name, "name_kind_code": "geo.name.kind.official", "language_code": "en", "is_default": "true"})
        names.append({"feature_code": code, "name": SWAHILI.get(name, name), "name_kind_code": "geo.name.kind.official", "language_code": "sw", "is_default": "true"})
        relationships.append(
            {
                "subject_feature_code": code,
                "object_feature_code": "tz",
                "relationship_kind_code": "geo.relationship.kind.part-of",
                "system_code": "geo.relationship.system.administrative",
                "starts_on": "",
                "from_year": ESTABLISHED,
                "from_to_precision": "exact",
            }
        )
        slugs.append(
            {
                "code": f"tz.slug.place.{slug(name)}",
                "country_code": "tz",
                "namespace_code": "src.slug.namespace.place",
                "slug": slug(name),
                "parent_slug_code": "",
                "language_code": "",
                "subject_table": "geography.features",
                "subject_code": code,
                "from_year": ESTABLISHED,
                "to_year": "",
                "from_to_precision": "exact",
            }
        )
        geometries.append(
            {
                "feature_code": code,
                "geometry_role_code": "geo.geometry.role.outline",
                "basis_code": "geo.geometry.basis.approximate",
                "revision": "1",
                "srid": "4326",
                "geometry": f"SRID=4326;{polygonal(geometry).wkt}",
                "confidence": "0.7",
                "from_year": ESTABLISHED,
                "from_to_precision": "exact",
                "min_zoom": "0",
                "max_zoom": "18",
            }
        )
    write_csv("tz/geo/features.csv", ["code", "feature_type_code", "established_on", "from_year", "from_to_precision"], features)
    write_csv("tz/geo/names.csv", ["feature_code", "name", "name_kind_code", "language_code", "is_default"], names)
    write_csv("tz/geo/identifiers.csv", ["feature_code", "identifier_scheme_code", "external_id"], identifiers)
    write_csv(
        "tz/geo/relationships.csv",
        ["subject_feature_code", "object_feature_code", "relationship_kind_code", "system_code", "starts_on", "from_year", "from_to_precision"],
        relationships,
    )
    write_csv(
        "tz/geo/levels.csv",
        ["code", "country_code", "hierarchy_kind_code", "depth", "feature_kind_code", "is_routing_hierarchy", "root_feature_code"],
        [
            {"code": "tz.level.administrative.0", "country_code": "tz", "hierarchy_kind_code": "geo.hierarchy.kind.administrative", "depth": "0", "feature_kind_code": "geo.feature.kind.country", "is_routing_hierarchy": "true", "root_feature_code": "tz"},
            {"code": "tz.level.administrative.1", "country_code": "tz", "hierarchy_kind_code": "geo.hierarchy.kind.administrative", "depth": "1", "feature_kind_code": REGION, "is_routing_hierarchy": "true", "root_feature_code": "tz"},
        ],
    )
    write_csv(
        "tz/source/slugs.csv",
        ["code", "country_code", "namespace_code", "slug", "parent_slug_code", "language_code", "subject_table", "subject_code", "from_year", "to_year", "from_to_precision"],
        slugs,
    )
    write_csv(
        "tz/geo/dev-boundaries/geometries.csv",
        ["feature_code", "geometry_role_code", "basis_code", "revision", "srid", "geometry", "confidence", "from_year", "from_to_precision", "min_zoom", "max_zoom"],
        geometries,
    )

    # Tanzania has place data now: the country list marks it served. The registered file is copied, never written.
    with (SEED / "data/global/reference/countries.csv").open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        header = list(reader.fieldnames or [])
        rows = [{**row, "is_served": "true" if row["code"] == "tz" else row["is_served"]} for row in reader]
    write_csv("global/reference/countries.csv", header, rows)
    _ = DATA
