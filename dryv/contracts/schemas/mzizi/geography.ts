/**
 * Schema: geography
 * Database: mzizi
 * Responsibility: Canonical geographic identities, territorial specializations and spatial facts.
 * Design: .docs/_plan/schema-redesign/mzizi-db/phase-01/geography.md
 * Review: approved — 2026-11-12
 * Approved definitions: features, units, places, names, identifiers, geometries, relationships, changes, datasets.
 * Approval record: .docs/decisions/DEC-MZIZI-REFERENCE-GEOGRAPHY-20261112.md
 * Generation: excluded until PostGIS types and spatial index semantics are supported by Dryv.
 * Open items: PostGIS geometry/geography, GiST indexing and Reference Legal-basis interface.
 */
import * as dryv from "@dryvcode/author";

import { sharedProperties } from "../_shared.ts";
import { referenceSchemas } from "./reference.ts";

export const geography = dryv
  .group({ name: "geography" })
  .description("Canonical geographic identities, territorial units, physical places and spatial representations.")
  .facets({ storage: { namespace: "geography" } });

export const geographyEnums = geography.properties({
  FeatureKind: dryv.property.enum({ Natural: "natural", HumanMade: "human_made", Administrative: "administrative", Unknown: "unknown" }),
  GeometryKind: dryv.property.enum({
    Point: "point",
    Line: "line",
    Polygon: "polygon",
    MultiPolygon: "multipolygon",
    RasterFootprint: "raster_footprint",
  }),
  DatasetKind: dryv.property.enum({
    Vector: "vector",
    Raster: "raster",
    Elevation: "elevation",
    Climate: "climate",
    Hydrology: "hydrology",
    Soil: "soil",
    Geology: "geology",
    Ecology: "ecology",
    LandCover: "land_cover",
    Imagery: "imagery",
    Historical: "historical",
    Derived: "derived",
  }),
});

export const geographyExpressions = geography.expressions({
  EffectiveWindowMustBeOrdered: dryv.expression.or(
    dryv.expression.equal(dryv.expression.context("value", "valid_from"), dryv.expression.value(null)),
    dryv.expression.equal(dryv.expression.context("value", "valid_until"), dryv.expression.value(null)),
    dryv.expression.lessThan(dryv.expression.context("value", "valid_from"), dryv.expression.context("value", "valid_until")),
  ),
  DatasetResolutionMustBePositive: dryv.expression.or(
    dryv.expression.equal(dryv.expression.context("value", "resolution"), dryv.expression.value(null)),
    dryv.expression.greaterThan(dryv.expression.context("value", "resolution"), dryv.expression.value(0)),
  ),
  RelationshipMustNotBeSelfReferential: dryv.expression.notEqual(
    dryv.expression.context("value", "subject_feature_id"),
    dryv.expression.context("value", "object_feature_id"),
  ),
});

// biome-ignore lint/suspicious/noExplicitAny: supports forward references across the schema definitions below.
export const geographySchemas: Record<string, any> = {};

/*---------------- Approved Geography table contracts ----------------*/
export const Features = geography.schemas({
  Features: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      feature_kind: dryv.field(geographyEnums.FeatureKind),
      created_at: dryv.field(sharedProperties.Instant),
    })
    .description("The sole canonical identity for each geographic entity, independent of type, country or geometry.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("features")
        .primaryKey("id")
        .indexes({ name: "uq_features_code", fields: ["code"], unique: true }, { name: "idx_features_kind", fields: ["feature_kind"] }),
    }),
});
geographySchemas.Features = Features.Features;
/*---------------- End geography.features ----------------*/

export const Units = geography.schemas({
  Units: dryv
    .schema({
      feature_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => geographySchemas.Features.field("id"),
        cardinality: dryv.relation.oneToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      unit_kind_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Value.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      country_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Country.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      valid_from: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      valid_until: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
    })
    .invariant("EffectiveWindowMustBeOrdered", geographyExpressions.EffectiveWindowMustBeOrdered)
    .description(
      "A formally defined administrative, electoral, statistical or historical territorial specialization of one feature; country membership is optional for historic and cross-border units.",
    )
    .role("entity")
    .facets({
      storage: dryv
        .storage("units")
        .primaryKey("feature_id")
        .indexes({ name: "idx_units_kind", fields: ["unit_kind_id"] }, { name: "idx_units_country", fields: ["country_id"] }),
    }),
});
geographySchemas.Units = Units.Units;
/*---------------- End geography.units ----------------*/

