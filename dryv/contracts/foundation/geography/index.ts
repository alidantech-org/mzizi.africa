import * as dryv from "@dryvcode/author";

import { referenceSchemas } from "../reference/index.ts";
import { historicalEntitySchemas, sharedFailures, sharedProperties } from "../shared/index.ts";

/* -------------------------------------------------------------------------- */
/* Domain                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Geography: units, jurisdiction-scoped levels, versioned boundaries, name history and lineage.
 *
 * Levels are ClassificationRecord rows (scheme geography/level), so no country's hierarchy is baked
 * in. A historical polity that does not map to a modern state is a unit whose jurisdiction is a
 * historical jurisdiction. Geometry is GeoJSON carried as text; the database engine derives PostGIS
 * columns (DEC-TYPEORM-POSTGIS-JSONB).
 */
export const geography = dryv
  .group({ name: "geography" })
  .description("Places, boundaries and their changes over time.")
  .tags("public", "geography")
  .facets({ storage: { namespace: "geography" } });

export const geographyProperties = geography.properties({
  GeoJson: dryv.property.string().length({ min: 2 }),
  UnitKind: dryv.property.enum({
    territorial: "territorial",
    electoral: "electoral",
    statistical: "statistical",
    fiscal: "fiscal",
    historicalPolity: "historical_polity",
  }),
  RelationKind: dryv.property.enum({
    contains: "contains",
    partOf: "part_of",
    overlaps: "overlaps",
    adjacentTo: "adjacent_to",
    shared: "shared",
  }),
  ChangeKind: dryv.property.enum({
    renamedTo: "renamed_to",
    splitInto: "split_into",
    mergedInto: "merged_into",
    continuedAs: "continued_as",
  }),
  SearchText: dryv.property.string().length({ min: 1, max: 120 }),
  CountryFilter: dryv.property.string().length({ min: 2, max: 40 }),
  ResultLimit: dryv.property.number.integer({ range: { min: 1, max: 50 } }),
  LanguageTag: dryv.property.string().length({ min: 2, max: 35 }),
});

/* -------------------------------------------------------------------------- */
/* Persistent schemas                                                     */
/* -------------------------------------------------------------------------- */

const geoOwnedSchemas = geography.schemas({
  GeoUnit: dryv
    .schema({
      code: dryv.field(sharedProperties.BusinessCode).query({ filter: ["equal", "startsWith"], sort: true, search: true }),
      name: dryv.field(sharedProperties.Name).query({ filter: ["startsWith", "contains"], sort: true, search: true }),
      kind: dryv.field(geographyProperties.UnitKind).query({ filter: ["equal", "in"] }),
      // Other schemas are referenced by plain id: no foreign key crosses a schema (DATABASE_DESIGN.md).
      jurisdictionId: dryv.field(sharedProperties.Id).query({ filter: ["equal"] }),
      levelId: dryv.field(sharedProperties.Id).query({ filter: ["equal"] }),
      parentId: dryv.field(sharedProperties.Id).optional().nullable().query({ filter: ["equal"], sort: true }),
      isActive: dryv.field(sharedProperties.Flag).query({ filter: ["equal"] }),
      wikidataId: dryv.field(sharedProperties.WikidataId).optional().nullable().query({ filter: ["equal"] }),
      flagMarker: dryv.field(sharedProperties.MediaMarker).optional().nullable().query({ filter: ["equal"] }),
      emblemMarker: dryv.field(sharedProperties.MediaMarker).optional().nullable().query({ filter: ["equal"] }),
    })
    .role("entity")
    .extends(historicalEntitySchemas.HistoricalEntity)
    .facets({
      storage: dryv.storage("units").indexes(
        { name: "idx_geo_unit_code", fields: ["code"], unique: true },
        { name: "idx_geo_unit_parent", fields: ["parentId"] },
        { name: "idx_geo_unit_jurisdiction_level", fields: ["jurisdictionId", "levelId"] },
      ),
    }),
});

