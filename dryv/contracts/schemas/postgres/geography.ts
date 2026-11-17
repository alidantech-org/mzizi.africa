/**
 * Schema: geography
 * Database: mzizi
 * Responsibility: Canonical geographic identities, territorial specializations and spatial facts.
 * Design: .docs/_plan/schema-redesign/mzizi-db/phase-01/geography.md
 * Review: approved table inventory; proposed classification field alignment — 2026-11-12
 * Tables: features, names, classifications, identifiers, geometries, relationships, changes, assets (datasets removed 2026-11-17).
 * Approval record: .docs/decisions/DEC-MZIZI-REFERENCE-GEOGRAPHY-20261112.md; redesign task TSK-C145D32860A4.
 * Open items: scheme-aware Reference constraints and PostGIS geometry/indexes.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";

import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { FileVersions } from "./filesystem.ts";
import { Language, Value } from "./reference.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const geography = dryv
  .group({ name: "geography" })
  .description("Canonical geographic identities, territorial units, physical places and spatial representations.")
  .facets({ storage: { namespace: "geography", store: "main" } });

/*---------------- Approved Geography table contracts ----------------*/
export const Features = geography
  .schema("Features", {
    /** Scheme geo.feature.kind. A kind says whether a feature is a country, county, river, dam, road or territory. */
    featureTypeId: belongsTo(() => Value).tags("scheme:ref.sch.geo.feature.kind"),
  })
  .extends(baseSchemas.CodedHistoricalEntity)
  .description(
    "The sole canonical identity for each geographic entity, whatever its type. Country, parentage and administrative or electoral membership are dated relationships, never columns here.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("features").index("featureTypeId").index("validFrom", "validUntil"),
  });

export const Names = geography
  .schema("Names", {
    featureId: belongsTo(() => Features),
    name: dryv.field(sharedProperties.Name),
    /** The language of this form. `mul` for a form shared by languages ("Kenya"), `und` when none is asserted; never blank. */
    languageId: belongsTo(() => Language),
    nameKindId: belongsTo(() => Value).tags("scheme:ref.sch.geo.name.kind"),
    /** The name shown when no other is asked for, in its language: at most one per feature and language. */
    isDefault: dryv.field(sharedProperties.Flag),
  })
  .extends(baseSchemas.ValidityEntity)
  .description(
    "A canonical, official, local, alternative, translated or historical name for a feature, with its language (`mul` or `und` when no single language applies), validity and provenance reference.",
  )
  .role("entity");

const defaultName = geography.expression(
  "DefaultName",
  Names.check((v) => v.isDefault.eq(true)),
);

Names.facets({
  storage: dryv
    .storage("names")
    .unique("featureId", "nameKindId", "languageId", "name")
    .unique("featureId", "languageId")
    .where(defaultName)
    .index("featureId")
    .index("nameKindId")
    .index("languageId"),
});

export const Classifications = geography
  .schema("Classifications", {
    featureId: belongsTo(() => Features),
    /**
     * Any value from a classification scheme; the value's scheme says which question it answers: geo.feature.nature (natural, built,
     * administrative, cultural), geo.feature.function (hospital, school, market), geo.feature.reality (existing, ended,
     * reconstructed, legendary). A feature's main kind stays on `features`; these add the other answers, with dates.
     */
    valueId: belongsTo(() => Value),
  })
  .extends(baseSchemas.HistoricalValidityEntity)
  .description(
    "One dated classification of a feature by a scheme value, so a feature can answer several classification questions and change over time.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("classifications").unique("featureId", "valueId", "validFrom").index("featureId").index("valueId"),
  });

export const Identifiers = geography
  .schema("Identifiers", {
    featureId: belongsTo(() => Features),
    identifierSchemeId: belongsTo(() => Value).tags("scheme:ref.sch.geo.identifier.scheme"),
    namespace: dryv.field(sharedProperties.NonEmptyString255).maybe(),
    externalId: dryv.field(sharedProperties.NonEmptyString500),
  })
  .extends(baseSchemas.Entity)
  .description("A preserved identifier assigned to a feature by an external geographic registry or source system.")
  .role("entity")
  .facets({
    storage: dryv.storage("identifiers").unique("identifierSchemeId", "namespace", "externalId").index("featureId"),
  });

const calculations = geography.expressions({
  GeometryEnvelope: dryv.expression.spatial.envelope("geometry"),
  GeometryCentroid: dryv.expression.spatial.centroid("geometry"),
  GeometryArea: dryv.expression.spatial.area("geometry"),
});

const geometry = (shape: dryv.GeometryShape) => dryv.geometry({ shape, srid: 4326 });
const spatialTypes = geography.properties({
  GeometryArea: dryv.property.number.double(),
});

