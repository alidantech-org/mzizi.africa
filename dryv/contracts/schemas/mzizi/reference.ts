/**
 * Schema: reference | Database: mzizi
 * Design: .docs/_plan/schema-redesign/mzizi-db/phase-01/reference.md
 * Review: accepted foundation inventory; current detailed field contract requires reconciliation.
 * Countries are canonical modern-country identities; spatial units belong to Geography.
 * No fictional world country or mandatory country membership is implied.
 * Geography, Filesystem and Legal relations must be verified through same-database composition and pack generation.
 * SQL-level scheme checks, composite FKs, partial indexes and transitive cycle constraints are unsupported by the current pack.
 */
import * as dryv from "@dryvcode/author";

import { sharedProperties } from "../_shared.ts";

export const reference = dryv
  .group({ name: "reference" })
  .description("Shared country identities, controlled meanings, measurement units and reviewed patterns.")
  .facets({ storage: { namespace: "reference" } });

/** Compatibility alias for the existing database application and named read operations. */
export const vocabulary = reference;

export const referenceExpressions = reference.expressions({
  UnitScaleMustBePositive: dryv.expression.greaterThan(dryv.expression.context("value", "scale"), dryv.expression.value(0)),
  ValueMustNotSupersedeItself: dryv.expression.notEqual(
    dryv.expression.context("value", "id"),
    dryv.expression.context("value", "supersedes_id"),
  ),
  TopicMustNotParentItself: dryv.expression.notEqual(dryv.expression.context("value", "id"), dryv.expression.context("value", "parent_id")),
  EffectiveWindowMustBeOrdered: dryv.expression.or(
    dryv.expression.equal(dryv.expression.context("value", "effective_until"), dryv.expression.value(null)),
    dryv.expression.lessThan(dryv.expression.context("value", "effective_from"), dryv.expression.context("value", "effective_until")),
  ),
  DependencyMustNotBeSelf: dryv.expression.notEqual(
    dryv.expression.context("value", "version_id"),
    dryv.expression.context("value", "requires_id"),
  ),
});

/** Kept as an export for callers of the previous Reference draft. */
export const vocabularyProperties = reference.properties({
  LabelKind: dryv.property.enum({
    preferred: "preferred",
    alternate: "alternate",
  }),
});

/*---------------- Proposed Reference table contracts ----------------*/
// biome-ignore lint/suspicious/noExplicitAny: supports forward references across the schema definitions below.
export const referenceSchemas: Record<string, any> = {};

export const Countries = reference.schemas({
  Country: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      /** Stable project identity code, independent of external country-code standards. */
      code: dryv.field(sharedProperties.IdentityCode),
      name: dryv.field(sharedProperties.Name),
    })
    .description("Canonical identity for a modern country; not a geographic unit or historical polity.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("countries")
        .primaryKey("id")
        .indexes({ name: "uq_countries_code", fields: ["code"], unique: true }, { name: "idx_countries_name", fields: ["name"] }),
    }),
});
/** Country identity is independent of whether another record has a country relationship. */
/** The inbound Geography FK must be declared with geography.units when that contract is authored. */
/*---------------- End reference.countries ----------------*/
referenceSchemas.Country = Countries.Country;

export const Schemes = reference.schemas({
  Scheme: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      title: dryv.field(sharedProperties.Name),
      owner_snapshot: dryv.field(sharedProperties.NonEmptyString255),
    })
    .description("Stable identity and stewardship snapshot for a controlled vocabulary scheme.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("schemes")
        .primaryKey("id")
        .indexes({ name: "uq_schemes_code", fields: ["code"], unique: true }),
    }),
});
/*---------------- End reference.schemes ----------------*/
referenceSchemas.Scheme = Schemes.Scheme;

export const Values = reference.schemas({
  Value: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      scheme_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Scheme.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      /** Codes follow the repository-wide globally unique identity-code rule. */
      code: dryv.field(sharedProperties.IdentityCode),
      label: dryv.field(sharedProperties.Name),
      supersedes_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Value.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
    })
    .invariant("ValueDoesNotSupersedeItself", referenceExpressions.ValueMustNotSupersedeItself)
    .description("A controlled classification member within one scheme, with optional supersession.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("values")
        .primaryKey("id")
        .indexes(
          { name: "uq_values_code", fields: ["code"], unique: true },
          { name: "idx_values_scheme_id", fields: ["scheme_id"] },
          { name: "idx_values_supersedes_id", fields: ["supersedes_id"] },
        ),
    }),
});
/*---------------- End reference.values ----------------*/
/** Same-scheme supersession and transitive acyclicity require a database operation/constraint. */
referenceSchemas.Value = Values.Value;