/** Registry so later schemas can point at GeoUnit without a circular reference. */
export const geographySchemas = geography.schemas({
  GeoRelationship: dryv
    .schema({
      parentId: dryv
        .field(sharedProperties.Id)
        .query({ filter: ["equal"] })
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => geoOwnedSchemas.GeoUnit.field("id"),
          cardinality: dryv.relation.manyToOne(),
        }),
      // The pack names relation properties after the target, so a second relation to GeoUnit stays a plain id.
      childId: dryv.field(sharedProperties.Id).query({ filter: ["equal"] }),
      kind: dryv.field(geographyProperties.RelationKind).query({ filter: ["equal", "in"] }),
    })
    .role("entity")
    .extends(historicalEntitySchemas.HistoricalEntity)
    .facets({ storage: dryv.storage("relationships").indexes({ name: "idx_geo_relationship_parent", fields: ["parentId"] }) }),

  GeoBoundaryVersion: dryv
    .schema({
      unitId: dryv
        .field(sharedProperties.Id)
        .query({ filter: ["equal"] })
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => geoOwnedSchemas.GeoUnit.field("id"),
          cardinality: dryv.relation.manyToOne(),
        }),
      versionNumber: dryv.field(sharedProperties.Version).query({ filter: ["equal", "between"], sort: true }),
      geometry: dryv.field(geographyProperties.GeoJson).query({ select: "never" }),
      labelPoint: dryv.field(geographyProperties.GeoJson).optional().nullable().query({ select: "never" }),
      referenceYear: dryv.field(sharedProperties.Version).optional().nullable(),
    })
    .role("entity")
    .extends(historicalEntitySchemas.HistoricalEntity)
    .facets({
      storage: dryv.storage("boundaries").indexes(
        { name: "idx_geo_boundary_unit_current", fields: ["unitId", "isCurrent"] },
        { name: "uq_geo_boundary_unit_version", fields: ["unitId", "versionNumber"], unique: true },
      ),
    }),

  GeoUnitNameVersion: dryv
    .schema({
      unitId: dryv
        .field(sharedProperties.Id)
        .query({ filter: ["equal"] })
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => geoOwnedSchemas.GeoUnit.field("id"),
          cardinality: dryv.relation.manyToOne(),
        }),
      name: dryv.field(sharedProperties.Name).query({ filter: ["contains"], search: true }),
      language: dryv.field(geographyProperties.LanguageTag).optional().nullable(),
    })
    .role("entity")
    .extends(historicalEntitySchemas.HistoricalEntity)
    .facets({ storage: dryv.storage("names").indexes({ name: "idx_geo_name_unit", fields: ["unitId"] }) }),

  GeoUnitChange: dryv
    .schema({
      sourceUnitId: dryv
        .field(sharedProperties.Id)
        .query({ filter: ["equal"] })
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => geoOwnedSchemas.GeoUnit.field("id"),
          cardinality: dryv.relation.manyToOne(),
        }),
      targetUnitId: dryv.field(sharedProperties.Id).query({ filter: ["equal"] }),
      kind: dryv.field(geographyProperties.ChangeKind).query({ filter: ["equal", "in"] }),
    })
    .role("entity")
    .extends(historicalEntitySchemas.HistoricalEntity)
    .facets({ storage: dryv.storage("changes").indexes({ name: "idx_geo_change_source", fields: ["sourceUnitId"] }) }),
});

export const geographyEntitySchemas = { ...geoOwnedSchemas, ...geographySchemas } as const;

/* -------------------------------------------------------------------------- */
/* Read contracts (mobile geography contract, docs/geography-api-contract.md) */
/* -------------------------------------------------------------------------- */

export const geographyQuerySchemas = geography.schemas({
  GeographySearchQuery: dryv.schema({
    q: dryv.field(geographyProperties.SearchText),
    country: dryv.field(geographyProperties.CountryFilter).optional(),
    limit: dryv.field(geographyProperties.ResultLimit).optional(),
  }),
});

export const geographyResponseSchemas = geography.schemas({
  GeographyEntity: dryv.schema({
    id: dryv.field(sharedProperties.Id),
    code: dryv.field(sharedProperties.BusinessCode),
    name: dryv.field(sharedProperties.Name),
    displayName: dryv.field(sharedProperties.Name),
    level: dryv.field(sharedProperties.Name),
    parentId: dryv.field(sharedProperties.Id).optional().nullable(),
    parentName: dryv.field(sharedProperties.Name).optional().nullable(),
    boundaryVerified: dryv.field(sharedProperties.Flag),
    boundarySource: dryv.field(sharedProperties.Name).optional().nullable(),
    boundarySourceReference: dryv.field(sharedProperties.Description).optional().nullable(),
    boundaryLicense: dryv.field(sharedProperties.Name).optional().nullable(),
    boundaryYear: dryv.field(sharedProperties.Version).optional().nullable(),
    boundaryRetrievedAt: dryv.field(sharedProperties.DateTime).optional().nullable(),
    boundaryVersion: dryv.field(sharedProperties.Version).optional().nullable(),
    validFrom: dryv.field(sharedProperties.Date).optional().nullable(),
    validTo: dryv.field(sharedProperties.Date).optional().nullable(),
  }),
});