export const Places = geography.schemas({
  Places: dryv
    .schema({
      feature_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => geographySchemas.Features.field("id"),
        cardinality: dryv.relation.oneToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      place_kind_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Value.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      is_inhabited: dryv.field(sharedProperties.Flag).optional().nullable(),
    })
    .description("Optional physical-place attributes for a feature; does not create a separate identity.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("places")
        .primaryKey("feature_id")
        .indexes({ name: "idx_places_kind", fields: ["place_kind_id"] }),
    }),
});
geographySchemas.Places = Places.Places;
/*---------------- End geography.places ----------------*/

export const Names = geography.schemas({
  Names: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      feature_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => geographySchemas.Features.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      name: dryv.field(sharedProperties.Name),
      language_tag: dryv.field(sharedProperties.LanguageTag).optional().nullable(),
      name_kind_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Value.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      valid_from: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      valid_until: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      source_ref_id: dryv.field(sharedProperties.Id).optional().nullable(),
    })
    .invariant("EffectiveWindowMustBeOrdered", geographyExpressions.EffectiveWindowMustBeOrdered)
    .description(
      "An official, local, alternative, translated or historical name for a feature, with optional language, validity and provenance reference.",
    )
    .role("entity")
    .facets({
      storage: dryv
        .storage("names")
        .primaryKey("id")
        .indexes(
          { name: "idx_names_feature", fields: ["feature_id"] },
          { name: "idx_names_kind", fields: ["name_kind_id"] },
          { name: "idx_names_language", fields: ["language_tag"] },
        ),
    }),
});
geographySchemas.Names = Names.Names;
/*---------------- End geography.names ----------------*/

export const Identifiers = geography.schemas({
  Identifiers: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      feature_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => geographySchemas.Features.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      scheme: dryv.field(sharedProperties.NonEmptyString255),
      namespace: dryv.field(sharedProperties.NonEmptyString255).optional().nullable(),
      external_id: dryv.field(sharedProperties.NonEmptyString500),
      source_ref_id: dryv.field(sharedProperties.Id).optional().nullable(),
    })
    .description("A preserved identifier assigned to a feature by an external geographic registry or source system.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("identifiers")
        .primaryKey("id")
        .indexes(
          { name: "uq_identifiers_external", fields: ["scheme", "namespace", "external_id"], unique: true },
          { name: "idx_identifiers_feature", fields: ["feature_id"] },
        ),
    }),
});
geographySchemas.Identifiers = Identifiers.Identifiers;
/*---------------- End geography.identifiers ----------------*/

export const Geometries = geography.schemas({
  Geometries: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      feature_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => geographySchemas.Features.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      geometry_kind: dryv.field(geographyEnums.GeometryKind),
      geometry: dryv.field(dryv.unknown()),
      srid: dryv.field(sharedProperties.PositiveInteger),
      valid_from: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      valid_until: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      observed_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      source_ref_id: dryv.field(sharedProperties.Id).optional().nullable(),
      file_version_ref_id: dryv.field(sharedProperties.Id).optional().nullable(),
    })
    .invariant("EffectiveWindowMustBeOrdered", geographyExpressions.EffectiveWindowMustBeOrdered)
    .description(
      "A dated spatial representation version for a feature. The geometry field remains an unsupported Dryv placeholder and is excluded from generation.",
    )
    .role("entity")
    .facets({
      storage: dryv
        .storage("geometries")
        .primaryKey("id")
        .indexes(
          { name: "idx_geometries_feature", fields: ["feature_id"] },
          { name: "idx_geometries_validity", fields: ["valid_from", "valid_until"] },
        ),
    }),
});
geographySchemas.Geometries = Geometries.Geometries;
/*---------------- End geography.geometries ----------------*/

