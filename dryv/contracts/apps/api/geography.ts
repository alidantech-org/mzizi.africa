/**
 * Module `geography`: places, their parents and children in a hierarchy, prepared outlines for maps and the
 * point-in-place lookup. Full-detail geometries are evidence and are not served to maps.
 */
import * as dryv from "@dryvcode/author";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import {
  Features,
  Geometries,
  geography,
  geographyProperties,
  Outlines,
  Relationships,
} from "#/schemas/postgres/geography.ts";
import { Levels } from "#/schemas/postgres/reference.ts";
import { apiHttp, CACHE, identityRef, MAX_PAGE, namesOf, PageWindow } from "./_shared.ts";

const places = geography.feature("Places").failureDefaults(apiHttp);
const maps = geography.feature("Maps").failureDefaults(apiHttp);
const feature = Features.asRef();
const relationship = Relationships.asRef();
const outline = Outlines.asRef();
const geometryRef = Geometries.asRef();
const level = Levels.asRef();

const mapProperties = geography.properties({
  Longitude: dryv.property.number.double({ range: { min: -180, max: 180 } }),
  Latitude: dryv.property.number.double({ range: { min: -90, max: 90 } }),
});

const FeatureKey = geography.schema("FeatureKey", { code: dryv.field(p.IdentityCode) }).asRef();
const FeatureScope = geography
  .schema("FeatureScope", { featureId: dryv.field(p.Id) })
  .extends(PageWindow)
  .asRef();
const FeatureWindow = geography
  .schema("FeatureWindow", { kindTerm: dryv.field(p.Id).optional(), codePrefix: dryv.field(p.IdentityCode).optional() })
  .extends(PageWindow)
  .asRef();
const ChildWindow = geography
  .schema("ChildWindow", {
    parentId: dryv.field(p.Id),
    hierarchyId: dryv.field(p.Id).optional(),
    levelId: dryv.field(p.Id).optional(),
  })
  .extends(PageWindow)
  .asRef();
const OutlineWindow = geography
  .schema("OutlineWindow", { featureId: dryv.field(p.Id), band: dryv.field(geographyProperties.ZoomBand) })
  .extends(PageWindow)
  .asRef();

const placeColumns = (row: dryv.QueryRow<typeof feature extends dryv.SchemaRef<infer F> ? F : never>) => ({
  featureId: row.fields.id,
  code: row.fields.code,
  identityKind: row.fields.identityKind,
  kindTerm: row.fields.kindTerm,
  fromYear: row.fields.fromYear,
  toYear: row.fields.toYear,
  names: namesOf(row.follow(feature.fields.id, identityRef)),
});

const q = {
  ...places.queries({
    ScanFeatures: dryv.readQuery
      .from(feature)
      .input(FeatureWindow)
      .where((row, args) => [row.fields.kindTerm.eq(args.kindTerm), row.fields.code.compare("prefix", args.codePrefix)])
      .select((row) => placeColumns(row))
      .orderBy((row) => [row.fields.code.order("asc"), row.fields.id.order("asc")])
      .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
    FindFeature: dryv.readQuery
      .from(feature)
      .input(FeatureKey)
      .where((row, args) => [row.fields.code.eq(args.code)])
      .select((row) => ({
        ...placeColumns(row),
        establishedOn: row.fields.establishedOn,
        endedOn: row.fields.endedOn,
        parents: row.reverse(relationship.fields.subjectFeatureId, relationship).select(
          (r) => ({
            parentId: r.fields.objectFeatureId,
            parentCode: r.follow(relationship.fields.objectFeatureId, feature).fields.code,
            kindTerm: r.fields.kindTerm,
            hierarchyId: r.fields.hierarchyId,
            levelId: r.fields.levelId,
            depth: r.follow(relationship.fields.levelId, level).fields.depth,
            fromYear: r.fields.fromYear,
            toYear: r.fields.toYear,
          }),
          (r) => [r.fields.fromYear.order("desc"), r.fields.id.order("asc")],
        ),
      }))
      .orderBy((row) => [row.fields.id.order("asc")])
      .zeroOrOne(),
    ScanChildren: dryv.readQuery
      .from(relationship)
      .input(ChildWindow)
      .where((row, args) => [
        row.fields.objectFeatureId.eq(args.parentId),
        row.fields.hierarchyId.eq(args.hierarchyId),
        row.fields.levelId.eq(args.levelId),
        row.fields.toYear.isNull(),
      ])
      .select((row) => ({
        featureId: row.fields.subjectFeatureId,
        code: row.follow(relationship.fields.subjectFeatureId, feature).fields.code,
        kindTerm: row.follow(relationship.fields.subjectFeatureId, feature).fields.kindTerm,
        levelId: row.fields.levelId,
        hierarchyId: row.fields.hierarchyId,
        names: namesOf(row.follow(relationship.fields.subjectFeatureId, feature).follow(feature.fields.id, identityRef)),
      }))
      .orderBy((row) => [row.fields.subjectFeatureId.order("asc"), row.fields.id.order("asc")])
      .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
  }),
  ...maps.queries({
    ScanOutlines: dryv.readQuery
      .from(outline)
      .input(OutlineWindow)
      .where((row, args) => [row.fields.featureId.eq(args.featureId), row.fields.band.eq(args.band)])
      .select((row) => ({
        featureId: row.fields.featureId,
        geometryId: row.fields.geometryId,
        roleTerm: row.follow(outline.fields.geometryId, geometryRef).fields.roleTerm,
        band: row.fields.band,
        geometry: row.fields.geometry,
        bbox: row.fields.bbox,
        centroid: row.fields.centroid,
        points: row.fields.points,
      }))
      .orderBy((row) => [row.fields.geometryId.order("asc"), row.fields.id.order("asc")])
      .page(({ limit, offset }) => ({ limit, offset, maxLimit: 10 })),
    ScanChildOutlines: dryv.readQuery
      .from(relationship)
      .input(ChildWindow)
      .where((row, args) => [
        row.fields.objectFeatureId.eq(args.parentId),
        row.fields.hierarchyId.eq(args.hierarchyId),
        row.fields.levelId.eq(args.levelId),
        row.fields.toYear.isNull(),
      ])
      .select((row) => ({
        featureId: row.fields.subjectFeatureId,
        code: row.follow(relationship.fields.subjectFeatureId, feature).fields.code,
        outlines: row
          .follow(relationship.fields.subjectFeatureId, feature)
          .reverse(outline.fields.featureId, outline)
          .select(
            (o) => ({ band: o.fields.band, geometry: o.fields.geometry, centroid: o.fields.centroid, bbox: o.fields.bbox }),
            (o) => [o.fields.band.order("asc"), o.fields.id.order("asc")],
          ),
      }))
      .orderBy((row) => [row.fields.subjectFeatureId.order("asc"), row.fields.id.order("asc")])
      .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
  }),
};
export const geographyQueries = q;

