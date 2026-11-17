/**
 * Geography: public reads over features (countries, administrative and historical units, rivers, roads and more).
 *
 * A feature's code, type and names sit in different tables; the queries join them so a client gets one readable
 * feature with all its names.
 */
import * as dryv from "@dryvcode/author";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { Features, geography, Names } from "#/schemas/postgres/geography.ts";
import { apiHttp, MAX_PAGE, PageWindow } from "./_shared.ts";

const places = geography.feature("Places").failureDefaults(apiHttp);
const feature = Features.asRef();
const name = Names.asRef();

/**
 * The feature kinds a feature can have (country, county, river, road, ...): the options of every feature-type filter.
 * A hand-written use case reads them from the reference scheme the `featureTypeId` field is tagged with, because a
 * Dryv query cannot bind a constant parameter (only an operation input or a policy value).
 */
const kindShapes = geography.schemas({
  FeatureKind: dryv.schema({
    // The option tags say which fields an assembler uses as a choice's value and label.
    id: dryv.field(p.Id).tags("option:value"),
    code: dryv.field(p.IdentityCode),
    label: dryv.field(p.Name).tags("option:label"),
  }),
});
const kindIo = geography.schemas({
  FeatureKindCollection: dryv.schema({ kinds: dryv.field(kindShapes.FeatureKind).array() }),
});
const kindOperations = places.operations({
  BrowseFeatureKinds: dryv
    .operation()
    .role("list")
    .description("The kinds a geographic feature can have, in code order, for choosing a feature type.")
    .output(kindIo.FeatureKindCollection)
    .facets(({ output }) => ({
      http: dryv.http("GET", "/v1/geography/feature-kinds").output(output),
    })),
});
/** Choose a feature kind: the options of any field that holds a feature type id. */
const featureKindChoices = { choices: dryv.source.options(kindOperations.BrowseFeatureKinds).output() };

const FeatureWindow = geography
  .schema("FeatureWindow", {
    featureTypeId: dryv.field(p.Id).optional().sources(featureKindChoices),
    codePrefix: dryv.field(p.IdentityCode).optional(),
  })
  .extends(PageWindow)
  .asRef();

const FeatureKey = geography.schema("FeatureKey", { featureId: dryv.field(p.Id) }).asRef();

const drawing = dryv.geometry({ shape: "any", srid: 4326 });
const coordinates = geography.properties({
  Longitude: dryv.property.number.double({ range: { min: -180, max: 180 } }),
  Latitude: dryv.property.number.double({ range: { min: -90, max: 90 } }),
  Tolerance: dryv.property.number.double({ range: { min: 0 } }),
});

/**
 * The visible area and zoom of a map plus the shared page window. The bounds are four plain numbers (west, south,
 * east, north in degrees, SRID 4326): a Dryv read query has no spatial predicate yet, so the operation behind it
 * is a hand-written use case over the generated repository.
 */
const GeometryWindow = geography
  .schema("GeometryWindow", {
    west: dryv.field(coordinates.Longitude),
    south: dryv.field(coordinates.Latitude),
    east: dryv.field(coordinates.Longitude),
    north: dryv.field(coordinates.Latitude),
    zoom: dryv.field(p.NonNegativeInteger),
    featureTypeId: dryv.field(p.Id).optional().sources(featureKindChoices),
    simplifyTolerance: dryv.field(coordinates.Tolerance).optional(),
  })
  .extends(PageWindow)
  .asRef();

/** One current drawing of a feature with the evidence that travels with it. */
const geometries = geography.schemas({
  FeatureGeometry: dryv.schema({
    geometryId: dryv.field(p.Id),
    featureId: dryv.field(p.Id),
    geometryRoleId: dryv.field(p.Id),
    basisId: dryv.field(p.Id),
    revision: dryv.field(p.PositiveInteger),
    confidence: dryv.field(p.Confidence).maybe(),
    minZoom: dryv.field(p.NonNegativeInteger).maybe(),
    maxZoom: dryv.field(p.NonNegativeInteger).maybe(),
    geometry: dryv.field(drawing),
    centroid: dryv.field(dryv.geometry({ shape: "point", srid: 4326 })),
    validFrom: dryv.field(p.Instant),
    observedAt: dryv.field(p.Instant).maybe(),
  }),
});
const geometryIo = geography.schemas({
  FeatureGeometryCollection: dryv.schema({ geometries: dryv.field(geometries.FeatureGeometry).array() }),
});

