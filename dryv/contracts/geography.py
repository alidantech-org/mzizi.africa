"""Geography: units, jurisdiction-scoped levels, versioned boundaries, name history, lineage.

Pilot domain. Levels are ClassificationRecord rows (scheme "geography/level") scoped by
jurisdiction and period, so no country's hierarchy is baked in. Historical polities that do not
map to a modern state are units whose jurisdiction is a historical jurisdiction record.
Boundary geometry is GeoJSON carried as JSON text; the database engine derives PostGIS columns
(DEC-TYPEORM-POSTGIS-JSONB).
"""

from __future__ import annotations

from dryv_author import body, dryv, failure, field, http, operation, path, port, prop, query, respond, schema, storage

from shared import common, enums, failures, shared, types

geo = dryv.group("Geography").description("Places, boundaries and their changes over time.").facets(
    storage_namespace="geography"
)
feature = geo.feature("Units")

props = geo.properties(
    {
        "GeoJson": prop.string.json(),
        "UnitKind": prop.enum(
            {
                "territorial": "territorial",
                "electoral": "electoral",
                "statistical": "statistical",
                "fiscal": "fiscal",
                "historical_polity": "historical_polity",
            }
        ),
        "ChangeKind": prop.enum(
            {
                "renamed_to": "renamed_to",
                "split_into": "split_into",
                "merged_into": "merged_into",
                "continued_as": "continued_as",
            }
        ),
        "RelationKind": prop.enum(
            {
                "contains": "contains",
                "part_of": "part_of",
                "overlaps": "overlaps",
                "adjacent_to": "adjacent_to",
                "shared": "shared",
            }
        ),
        "SearchText": prop.string().length(min=1, max=120),
    }
)

units = feature.schemas(
    {
        "GeoUnit": schema(
            {
                "id": field(common.Id).system(),
                "code": field(common.BusinessCode),
                "name": field(common.Name),
                "kind": field(props.UnitKind),
                "jurisdictionId": field(common.Id).relation(
                    target=lambda: types.Jurisdiction.field("id"), cardinality="many-to-one", on_delete="restrict"
                ),
                "levelId": field(common.Id).relation(
                    target=lambda: types.ClassificationRecord.field("id"),
                    cardinality="many-to-one",
                    on_delete="restrict",
                ),
                "parentId": field(common.Id).optional(),
                "validFrom": field(common.Date).optional(),
                "validTo": field(common.Date).optional(),
                "isActive": field(common.Flag).default(True),
                "recordedAt": field(common.Instant).system(),
                "version": field(common.Version).default(1),
            }
        )
        .role("entity")
        .facets(storage=storage("geo_units").primary_key("id")),
        "GeoRelationship": schema(
            {
                "id": field(common.Id).system(),
                "parentId": field(common.Id).relation(
                    target=lambda: units.GeoUnit.field("id"), cardinality="many-to-one", on_delete="restrict"
                ),
                "childId": field(common.Id).relation(
                    target=lambda: units.GeoUnit.field("id"), cardinality="many-to-one", on_delete="restrict"
                ),
                "kind": field(props.RelationKind),
                "validFrom": field(common.Date),
                "validTo": field(common.Date).optional(),
                "sourceName": field(common.Name),
                "sourceReference": field(common.Description).optional(),
            }
        )
        .role("entity")
        .facets(storage=storage("geo_relationships").primary_key("id")),
        "GeoBoundaryVersion": schema(
            {
                "id": field(common.Id).system(),
                "unitId": field(common.Id).relation(
                    target=lambda: units.GeoUnit.field("id"), cardinality="many-to-one", on_delete="cascade"
                ),
                "versionNumber": field(common.Version),
                "geometry": field(props.GeoJson),
                "labelPoint": field(props.GeoJson).optional(),
                "sourceName": field(common.Name),
                "sourceReference": field(common.Description).optional(),
                "sourceUrl": field(common.Url).optional(),
                "artifactId": field(common.Id).optional(),
                "licence": field(common.Name),
                "referenceYear": field(common.Version).optional(),
                "retrievedAt": field(common.Instant),
                "method": field(enums.ProvenanceMethod),
                "confidence": field(common.Confidence).optional(),
                "validFrom": field(common.Date).optional(),
                "validTo": field(common.Date).optional(),
                "verificationState": field(enums.VerificationState).default("unverified"),
                "isCurrent": field(common.Flag).default(False),
                "recordedAt": field(common.Instant).system(),
            }
        )
        .role("entity")
        .facets(storage=storage("geo_boundary_versions").primary_key("id")),
        "GeoUnitNameVersion": schema(
            {
                "id": field(common.Id).system(),
                "unitId": field(common.Id).relation(
                    target=lambda: units.GeoUnit.field("id"), cardinality="many-to-one", on_delete="cascade"
                ),
                "name": field(common.Name),
                "language": field(common.Name).optional(),
                "validFrom": field(common.Date).optional(),
                "validTo": field(common.Date).optional(),
                "sourceReference": field(common.Description),
                "method": field(enums.ProvenanceMethod),
            }
        )
        .role("entity")
        .facets(storage=storage("geo_unit_name_versions").primary_key("id")),
        "GeoUnitChange": schema(
            {
                "id": field(common.Id).system(),
                "sourceUnitId": field(common.Id).relation(
                    target=lambda: units.GeoUnit.field("id"), cardinality="many-to-one", on_delete="restrict"
                ),
                "targetUnitId": field(common.Id).relation(
                    target=lambda: units.GeoUnit.field("id"), cardinality="many-to-one", on_delete="restrict"
                ),
                "kind": field(props.ChangeKind),
                "validFrom": field(common.Date).optional(),
                "validTo": field(common.Date).optional(),
                "sourceReference": field(common.Description),
                "method": field(enums.ProvenanceMethod),
            }
        )
        .role("entity")
        .facets(storage=storage("geo_unit_changes").primary_key("id")),
        # Mobile contract entity (.docs/docs/geography-api-contract.md).
        "GeographyEntity": schema(
            {
                "id": field(common.Id),
                "code": field(common.BusinessCode),
                "name": field(common.Name),
                "displayName": field(common.Name),
                "level": field(common.Name),
                "parentId": field(common.Id).optional(),
                "parentName": field(common.Name).optional(),
                "boundaryVerified": field(common.Flag),
                "boundarySource": field(common.Name).optional(),
                "boundarySourceReference": field(common.Description).optional(),
                "boundaryLicense": field(common.Name).optional(),
                "boundaryYear": field(common.Version).optional(),
                "boundaryRetrievedAt": field(common.Instant).optional(),
                "boundaryVersion": field(common.Version).optional(),
                "validFrom": field(common.Date).optional(),
                "validTo": field(common.Date).optional(),
            }
        ).role("response"),
        "GeographySearchResponse": schema({"results": field(lambda: units.GeographyEntity).array()}).role("response"),
        "GeographyFeatureResponse": schema(
            {"geojson": field(props.GeoJson), "boundaryVerified": field(common.Flag)}
        ).role("response"),
    }
)