/** Projections keep API shapes separate from persistence so private fields never leak by default. */
export const geographyProjectionSchemas = geography.schemas({
  GeoUnitPublic: dryv.schema({}).projection(dryv.projection(geoOwnedSchemas.GeoUnit).read()),
});

export const geographyHistoryProjections = geography.schemas({
  GeoUnitNameVersionPublic: dryv.schema({}).projection(dryv.projection(geographySchemas.GeoUnitNameVersion).read()),
  GeoUnitChangePublic: dryv.schema({}).projection(dryv.projection(geographySchemas.GeoUnitChange).read()),
});

export const geographyBoundariesQuerySchemas = geography.schemas({
  GeographyBoundariesQuery: dryv.schema({
    country: dryv.field(geographyProperties.CountryFilter),
    level: dryv.field(sharedProperties.Label),
  }),
});

export const geographyCollectionSchemas = geography.schemas({
  /** Immediate neighbours of an entity: its ancestors (root first) and children. */
  GeographyHierarchyResponse: dryv.schema({
    entity: dryv.field(geographyResponseSchemas.GeographyEntity),
    ancestors: dryv.field(geographyResponseSchemas.GeographyEntity).array(),
    children: dryv.field(geographyResponseSchemas.GeographyEntity).array(),
  }),

  /** Parent outline and sibling boundaries for map context; verified boundaries only. */
  GeographyMapContextResponse: dryv.schema({
    parentGeojson: dryv.field(geographyProperties.GeoJson).optional().nullable(),
    siblingsGeojson: dryv.field(geographyProperties.GeoJson),
  }),

  GeographyHistoryResponse: dryv.schema({
    names: dryv.field(geographyHistoryProjections.GeoUnitNameVersionPublic).array(),
    changes: dryv.field(geographyHistoryProjections.GeoUnitChangePublic).array(),
  }),

  GeoUnitResponse: dryv.schema({
    unit: dryv.field(geographyProjectionSchemas.GeoUnitPublic),
  }),

  GeographySearchResponse: dryv.schema({
    results: dryv.field(geographyResponseSchemas.GeographyEntity).array(),
  }),

  /** GeoJSON Feature or FeatureCollection as text; verified boundaries only. */
  GeographyFeatureResponse: dryv.schema({
    geojson: dryv.field(geographyProperties.GeoJson),
    boundaryVerified: dryv.field(sharedProperties.Flag),
  }),
});

/* -------------------------------------------------------------------------- */
/* Read operations                                                        */
/* -------------------------------------------------------------------------- */

const standardFailures = [sharedFailures.BadRequest, sharedFailures.NotFound, sharedFailures.ValidationError, sharedFailures.InternalError] as const;

function withStandardHttpFailures(exposure: ReturnType<typeof dryv.http>) {
  return exposure
    .failure(sharedFailures.BadRequest, 400)
    .failure(sharedFailures.NotFound, 404)
    .failure(sharedFailures.ValidationError, 422)
    .failure(sharedFailures.InternalError, 500);
}

const geographyRead = geography
  .feature("GeographyRead")
  .description("Public read access to places, boundaries and their provenance.")
  .tags("public", "mobile");

const SearchGeography = dryv
  .operation()
  .description("Search administrative entities.")
  .input(geographyQuerySchemas.GeographySearchQuery)
  .output(geographyCollectionSchemas.GeographySearchResponse)
  .failures(...standardFailures);

SearchGeography.facets({
  http: withStandardHttpFailures(
    dryv
      .http("GET", "/v1/geography/search")
      .description("Search geography.")
      .input(SearchGeography.in, dryv.queryObject())
      .output(SearchGeography.out, dryv.respond(200)),
  ),
});

const GetGeographyEntity = dryv
  .operation()
  .description("Resolve a canonical geography id and its metadata.")
  .input({ entityId: sharedProperties.Id })
  .output(geographyResponseSchemas.GeographyEntity)
  .failures(...standardFailures);

GetGeographyEntity.facets({
  http: withStandardHttpFailures(
    dryv
      .http("GET", "/v1/geography/entities/{entityId}")
      .description("Get geography entity.")
      .input(GetGeographyEntity.in.entityId, dryv.path())
      .output(GetGeographyEntity.out, dryv.respond(200)),
  ),
});