export const Relationships = geography.schemas({
  Relationships: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      subject_feature_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => geographySchemas.Features.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      object_feature_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => geographySchemas.Features.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      relationship_kind_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Value.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      system_code: dryv.field(sharedProperties.IdentityCode),
      valid_from: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      valid_until: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      source_ref_id: dryv.field(sharedProperties.Id).optional().nullable(),
    })
    .invariant("EffectiveWindowMustBeOrdered", geographyExpressions.EffectiveWindowMustBeOrdered)
    .invariant("RelationshipMustNotBeSelfReferential", geographyExpressions.RelationshipMustNotBeSelfReferential)
    .description(
      "A typed, dated directed relationship between features; separate rows allow overlapping administrative, electoral, statistical and other systems.",
    )
    .role("entity")
    .facets({
      storage: dryv
        .storage("relationships")
        .primaryKey("id")
        .indexes(
          { name: "idx_relationships_subject_kind", fields: ["subject_feature_id", "relationship_kind_id"] },
          { name: "idx_relationships_object_kind", fields: ["object_feature_id", "relationship_kind_id"] },
          { name: "idx_relationships_validity", fields: ["valid_from", "valid_until"] },
        ),
    }),
});
geographySchemas.Relationships = Relationships.Relationships;
/*---------------- End geography.relationships ----------------*/

export const Changes = geography.schemas({
  Changes: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      transformation_id: dryv.field(sharedProperties.Id),
      predecessor_feature_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => geographySchemas.Features.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      successor_feature_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => geographySchemas.Features.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      change_kind_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Value.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      effective_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      source_ref_id: dryv.field(sharedProperties.Id).optional().nullable(),
      explanation: dryv.field(sharedProperties.Description).optional().nullable(),
    })
    .description(
      "An edge in a geographic transformation; multiple rows sharing transformation_id represent splits, mergers, creation or dissolution without overwriting predecessor identities.",
    )
    .role("entity")
    .facets({
      storage: dryv
        .storage("changes")
        .primaryKey("id")
        .indexes(
          { name: "idx_changes_transformation", fields: ["transformation_id"] },
          { name: "idx_changes_predecessor", fields: ["predecessor_feature_id"] },
          { name: "idx_changes_successor", fields: ["successor_feature_id"] },
          { name: "idx_changes_kind", fields: ["change_kind_id"] },
        ),
    }),
});
geographySchemas.Changes = Changes.Changes;
/*---------------- End geography.changes ----------------*/

export const Datasets = geography.schemas({
  Datasets: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      title: dryv.field(sharedProperties.NonEmptyString255),
      dataset_kind: dryv.field(geographyEnums.DatasetKind),
      format: dryv.field(sharedProperties.NonEmptyString100),
      crs: dryv.field(sharedProperties.NonEmptyString100).optional().nullable(),
      resolution: dryv.field(sharedProperties.Number).optional().nullable(),
      resolution_unit_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Unit.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      coverage_feature_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => geographySchemas.Features.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      source_ref_id: dryv.field(sharedProperties.Id).optional().nullable(),
      file_version_ref_id: dryv.field(sharedProperties.Id).optional().nullable(),
      quality_notes: dryv.field(sharedProperties.Description).optional().nullable(),
    })
    .invariant("DatasetResolutionMustBePositive", geographyExpressions.DatasetResolutionMustBePositive)
    .description(
      "Catalog metadata for vector, raster, climate, elevation, historical and derived datasets. Large assets remain in the existing Filesystem/SeaweedFS S3 system; external references await executable Source and Filesystem contracts.",
    )
    .role("entity")
    .facets({
      storage: dryv
        .storage("datasets")
        .primaryKey("id")
        .indexes(
          { name: "uq_datasets_code", fields: ["code"], unique: true },
          { name: "idx_datasets_kind", fields: ["dataset_kind"] },
          { name: "idx_datasets_coverage", fields: ["coverage_feature_id"] },
        ),
    }),
});
geographySchemas.Datasets = Datasets.Datasets;
/*---------------- End geography.datasets ----------------*/

export const geographySchemasForReview = {
  Feature: geographySchemas.Features,
  Unit: geographySchemas.Units,
  Place: geographySchemas.Places,
  Name: geographySchemas.Names,
  Identifier: geographySchemas.Identifiers,
  Geometry: geographySchemas.Geometries,
  Relationship: geographySchemas.Relationships,
  Change: geographySchemas.Changes,
  Dataset: geographySchemas.Datasets,
};