search = operation().role("list").tags("public").inputs(
    port("q", props.SearchText), port("country", common.JurisdictionCode), port("limit", common.Version)
).outputs(port("results", units.GeographySearchResponse))
search.facets(
    http=http("GET", "/v1/geography/search")
    .input(search.input(0), query("q"))
    .input(search.input(1), query("country"))
    .input(search.input(2), query("limit"))
    .output(search.output(0), respond(200))
)

get_entity = (
    operation().role("detail").tags("public").inputs(port("id", common.Id))
    .outputs(port("entity", units.GeographyEntity)).failures(failures.NotFound)
)
get_entity.facets(
    http=http("GET", "/v1/geography/entities/{id}")
    .input(get_entity.input(0), path("id"))
    .output(get_entity.output(0), respond(200))
    .failure(failures.NotFound, 404)
)

get_boundary = (
    operation().role("detail").tags("public").inputs(port("id", common.Id))
    .outputs(port("boundary", units.GeographyFeatureResponse)).failures(failures.NotFound)
)
get_boundary.facets(
    http=http("GET", "/v1/geography/entities/{id}/boundary")
    .input(get_boundary.input(0), path("id"))
    .output(get_boundary.output(0), respond(200))
    .failure(failures.NotFound, 404)
)

children = (
    operation().role("detail").tags("public").inputs(port("id", common.Id))
    .outputs(port("children", units.GeographyFeatureResponse)).failures(failures.NotFound)
)
children.facets(
    http=http("GET", "/v1/geography/entities/{id}/children/boundaries")
    .input(children.input(0), path("id"))
    .output(children.output(0), respond(200))
    .failure(failures.NotFound, 404)
)

feature.operations(
    {
        "SearchGeography": search,
        "GetGeographyEntity": get_entity,
        "GetGeographyBoundary": get_boundary,
        "GetChildBoundaries": children,
    }
)