const GetGeographyBoundary = dryv
  .operation()
  .description("Return the verified geometry for an entity.")
  .input({ entityId: sharedProperties.Id })
  .output(geographyCollectionSchemas.GeographyFeatureResponse)
  .failures(...standardFailures);

GetGeographyBoundary.facets({
  http: withStandardHttpFailures(
    dryv
      .http("GET", "/v1/geography/entities/{entityId}/boundary")
      .description("Get verified boundary.")
      .input(GetGeographyBoundary.in.entityId, dryv.path())
      .output(GetGeographyBoundary.out, dryv.respond(200)),
  ),
});

const GetChildBoundaries = dryv
  .operation()
  .description("Return the immediate child boundaries as GeoJSON.")
  .input({ entityId: sharedProperties.Id })
  .output(geographyCollectionSchemas.GeographyFeatureResponse)
  .failures(...standardFailures);

GetChildBoundaries.facets({
  http: withStandardHttpFailures(
    dryv
      .http("GET", "/v1/geography/entities/{entityId}/children/boundaries")
      .description("Get child boundaries.")
      .input(GetChildBoundaries.in.entityId, dryv.path())
      .output(GetChildBoundaries.out, dryv.respond(200)),
  ),
});

const ListBoundariesByLevel = dryv
  .operation()
  .description("Verified outlines of every unit at a level within a country.")
  .input(geographyBoundariesQuerySchemas.GeographyBoundariesQuery)
  .output(geographyCollectionSchemas.GeographyFeatureResponse)
  .failures(...standardFailures);

ListBoundariesByLevel.facets({
  http: withStandardHttpFailures(
    dryv
      .http("GET", "/v1/geography/boundaries")
      .description("List boundaries by level.")
      .input(ListBoundariesByLevel.in, dryv.queryObject())
      .output(ListBoundariesByLevel.out, dryv.respond(200)),
  ),
});

const GetGeographyHierarchy = dryv
  .operation()
  .description("Ancestors and children of an entity.")
  .input({ entityId: sharedProperties.Id })
  .output(geographyCollectionSchemas.GeographyHierarchyResponse)
  .failures(...standardFailures);

GetGeographyHierarchy.facets({
  http: withStandardHttpFailures(
    dryv
      .http("GET", "/v1/geography/entities/{entityId}/hierarchy")
      .description("Get hierarchy.")
      .input(GetGeographyHierarchy.in.entityId, dryv.path())
      .output(GetGeographyHierarchy.out, dryv.respond(200)),
  ),
});

const GetGeographyMapContext = dryv
  .operation()
  .description("Parent outline and sibling boundaries for map context.")
  .input({ entityId: sharedProperties.Id })
  .output(geographyCollectionSchemas.GeographyMapContextResponse)
  .failures(...standardFailures);

GetGeographyMapContext.facets({
  http: withStandardHttpFailures(
    dryv
      .http("GET", "/v1/geography/entities/{entityId}/map-context")
      .description("Get map context.")
      .input(GetGeographyMapContext.in.entityId, dryv.path())
      .output(GetGeographyMapContext.out, dryv.respond(200)),
  ),
});

const GetGeographyHistory = dryv
  .operation()
  .description("Historical names and lineage of an entity.")
  .input({ entityId: sharedProperties.Id })
  .output(geographyCollectionSchemas.GeographyHistoryResponse)
  .failures(...standardFailures);

GetGeographyHistory.facets({
  http: withStandardHttpFailures(
    dryv
      .http("GET", "/v1/geography/entities/{entityId}/history")
      .description("Get history.")
      .input(GetGeographyHistory.in.entityId, dryv.path())
      .output(GetGeographyHistory.out, dryv.respond(200)),
  ),
});

const GetGeoUnitById = dryv
  .operation()
  .description("Get a geography unit record with its evidence fields.")
  .input({ unitId: sharedProperties.Id })
  .output(geographyCollectionSchemas.GeoUnitResponse)
  .failures(...standardFailures);

GetGeoUnitById.facets({
  http: withStandardHttpFailures(
    dryv
      .http("GET", "/v1/geography/units/{unitId}")
      .description("Get geography unit by ID.")
      .input(GetGeoUnitById.in.unitId, dryv.path())
      .output(GetGeoUnitById.out, dryv.respond(200)),
  ),
});

export const geographyReadOperations = geographyRead.operations({
  ListBoundariesByLevel,
  GetGeographyHierarchy,
  GetGeographyMapContext,
  GetGeographyHistory,
  GetGeoUnitById,
  SearchGeography,
  GetGeographyEntity,
  GetGeographyBoundary,
  GetChildBoundaries,
});