const rows = geography.schemas({
  PlaceEntry: dryv.schema.fromQuery(q.ScanFeatures),
  PlaceDetail: dryv.schema.fromQuery(q.FindFeature),
  ChildEntry: dryv.schema.fromQuery(q.ScanChildren),
  OutlineEntry: dryv.schema.fromQuery(q.ScanOutlines),
  ChildOutlineEntry: dryv.schema.fromQuery(q.ScanChildOutlines),
});
export const geographyRows = rows;
const io = geography.schemas({
  PlaceCollection: dryv.schema({ places: dryv.field(rows.PlaceEntry).array() }),
  ChildCollection: dryv.schema({ children: dryv.field(rows.ChildEntry).array() }),
  OutlineCollection: dryv.schema({ outlines: dryv.field(rows.OutlineEntry).array() }),
  ChildOutlineCollection: dryv.schema({ children: dryv.field(rows.ChildOutlineEntry).array() }),
});
const PointQuery = geography
  .schema("PointQuery", {
    longitude: dryv.field(mapProperties.Longitude),
    latitude: dryv.field(mapProperties.Latitude),
  })
  .asRef();
const { PlaceAtPoint } = geography.schemas({
  PlaceAtPoint: dryv.schema({ places: dryv.field(rows.PlaceEntry).array() }),
});

export const geographyOperations = {
  ...places.operations({
    ListPlaces: dryv
      .operation()
      .role("list")
      .description("Places with all their names, optionally of one kind or by code prefix.")
      .input(FeatureWindow)
      .output(io.PlaceCollection)
      .queryFromInput(q.ScanFeatures, { envelope: { places: "rows" } })
      .cache(CACHE.structure)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/geography/places").input(input, dryv.queryObject()).output(output),
      })),
    GetPlace: dryv
      .operation()
      .role("detail")
      .description("One place by code with its dated parent links in every hierarchy.")
      .input(FeatureKey)
      .output(rows.PlaceDetail)
      .queryFromInput(q.FindFeature, { missing: f.NotFound })
      .cache(CACHE.structure)
      .facets(({ inputField, output }) => ({
        http: dryv.http("GET", "/v1/geography/places/{code}").input(inputField("code"), dryv.path()).output(output),
      })),
    ListChildren: dryv
      .operation()
      .role("list")
      .description("The current places directly inside a place, optionally in one hierarchy and at one level.")
      .input(ChildWindow)
      .output(io.ChildCollection)
      .queryFromInput(q.ScanChildren, { envelope: { children: "rows" } })
      .cache(CACHE.structure)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/geography/children").input(input, dryv.queryObject()).output(output),
      })),
    FindPlacesAtPoint: dryv
      .operation()
      .role("search")
      .description('The places whose subdivided pieces contain a point ("where am I?"), smallest first.')
      .input(PointQuery)
      .output(PlaceAtPoint)
      .cache(CACHE.structure)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/geography/at").input(input, dryv.queryObject()).output(output),
      })),
  }),
  ...maps.operations({
    GetOutline: dryv
      .operation()
      .role("detail")
      .description("The prepared outline of a place for one zoom band, with its bounding box and centre.")
      .input(OutlineWindow)
      .output(io.OutlineCollection)
      .queryFromInput(q.ScanOutlines, { envelope: { outlines: "rows" } })
      .cache(CACHE.structure)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/geography/outlines").input(input, dryv.queryObject()).output(output),
      })),
    ListChildOutlines: dryv
      .operation()
      .role("list")
      .description("Prepared outlines of the places inside a place, for drawing a map of its divisions.")
      .input(ChildWindow)
      .output(io.ChildOutlineCollection)
      .queryFromInput(q.ScanChildOutlines, { envelope: { children: "rows" } })
      .cache(CACHE.structure)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/geography/child-outlines").input(input, dryv.queryObject()).output(output),
      })),
  }),
};
