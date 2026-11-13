/**
 * Schema: geography
 * Database: mzizi
 * Responsibility: Canonical geographic identities, territorial specializations and spatial facts.
 * Design: .docs/_plan/schema-redesign/mzizi-db/phase-01/geography.md
 * Review: approved table inventory; proposed classification field alignment — 2026-11-12
 * Approved tables: features, units, places, names, identifiers, geometries, relationships, changes, datasets.
 * Approval record: .docs/decisions/DEC-MZIZI-REFERENCE-GEOGRAPHY-20261112.md
 * Generation: excluded; this draft is not selected by the database application.
 * Open items: scheme-aware Reference constraints, PostGIS geometry/indexes and cross-schema targets.
 */
import * as dryv from "@dryvcode/author";
import { rule, when } from "@dryvcode/author";

import { baseSchemas } from "../_base.ts";
import { sharedProperties } from "../_shared.ts";
import { Value, Country, Unit } from "./reference.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const geography = dryv
  .group({ name: "geography" })
  .description("Canonical geographic identities, territorial units, physical places and spatial representations.")
  .facets({ storage: { namespace: "geography" } });

/*---------------- Approved Geography table contracts ----------------*/
export const Features = geography
  .schema("Features", {
    /** Expected scheme: geography.feature_type; scheme-specific integrity is not yet enforceable. */
    featureTypeId: belongsTo(() => Value),
  })
  .extends(baseSchemas.CodedEntity)
  .description("The sole canonical identity for each geographic entity, independent of type, country or geometry.")
  .role("entity")
  .facets({
    storage: dryv.storage("features").index("featureTypeId"),
  });

export const Units = geography
  .schema("Units", {
    featureId: dryv.field(sharedProperties.Id).relation({
      target: (): dryv.SchemaFieldRef<unknown> => Features.field("id"),
      cardinality: dryv.relation.oneToOne(),
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
    countryId: belongsTo(() => Country).maybe(),
    validFrom: dryv.field(sharedProperties.CalendarDate).maybe(),
    validUntil: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .rule("EffectiveWindowMustBeOrdered", rule.ordered("validFrom", "validUntil"))
  .description(
    "A formally defined administrative, electoral, statistical or historical territorial specialization of one feature; country membership is optional for historic and cross-border units.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("units").primaryKey("featureId").index("countryId").index("validFrom", "validUntil"),
  });

export const Places = geography
  .schema("Places", {
    featureId: dryv.field(sharedProperties.Id).relation({
      target: (): dryv.SchemaFieldRef<unknown> => Features.field("id"),
      cardinality: dryv.relation.oneToOne(),
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
    isInhabited: dryv.field(sharedProperties.Flag).maybe(),
  })
  .description("Optional physical-place attributes for a feature; does not create a separate identity.")
  .role("entity")
  .facets({ storage: dryv.storage("places").primaryKey("featureId") });

export const Names = geography
  .schema("Names", {
    featureId: belongsTo(() => Features),
    name: dryv.field(sharedProperties.Name),
    languageTag: dryv.field(sharedProperties.LanguageTag).maybe(),
    nameKindId: belongsTo(() => Value),
    sourceRefId: dryv.field(sharedProperties.Id).maybe(),
  })
  .extends(baseSchemas.ValidityEntity)
  .description(
    "An official, local, alternative, translated or historical name for a feature, with optional language, validity and provenance reference.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("names").index("featureId").index("nameKindId").index("languageTag"),
  });

export const Identifiers = geography
  .schema("Identifiers", {
    featureId: belongsTo(() => Features),
    identifierSchemeId: belongsTo(() => Value),
    namespace: dryv.field(sharedProperties.NonEmptyString255).maybe(),
    externalId: dryv.field(sharedProperties.NonEmptyString500),
    sourceRefId: dryv.field(sharedProperties.Id).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("A preserved identifier assigned to a feature by an external geographic registry or source system.")
  .role("entity")
  .facets({
    storage: dryv.storage("identifiers").unique("identifierSchemeId", "namespace", "externalId").index("featureId"),
  });

export const Geometries = geography
  .schema("Geometries", {
    featureId: belongsTo(() => Features),
    /** Expected scheme: geography.geometry_role; geometry subtype comes from PostGIS storage. */
    geometryRoleId: belongsTo(() => Value),
    geometry: dryv.field(dryv.unknown()),
    srid: dryv.field(sharedProperties.PositiveInteger),
    observedAt: dryv.field(sharedProperties.Instant).maybe(),
    sourceRefId: dryv.field(sharedProperties.Id).maybe(),
    fileVersionRefId: dryv.field(sharedProperties.Id).maybe(),
  })
  .extends(baseSchemas.ValidityEntity)
  .description(
    "A dated spatial representation version for a feature. The geometry field remains an unsupported Dryv placeholder and is excluded from generation.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("geometries").index("featureId").index("validFrom", "validUntil"),
  });

export const Relationships = geography
  .schema("Relationships", {
    subjectFeatureId: belongsTo(() => Features),
    objectFeatureId: belongsTo(() => Features),
    /** Expected scheme: geography.relationship_type. */
    relationshipKindId: belongsTo(() => Value),
    /** Expected scheme: geography.relationship_system. */
    systemId: belongsTo(() => Value),
    sourceRefId: dryv.field(sharedProperties.Id).maybe(),
  })
  .extends(baseSchemas.ValidityEntity)
  .rule("RelationshipMustNotBeSelfReferential", rule.differs("subjectFeatureId", "objectFeatureId"))
  .description(
    "A typed, dated directed relationship between features; separate rows allow overlapping administrative, electoral, statistical and other systems.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("relationships")
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
    sourceRefId: dryv.field(sharedProperties.Id).maybe(),
    explanation: dryv.field(sharedProperties.Description).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description(
    "An edge in a geographic transformation; multiple rows sharing transformation_id represent splits, mergers, creation or dissolution without overwriting predecessor identities.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("changes").index("transformationId").index("predecessorFeatureId").index("successorFeatureId").index("changeKindId"),
  });

export const Datasets = geography
  .schema("Datasets", {
    title: dryv.field(sharedProperties.NonEmptyString255),
    /** Expected scheme: geography.dataset_subject. */
    subjectId: belongsTo(() => Value),
    /** Expected scheme: geography.dataset_representation. */
    representationId: belongsTo(() => Value),
    format: dryv.field(sharedProperties.NonEmptyString100),
    crs: dryv.field(sharedProperties.NonEmptyString100).maybe(),
    resolution: dryv.field(sharedProperties.Number).maybe(),
    resolutionUnitId: belongsTo(() => Unit).maybe(),
    coverageFeatureId: belongsTo(() => Features).maybe(),
    sourceRefId: dryv.field(sharedProperties.Id).maybe(),
    fileVersionRefId: dryv.field(sharedProperties.Id).maybe(),
    qualityNotes: dryv.field(sharedProperties.Description).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("DatasetResolutionMustBePositive", (v) => when.any(v.resolution.isNull(), v.resolution.gt(0)))
  .description(
    "Catalog metadata for vector, raster, climate, elevation, historical and derived datasets. Large assets remain in the existing Filesystem/SeaweedFS S3 system; external references await executable Source and Filesystem contracts.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("datasets").index("subjectId").index("representationId").index("coverageFeatureId"),
  });