export const Units = reference.schemas({
  Unit: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      symbol: dryv.field(sharedProperties.NonEmptyString100),
      quantity: dryv.field(sharedProperties.NonEmptyString255),
      scale: dryv.field(sharedProperties.Number),
      offset: dryv.field(sharedProperties.Number),
      base_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Unit.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
    })
    .invariant("ScaleMustBePositive", referenceExpressions.UnitScaleMustBePositive)
    .description("Measurement unit and conversion to its optional base unit; never a spatial unit.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("units")
        .primaryKey("id")
        .indexes({ name: "uq_units_code", fields: ["code"], unique: true }, { name: "idx_units_base_id", fields: ["base_id"] }),
    }),
});
/*---------------- End reference.units ----------------*/
/** Conversion scale precision and base-unit cycle checks require storage-pack/database verification. */
referenceSchemas.Unit = Units.Unit;

export const Topics = reference.schemas({
  Topic: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      label: dryv.field(sharedProperties.Name),
      parent_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Topic.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
    })
    .invariant("TopicDoesNotParentItself", referenceExpressions.TopicMustNotParentItself)
    .description("Cross-domain discovery topic hierarchy; topics do not own domain records.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("topics")
        .primaryKey("id")
        .indexes({ name: "uq_topics_code", fields: ["code"], unique: true }, { name: "idx_topics_parent_id", fields: ["parent_id"] }),
    }),
});
/*---------------- End reference.topics ----------------*/
/** Transitive topic-cycle prevention requires a database operation/constraint. */
referenceSchemas.Topic = Topics.Topic;

export const Patterns = reference.schemas({
  Pattern: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      title: dryv.field(sharedProperties.Name),
    })
    .description("Stable identity for a reusable, reviewed pattern definition.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("patterns")
        .primaryKey("id")
        .indexes({ name: "uq_patterns_code", fields: ["code"], unique: true }),
    }),
});
/*---------------- End reference.patterns ----------------*/
referenceSchemas.Pattern = Patterns.Pattern;

export const PatternVersions = reference.schemas({
  PatternVersion: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      pattern_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Pattern.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      edition: dryv.field(sharedProperties.PositiveInteger),
      /** Typed artifact reference; filesystem.file_versions has no authored entity contract yet. */
      file_version_id: dryv.field(sharedProperties.Id),
      digest: dryv.field(sharedProperties.Sha256),
    })
    .description("Immutable, reviewed release of a pattern; Engine owns execution state.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("pattern_versions")
        .primaryKey("id")
        .indexes(
          { name: "uq_pattern_versions_pattern_edition", fields: ["pattern_id", "edition"], unique: true },
          { name: "idx_pattern_versions_file_version_id", fields: ["file_version_id"] },
        ),
    }),
});
/** FK gap: add the real relation to filesystem.file_versions when that schema authors its entity. */
/*---------------- End reference.pattern_versions ----------------*/
referenceSchemas.PatternVersion = PatternVersions.PatternVersion;

export const PatternBindings = reference.schemas({
  PatternBinding: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      version_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.PatternVersion.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      /**
       * Proposed FK target is geography.units.feature_id. Keep as typed ID until the database app
       * composes Geography and the country/unit consistency rule is enforceable.
       */
      unit_id: dryv.field(sharedProperties.Id).optional().nullable(),
      /** Optional country scope; a country-wide geographic scope also identifies its country unit. */
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
      /**
       * Existing proposal targets legal.provision_versions. The FK is not encoded until the target
       * Legal contract exists and its relationship to a Reference-owned domain bridge is resolved.
       */
      provision_id: dryv.field(sharedProperties.Id).optional().nullable(),
      /** Inclusive lower date; Dryv has no native daterange storage property. */
      effective_from: dryv.field(sharedProperties.CalendarDate),
      /** Exclusive upper date; null means no known end. */
      effective_until: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
    })
    .invariant("EffectiveWindowIsOrdered", referenceExpressions.EffectiveWindowMustBeOrdered)
    .description("Country, geographic-unit and time applicability of an approved pattern release.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("pattern_bindings")
        .primaryKey("id")
        .indexes(
          { name: "idx_pattern_bindings_version_scope_time", fields: ["version_id", "country_id", "unit_id", "effective_from"] },
          { name: "idx_pattern_bindings_country_id", fields: ["country_id"] },
          { name: "idx_pattern_bindings_unit_id", fields: ["unit_id"] },
          { name: "idx_pattern_bindings_provision_id", fields: ["provision_id"] },
          { name: "idx_pattern_bindings_effective_from", fields: ["effective_from"] },
        ),
    }),
});
/**
 * Open relationships: Geography has not yet authored geography.units, Filesystem has not authored
 * filesystem.file_versions, and the Reference-owned Legal bridge is unresolved. Keep the typed IDs;
 * ensure country_id and unit_id identify compatible scopes; do not invent a Legal proxy or claim
 * these cross-schema FKs are enforced. The SQL pack must preserve effective interval ordering and
 * uniqueness semantics for nullable scope bindings before this contract is generation-ready.
 */
