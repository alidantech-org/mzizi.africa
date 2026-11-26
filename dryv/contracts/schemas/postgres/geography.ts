/**
 * Schema: geography | Database: mzizi
 * Design: .docs/design/data/FOUNDATION_REDESIGN.md sections 6, 20 and 22.2 (approved 2026-11-25).
 * Contract authors: every geometry is EPSG:4326 and the full-detail drawing is evidence that is never altered; maps read
 * prepared `outlines` and `pieces`. Membership of a hierarchy (parent and rank) is `areas`; `relationships` holds the other links.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { enums } from "#/schemas/_enums.ts";
import { periodFields } from "#/schemas/_periods.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { templateFields } from "#/schemas/_templates.ts";
import { belongsTo, identityKindField, identityReference, term } from "./_links.ts";
import { Versions } from "./filesystem.ts";
import { Occurrences } from "./history.ts";
import { Hierarchies, Languages, Levels } from "./reference.ts";

export const geography = dryv
  .group({ name: "geography" })
  .description(
    "Places and their drawings: features, geometries, prepared outlines and pieces, relationships, changes and GIS assets.",
  )
  .facets({ storage: { namespace: "geography", store: "main" } });

const geometry = (shape: dryv.GeometryShape) => dryv.geometry({ shape, srid: 4326 });
export const geographyProperties = geography.properties({
  GeometryArea: dryv.property.number.double(),
  ZoomBand: dryv.property.number.integer({ range: { min: 0, max: 3 } }),
  Tolerance: dryv.property.number.double(),
  Layer: dryv.property.string().length({ min: 1, max: 255 }),
  Member: dryv.property.string().length({ min: 1, max: 1000 }),
  Note: dryv.property.string().length({ min: 1, max: 4000 }),
  GeometryStatus: dryv.property.enum({ Expected: "expected", Draft: "draft", Established: "established" }),
});
const calculations = geography.expressions({
  GeometryEnvelope: dryv.expression.spatial.envelope("geometry"),
  GeometryCentroid: dryv.expression.spatial.centroid("geometry"),
  GeometryArea: dryv.expression.spatial.area("geometry"),
});

/*---------------- geography.features ----------------*/
export const Features = geography
  .schema("Features", {
    identityKind: identityKindField("feature"),
    kindTerm: term("geo.feature.kind", "What the place is: country, county, ward, river, lake, road."),
    ...periodFields,
    establishedOn: dryv.field(sharedProperties.CalendarDate).maybe().description("Exact date the place came into being."),
    endedOn: dryv.field(sharedProperties.CalendarDate).maybe().description("Exact date the place ceased to exist."),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("FeatureKind", (v) => v.identityKind.in(["feature", "country"]))
  .rule("FeaturePeriodIsOrdered", rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .rule("FeatureDatesAreOrdered", rule.ordered("establishedOn", "endedOn", { allowEqual: true }))
  .description(
    "The one identity of every place, natural or administrative. A country's feature shares the country's identity; parents and ranks are dated relationships, never columns here.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("features")
      .index("kindTerm")
      .index("fromYear", "toYear")
      .references("FeatureIsIdentity", identityReference),
  });

/*---------------- geography.geometries ----------------*/
export const Geometries = geography
  .schema("Geometries", {
    featureId: belongsTo(() => Features),
    role: dryv.field(enums.GeometryRole).description("outline, point or centreline."),
    basis: dryv
      .field(enums.GeometryBasis)
      .description("surveyed, digitised or derived; empty while the drawing is only expected.")
      .maybe(),
    status: dryv
      .field(geographyProperties.GeometryStatus)
      .default("established")
      .description(
        "expected: the row exists but no drawing is loaded yet; draft: a provisional drawing; established: the official boundary. An area's boundary status is read from here.",
      ),
    revision: dryv
      .field(sharedProperties.PositiveInteger)
      .description("1 for the first drawing of this role, rising with each new drawing."),
    supersedesId: belongsTo(dryv.self).maybe().description("The drawing this one replaces; earlier drawings are kept."),
    confidence: dryv.field(sharedProperties.Confidence).maybe().description("How far to trust the drawing, 0 to 1."),
    geometry: dryv
      .field(geometry("any"))
      .maybe()
      .description("Full-detail drawing in EPSG:4326, never altered; empty while the drawing is only expected."),
    envelope: dryv.field(geometry("any")).maybe().generated(calculations.GeometryEnvelope),
    centroid: dryv.field(geometry("point")).maybe().generated(calculations.GeometryCentroid),
    area: dryv.field(geographyProperties.GeometryArea).maybe().generated(calculations.GeometryArea),
    ...periodFields,
  })
  .extends(baseSchemas.Entity)
  .rule("GeometryIsNotItsOwnSuccessor", rule.differs("id", "supersedesId"))
  .description(
    "One full-detail drawing of a feature with its role, basis and revision. The current drawing has no end year.",
  )
  .role("entity");

const currentGeometry = geography.expression(
  "CurrentGeometry",
  Geometries.check((row) => row.toYear.isNull().and(row.deletedAt.isNull())),
);
Geometries.facets({
  storage: dryv
    .storage("geometries")
    .indexes(
      { fields: ["featureId", "role", "revision"], unique: true },
      {
        description: "One current drawing per feature and role.",
        fields: ["featureId", "role"],
        unique: true,
        where: currentGeometry,
      },
      { fields: ["id", "featureId"], unique: true },
      { fields: ["geometry"], method: "gist" },
    )
    .index("basis"),
});

/*---------------- geography.areas ----------------*/
export const Areas = geography
  .schema("Areas", {
    hierarchyId: belongsTo(() => Hierarchies).description(
      "The administrative, electoral or other hierarchy this area belongs to.",
    ),
    levelId: belongsTo(() => Levels).description("The level of the hierarchy this area is (county, constituency, ward)."),
    featureId: belongsTo(() => Features).description(
      "The place this area is. Never empty: generation creates the feature, then an empty geometry, then the area; details are filled in later.",
    ),
    parentId: belongsTo(dryv.self)
      .maybe()
      .description(
        "The area one level up in the same hierarchy; empty for the top area (the country). Membership lives here, not in `geography.relationships`.",
      ),
    ...templateFields("area"),
  })
  .extends(baseSchemas.CodedPeriodEntity)
  .rule("AreaIsNotItsOwnParent", rule.differs("id", "parentId"))
  .description(
    "One official place in one hierarchy at one level for a period: the unit patterns fan out over and offices, jurisdictions and templates point at. Geography details are found through the feature's identity; boundary status is read from the feature's geometry.",
  )
  .role("entity");

const startedArea = geography.expression(
  "StartedArea",
  Areas.check((v) => v.fromYear.isNotNull()),
);
const undatedArea = geography.expression(
  "UndatedArea",
  Areas.check((v) => v.fromYear.isNull()),
);
Areas.facets({
  storage: dryv
    .storage("areas")
    .indexes(
      {
        description: "A place is one area per hierarchy and start year.",
        fields: ["hierarchyId", "featureId", "fromYear"],
        unique: true,
        where: startedArea,
      },
      {
        description: "A place is one area per hierarchy when no start year is known.",
        fields: ["hierarchyId", "featureId"],
        unique: true,
        where: undatedArea,
      },
    )
    .index("featureId")
    .index("parentId")
    .index("levelId")
    .index("templateId")
    .acyclic("AreaParentsHaveNoCycle", { field: "parentId" })
    .references("AreaLevelIsInHierarchy", {
      fields: ["levelId", "hierarchyId"],
      target: () => Levels,
      targetFields: ["id", "hierarchyId"],
    })
    .references("AreaParentIsInHierarchy", {
      fields: ["parentId", "hierarchyId"],
      target: () => Areas,
      targetFields: ["id", "hierarchyId"],
    }),
});

/*---------------- geography.outlines ----------------*/
export const Outlines = geography
  .schema("Outlines", {
    featureId: belongsTo(() => Features, { onDelete: "cascade" }),
    geometryId: belongsTo(() => Geometries, { onDelete: "cascade" }),
    band: dryv.field(geographyProperties.ZoomBand).description("Zoom band 0–3 the outline is simplified for."),
    tolerance: dryv.field(geographyProperties.Tolerance).description("Simplification tolerance in degrees."),
    geometry: dryv
      .field(geometry("any"))
      .description("Simplified outline; neighbours are simplified together as one topology."),
    bbox: dryv.field(geometry("polygon")).description("Bounding box, so a map can frame the place without its geometry."),
    centroid: dryv.field(geometry("point")).description("Centre point for labels and framing."),
    points: dryv.field(sharedProperties.NonNegativeInteger).description("Number of vertices, for payload budgets."),
    builtAt: dryv.field(sharedProperties.Instant),
  })
  .extends(baseSchemas.Association)
  .description("A prepared, simplified outline of a geometry for one zoom band; rebuilt when its geometry changes.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("outlines")
      .indexes({ fields: ["geometry"], method: "gist" })
      .unique("geometryId", "band")
      .index("featureId", "band")
      .references("OutlineGeometryOfFeature", {
        fields: ["geometryId", "featureId"],
        target: () => Geometries,
        targetFields: ["id", "featureId"],
      }),
  });

/*---------------- geography.pieces ----------------*/
export const Pieces = geography
  .schema("Pieces", {
    featureId: belongsTo(() => Features, { onDelete: "cascade" }),
    geometryId: belongsTo(() => Geometries, { onDelete: "cascade" }),
    geometry: dryv.field(geometry("polygon")).description("One small piece of the polygon cut with ST_Subdivide."),
  })
  .extends(baseSchemas.Association)
  .description('Subdivided polygons with a spatial index, so "where am I?" lookups stay fast even for long coastlines.')
  .role("entity")
  .facets({
    storage: dryv
      .storage("pieces")
      .indexes({ fields: ["geometry"], method: "gist" })
      .index("featureId")
      .index("geometryId"),
  });

/*---------------- geography.relationships ----------------*/
export const Relationships = geography
  .schema("Relationships", {
    subjectFeatureId: belongsTo(() => Features).description("The inner or first place (Nairobi)."),
    objectFeatureId: belongsTo(() => Features).description("The outer or second place (Kenya)."),
    kind: dryv.field(enums.PlaceRelation).description("inside, borders or part of."),
    ...periodFields,
    startsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    endsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.Entity)
  .rule("RelationshipPeriodIsOrdered", rule.ordered("fromYear", "toYear", { allowEqual: true }))
  .rule("RelationshipDatesAreOrdered", rule.ordered("startsOn", "endsOn", { allowEqual: true }))
  .rule("RelationshipIsNotSelf", rule.differs("subjectFeatureId", "objectFeatureId"))
  .description(
    "A dated link between places that is not membership of an administrative or electoral hierarchy (a lake inside a county, two wards that border). Hierarchy membership is `geography.areas`.",
  )
  .role("entity");

const startedRelationship = geography.expression(
  "StartedRelationship",
  Relationships.check((v) => v.fromYear.isNotNull()),
);
const undatedRelationship = geography.expression(
  "UndatedRelationship",
  Relationships.check((v) => v.fromYear.isNull()),
);
Relationships.facets({
  storage: dryv
    .storage("relationships")
    .indexes(
      {
        description: "One link per pair, kind and start year.",
        fields: ["subjectFeatureId", "objectFeatureId", "kind", "fromYear"],
        unique: true,
        where: startedRelationship,
      },
      {
        description: "One link per pair and kind when no start year is known.",
        fields: ["subjectFeatureId", "objectFeatureId", "kind"],
        unique: true,
        where: undatedRelationship,
      },
    )
    .index("subjectFeatureId", "kind")
    .index("objectFeatureId", "kind")
    .index("fromYear", "toYear"),
});

/*---------------- geography.changes ----------------*/
export const Changes = geography
  .schema("Changes", {
    occurrenceId: belongsTo(() => Occurrences)
      .maybe()
      .description("The historical reform behind the change (Kenya's 2013 devolution)."),
    predecessorFeatureId: belongsTo(() => Features).maybe(),
    successorFeatureId: belongsTo(() => Features).maybe(),
    kind: dryv.field(enums.PlaceChange).description("split, merge, rename or transfer."),
    effectiveOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    note: dryv.field(geographyProperties.Note).maybe().description("Optional explanation, in `note_language_id`."),
    noteLanguageId: belongsTo(() => Languages).maybe(),
  })
  .extends(baseSchemas.Entity)
  .rule("ChangeHasAPlace", (v) => v.predecessorFeatureId.isNotNull().or(v.successorFeatureId.isNotNull()))
  .rule("ChangeNoteHasLanguage", (v) => v.note.isNull().or(v.noteLanguageId.isNotNull()))
  .description("One edge of a boundary change: splits, merges, creation or dissolution, without overwriting the places.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("changes")
      .unique("occurrenceId", "predecessorFeatureId", "successorFeatureId")
      .index("predecessorFeatureId")
      .index("successorFeatureId")
      .index("kind"),
  });

/*---------------- geography.assets ----------------*/
export const Assets = geography
  .schema("Assets", {
    featureId: belongsTo(() => Features),
    geometryId: belongsTo(() => Geometries)
      .maybe()
      .description("Set when the file is the drawing of one geometry."),
    versionId: belongsTo(() => Versions).description("The exact stored GIS file, tile set or TopoJSON."),
    kind: dryv.field(enums.AssetKind).description("vector boundary, raster, elevation, tile set, TopoJSON."),
    purposeTerm: term("geo.asset.purpose", "boundary source, elevation, land cover, prepared map output."),
    hierarchyId: belongsTo(() => Hierarchies)
      .maybe()
      .description("For a prepared output: the hierarchy it draws."),
    levelId: belongsTo(() => Levels)
      .maybe()
      .description("For a prepared output: the level it draws."),
    layer: dryv.field(geographyProperties.Layer).maybe().description("Layer name in a multi-layer file."),
    band: dryv.field(sharedProperties.PositiveInteger).maybe().description("One-based raster band."),
    member: dryv.field(geographyProperties.Member).maybe().description("Member path inside an archive."),
    builtAt: dryv.field(sharedProperties.Instant).maybe().description("When a prepared output was built."),
    staleAt: dryv
      .field(sharedProperties.Instant)
      .maybe()
      .description("When a source geometry changed after the build; a stale output is rebuilt."),
  })
  .extends(baseSchemas.CodedEntity)
  .description("A stored GIS file or prepared map output (tile set, TopoJSON) for a feature, through filesystem versions.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("assets")
      .references("AssetGeometryOfFeature", {
        fields: ["geometryId", "featureId"],
        target: () => Geometries,
        targetFields: ["id", "featureId"],
      })
      .index("featureId")
      .index("geometryId")
      .index("versionId")
      .index("hierarchyId", "levelId"),
  });