export const Geometries = geography
  .schema("Geometries", {
    featureId: belongsTo(() => Features),
    /** Expected scheme: geo.geometry.role (outline, centroid, label point, claimed outline). */
    geometryRoleId: belongsTo(() => Value).tags("scheme:ref.sch.geo.geometry.role"),
    /** Expected scheme: geo.geometry.basis (surveyed, reconstructed, approximate, illustrative, traditional claim). */
    basisId: belongsTo(() => Value).tags("scheme:ref.sch.geo.geometry.basis"),
    /** 1 for the first drawing of this role, rising with each new drawing of the same feature and role. */
    revision: dryv.field(sharedProperties.PositiveInteger),
    /** The geometry this one replaces; a feature keeps every earlier drawing. */
    supersedesId: belongsTo(dryv.self).maybe(),
    /** How far to trust the drawing, 0 to 1. */
    confidence: dryv.field(sharedProperties.Confidence).maybe(),
    /** The zoom levels (0 to 22) this drawing is meant for: a simplified one for small zooms, a detailed one for large. */
    minZoom: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    maxZoom: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    geometry: dryv.field(geometry("any")),
    envelope: dryv.field(geometry("any")).generated(calculations.GeometryEnvelope),
    centroid: dryv.field(geometry("point")).generated(calculations.GeometryCentroid),
    area: dryv.field(spatialTypes.GeometryArea).generated(calculations.GeometryArea),
    srid: dryv.field(sharedProperties.PositiveInteger),
    observedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.HistoricalValidityEntity)
  .rule("ZoomRangeMustBeOrdered", rule.ordered("minZoom", "maxZoom"))
  .rule("GeometryMustNotSupersedeItself", rule.differs("id", "supersedesId"))
  .description(
    "One drawing of a feature: a revision with a role, a basis, a confidence, a zoom range, a validity period and the stored file it came from. A feature has many; the current one has no end date.",
  )
  .role("entity");

const geometryRules = geography.expressions({
  CurrentGeometry: Geometries.check((row) => row.validUntil.isNull()),
});

const geometryQueries = geography.queries({
  CurrentGeometries: dryv.readQuery
    .from(Geometries.asRef())
    .where((row) => [row.fields.validUntil.isNull()])
    .select((row) => ({
      id: row.fields.id,
      featureId: row.fields.featureId,
      geometry: row.fields.geometry,
      centroid: row.fields.centroid,
      area: row.fields.area,
    })),
});

Geometries.facets({
  storage: dryv
    .storage("geometries")
    .unique("featureId", "geometryRoleId", "revision")
    .unique("featureId", "geometryRoleId")
    .where(geometryRules.CurrentGeometry)
    .index("featureId", "geometryRoleId")
    .index("validFrom", "validUntil")
    .unique("id", "featureId")
    .index("basisId")
    .index("geometry")
    .using("gist"),
}).views({ current_geometries: { query: geometryQueries.CurrentGeometries } });

export const Relationships = geography
  .schema("Relationships", {
    subjectFeatureId: belongsTo(() => Features),
    objectFeatureId: belongsTo(() => Features),
    /** Expected scheme: geo.relationship.kind (part-of, flows-through, located-on, connects, borders, replaced-by). */
    relationshipKindId: belongsTo(() => Value).tags("scheme:ref.sch.geo.relationship.kind"),
    /** Expected scheme: geo.relationship.system (administrative, electoral, statistical, hydrological, historical). */
    systemId: belongsTo(() => Value).tags("scheme:ref.sch.geo.relationship.system"),
  })
  .extends(baseSchemas.HistoricalValidityEntity)
  .rule("RelationshipMustNotBeSelfReferential", rule.differs("subjectFeatureId", "objectFeatureId"))
  .description(
    "A typed, dated directed relationship between features; separate rows allow overlapping administrative, electoral, statistical and other systems.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("relationships")
      .unique("subjectFeatureId", "objectFeatureId", "relationshipKindId", "systemId", "validFrom")
      .index("subjectFeatureId", "relationshipKindId")
      .index("objectFeatureId", "relationshipKindId")
      .index("validFrom", "validUntil"),
  });

export const Changes = geography
  .schema("Changes", {
    transformationId: dryv.field(sharedProperties.Id),
    predecessorFeatureId: belongsTo(() => Features).maybe(),
    successorFeatureId: belongsTo(() => Features).maybe(),
    changeKindId: belongsTo(() => Value),
    effectiveOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    explanation: dryv.field(sharedProperties.Description).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description(
    "An edge in a geographic transformation; multiple rows sharing transformation_id represent splits, mergers, creation or dissolution without overwriting predecessor identities.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("changes")
      .unique("transformationId", "predecessorFeatureId", "successorFeatureId")
      .index("transformationId")
      .index("predecessorFeatureId")
      .index("successorFeatureId")
      .index("changeKindId"),
  });

export const AssetSelectors = geography.properties({
  /** Layer name in a multi-layer file such as a GeoPackage. */
  Layer: dryv.property.string().length({ min: 1, max: 255 }),
  /** Member path inside an archive. */
  Member: dryv.property.string().length({ min: 1, max: 1000 }),
});

export const Assets = geography
  .schema("Assets", {
    /** Every asset belongs to a feature. */
    featureId: belongsTo(() => Features),
    /** Set when the file is the drawing of one geometry; that geometry must belong to `featureId`. */
    geometryId: belongsTo(() => Geometries).maybe(),
    /** The exact immutable GIS file. */
    fileVersionId: belongsTo(() => FileVersions),
    /** Expected scheme: geo.asset.kind (vector boundary, raster surface, elevation, mosaic, layer package). */
    kindId: belongsTo(() => Value).tags("scheme:ref.sch.geo.asset.kind"),
    /** Expected scheme: geo.asset.purpose (boundary source, elevation, land cover, reference). */
    purposeId: belongsTo(() => Value).tags("scheme:ref.sch.geo.asset.purpose"),
    description: dryv.field(sharedProperties.Description).maybe(),
    layer: dryv.field(AssetSelectors.Layer).maybe(),
    /** One-based raster band. */
    band: dryv.field(sharedProperties.PositiveInteger).maybe(),
    member: dryv.field(AssetSelectors.Member).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "A stored GIS file used for a feature or for one of its geometries. One file can serve many features and a feature can have many files. Photographs and video are filesystem media; acquisition and provenance belong to Source.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("assets")
      .references("AssetGeometryBelongsToFeature", {
        fields: ["geometryId", "featureId"],
        target: () => Geometries,
        targetFields: ["id", "featureId"],
      })
      .index("featureId")
      .index("geometryId")
      .index("fileVersionId")
      .index("kindId")
      .index("purposeId"),
  });