/*---------------- End reference.pattern_bindings ----------------*/
referenceSchemas.PatternBinding = PatternBindings.PatternBinding;

export const PatternDependencies = reference.schemas({
  PatternDependency: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      version_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.PatternVersion.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      requires_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.PatternVersion.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
    })
    .invariant("DependencyMustNotBeSelf", referenceExpressions.DependencyMustNotBeSelf)
    .description("Pinned dependency between two Reference pattern releases.")
    .role("entity")
    .facets({
      storage: dryv
        .storage("pattern_dependencies")
        .primaryKey("id")
        .indexes(
          { name: "uq_pattern_dependencies_pair", fields: ["version_id", "requires_id"], unique: true },
          { name: "idx_pattern_dependencies_requires_id", fields: ["requires_id"] },
        ),
    }),
});
/** Acyclicity beyond self-reference requires a transaction-level database constraint or operation. */
/*---------------- End reference.pattern_dependencies ----------------*/
referenceSchemas.PatternDependency = PatternDependencies.PatternDependency;

/*---------------- Proposed Reference classification extension ----------------*/
/**
 * Proposal-only group. It is not composed into contracts/apps/database/index.ts and must not be
 * included in generation until the owner approves the extension and the SQL pack supports its
 * relation, time and uniqueness constraints.
 */
export const referenceProposals = dryv
  .group({ name: "reference-proposals" })
  .description("Unapproved Reference schema extensions for review; excluded from database applications.")
  .facets({ storage: { namespace: "reference" } });

export const referenceProposalEnums = referenceProposals.properties({
  ValueRelationKind: dryv.property.enum({
    BroaderThan: "broader_than",
    NarrowerThan: "narrower_than",
    RelatedTo: "related_to",
  }),
});

export const referenceProposalExpressions = referenceProposals.expressions({
  ValueRelationMustNotBeSelfReferential: dryv.expression.notEqual(
    dryv.expression.context("value", "source_value_id"),
    dryv.expression.context("value", "target_value_id"),
  ),
  ValueRelationWindowMustBeOrdered: dryv.expression.or(
    dryv.expression.equal(dryv.expression.context("value", "valid_from"), dryv.expression.value(null)),
    dryv.expression.equal(dryv.expression.context("value", "valid_until"), dryv.expression.value(null)),
    dryv.expression.lessThan(dryv.expression.context("value", "valid_from"), dryv.expression.context("value", "valid_until")),
  ),
});

export const ProposedValueRelations = referenceProposals.schemas({
  ValueRelation: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      source_value_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Value.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      target_value_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => referenceSchemas.Value.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      relation_kind: dryv.field(referenceProposalEnums.ValueRelationKind),
      valid_from: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
      valid_until: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
    })
    .invariant("ValueRelationMustNotBeSelfReferential", referenceProposalExpressions.ValueRelationMustNotBeSelfReferential)
    .invariant("ValueRelationWindowMustBeOrdered", referenceProposalExpressions.ValueRelationWindowMustBeOrdered)
    .description(
      "Proposed directed, typed, time-aware relation between classification values; supports multi-parent and cross-scheme taxonomy.",
    )
    .role("entity")
    .facets({
      storage: dryv
        .storage("value_relations")
        .primaryKey("id")
        .indexes(
          { name: "idx_value_relations_source_edge", fields: ["source_value_id", "relation_kind", "valid_from"] },
          { name: "idx_value_relations_target", fields: ["target_value_id", "relation_kind"] },
        ),
    }),
});
/** Proposal only: temporal edge uniqueness needs a PostgreSQL exclusion constraint, not yet supported by Dryv. */
/** Do not add this group to database app composition without explicit approval and that persistence capability. */
export const proposedReferenceSchemas = { ValueRelation: ProposedValueRelations.ValueRelation };

/** Compatibility surface consumed by the existing database read operations. */
export const vocabularySchemas = {
  Scheme: referenceSchemas.Scheme,
  Value: referenceSchemas.Value,
};

/** No Reference-owned Legal bridge table is defined until its target semantics are decided. */
/*---------------- End proposed Reference–Legal bridge: design decision pending ----------------*/