const { ScanFeatures, FindFeature } = places.queries({
  ScanFeatures: dryv.readQuery
    .from(feature)
    .input(FeatureWindow)
    .where((row, args) => [
      row.fields.featureTypeId.eq(args.featureTypeId),
      row.fields.code.compare("prefix", args.codePrefix),
    ])
    .select((row) => ({
      featureId: row.fields.id,
      code: row.fields.code,
      featureTypeId: row.fields.featureTypeId,
      validFrom: row.fields.validFrom,
      validUntil: row.fields.validUntil,
      names: row.reverse(name.fields.featureId, name).select(
        (n) => ({ name: n.fields.name, languageTag: n.fields.languageTag }),
        (n) => [n.fields.name.order("asc"), n.fields.id.order("asc")],
      ),
    }))
    .orderBy((row) => [row.fields.code.order("asc"), row.fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),

  FindFeature: dryv.readQuery
    .from(feature)
    .input(FeatureKey)
    .where((row, args) => [row.fields.id.eq(args.featureId)])
    .select((row) => ({
      featureId: row.fields.id,
      code: row.fields.code,
      featureTypeId: row.fields.featureTypeId,
      validFrom: row.fields.validFrom,
      validUntil: row.fields.validUntil,
      names: row.reverse(name.fields.featureId, name).select(
        (n) => ({ name: n.fields.name, languageTag: n.fields.languageTag }),
        (n) => [n.fields.name.order("asc"), n.fields.id.order("asc")],
      ),
    }))
    .orderBy(({ fields }) => [fields.id.order("asc")])
    .zeroOrOne(),
});

const rows = places.schemas({
  FeatureEntry: dryv.schema.fromQuery(ScanFeatures),
  FeatureDetail: dryv.schema.fromQuery(FindFeature),
});
const io = places.schemas({
  FeatureCollection: dryv.schema({ features: dryv.field(rows.FeatureEntry).array() }),
});

export const geographyOperations = {
  ...kindOperations,
  ...places.operations({
    BrowseFeatures: dryv
      .operation()
      .role("list")
      .description("Browse geographic features with their names, optionally of one type or by code prefix.")
      .input(FeatureWindow)
      .output(io.FeatureCollection)
      .queryFromInput(ScanFeatures, { envelope: { features: "rows" } })
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/geography/features").input(input, dryv.queryObject()).output(output),
      })),

    GetFeature: dryv
      .operation()
      .role("detail")
      .description("One geographic feature with its names.")
      .input(FeatureKey)
      .output(rows.FeatureDetail)
      .queryFromInput(FindFeature, { missing: f.NotFound })
      .facets(({ inputField, output }) => ({
        http: dryv
          .http("GET", "/v1/geography/features/{featureId}")
          .input(inputField("featureId"), dryv.path())
          .output(output),
      })),

    ListFeatureGeometries: dryv
      .operation()
      .role("list")
      .description(
        "The current drawings of one feature, each with its role, basis, revision, confidence, zoom range and validity. A feature with no drawing returns an empty list.",
      )
      .input(FeatureKey)
      .output(geometryIo.FeatureGeometryCollection)
      .facets(({ inputField, output }) => ({
        http: dryv
          .http("GET", "/v1/geography/features/{featureId}/geometries")
          .input(inputField("featureId"), dryv.path())
          .output(output),
      })),

    BrowseGeometries: dryv
      .operation()
      .role("search")
      .description(
        "The current drawings whose envelope meets a map's bounds and whose zoom range includes the zoom, optionally of one feature type and simplified to a tolerance.",
      )
      .input(GeometryWindow)
      .output(geometryIo.FeatureGeometryCollection)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/geography/geometries").input(input, dryv.queryObject()).output(output),
      })),
  }),
};
